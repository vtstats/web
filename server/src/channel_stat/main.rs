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
use config::CONFIG;
use tracing::instrument;

use crate::database::Database;
use crate::error::{Error, Result};
use crate::requests::RequestHub;

#[tokio::main]
async fn main() -> Result<()> {
    utils::init_logger();

    let _guard = utils::init_tracing("channel_stat", false);

    real_main().await
}

#[instrument(
    name = "channel_stat"
    fields(service.name = "holostats-cron")
)]
async fn real_main() -> Result<()> {
    let hub = RequestHub::new();

    let db = Database::new().await?;

    let now = Utc::now();

    let ids = CONFIG
        .vtubers
        .iter()
        .filter_map(|v| v.bilibili.as_ref())
        .map(|id| id.as_str())
        .collect::<Vec<_>>();

    let channels = hub.bilibili_channels(ids).await?;

    for channel in channels {
        let vtuber_id = match CONFIG.find_by_bilibili_channel_id(&channel.id) {
            Some(vtb) => &vtb.id,
            _ => continue,
        };

        db.update_bilibili_channel_statistic(
            vtuber_id,
            now,
            channel.view_count,
            channel.subscriber_count,
        )
        .await
        .map_err(Error::Database)?;
    }

    let ids = CONFIG
        .vtubers
        .iter()
        .filter_map(|v| v.youtube.as_ref())
        .map(|id| id.as_str())
        .collect::<Vec<_>>();

    let channels = hub.youtube_channels(ids).await?;

    for channel in channels {
        let vtuber_id = match CONFIG.find_by_youtube_channel_id(&channel.id) {
            Some(vtb) => &vtb.id,
            _ => continue,
        };

        db.update_youtube_channel_statistic(
            vtuber_id,
            now,
            channel.view_count,
            channel.subscriber_count,
        )
        .await
        .map_err(Error::Database)?;
    }

    Ok(())
}
