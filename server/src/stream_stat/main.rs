#[path = "../config.rs"]
mod config;
#[path = "../database/mod.rs"]
mod database;
#[path = "../error.rs"]
mod error;
#[path = "../requests/mod.rs"]
mod requests;
#[path = "../utils.rs"]
mod utils;

use chrono::Utc;
use tracing::instrument;

use crate::database::{streams::StreamStatus as StreamStatus_, Database};
use crate::error::{Error, Result};
use crate::requests::{RequestHub, StreamStatus};

#[tokio::main]
async fn main() -> Result<()> {
    utils::init_logger();

    let _guard = utils::init_tracing("stream_stat", false);

    real_main().await
}

#[instrument(
    name = "stream_stat"
    fields(service.name = "holostats-cron"),
)]
async fn real_main() -> Result<()> {
    let hub = RequestHub::new();

    let db = Database::new().await?;

    let ids = db.youtube_ongoing_streams().await?;

    if ids.is_empty() {
        return Ok(());
    }

    let streams = hub.youtube_streams(&ids).await?;

    let now = Utc::now();

    let offline_ids = ids
        .into_iter()
        .filter(|id| !streams.iter().any(|stream| stream.id.eq(id)))
        .collect::<Vec<_>>();

    db.terminate_stream(&offline_ids, now)
        .await
        .map_err(Error::Database)?;

    for stream in streams {
        db.update_youtube_stream_statistic(
            stream.id,
            now,
            match stream.status {
                StreamStatus::Ended => StreamStatus_::Ended,
                StreamStatus::Live => StreamStatus_::Live,
                StreamStatus::Scheduled => StreamStatus_::Scheduled,
            },
            stream.schedule_time,
            stream.start_time,
            stream.end_time,
            stream.viewers,
        )
        .await
        .map_err(Error::Database)?;
    }

    Ok(())
}
