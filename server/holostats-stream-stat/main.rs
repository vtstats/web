use anyhow::Result;
use chrono::Utc;
use holostats_config::CONFIG;
use holostats_database::{streams::StreamStatus as StreamStatus_, Database};
use holostats_request::{RequestHub, StreamStatus};
use holostats_tracing::init;
use tracing::instrument;

#[tokio::main]
async fn main() -> Result<()> {
    let _guard = init("stream_stat", false);

    real_main().await
}

#[instrument(
    name = "stream_stat"
    fields(
        service.name = "holostats-cron",
        span.kind = "consumer"
    ),
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

    db.terminate_stream(&offline_ids, now).await?;

    for stream in streams {
        if let Some(vtb) = CONFIG.find_by_youtube_channel_id(&stream.channel_id) {
            let payload = &format!("{},{}", vtb.id, stream.id);

            // sends a notification to other clients
            if let Err(err) = db.notify("get_live_chat", payload).await {
                eprintln!(
                    "Failed to notify `get_live_chat` channel w/ payload `{}`: {}",
                    payload, err
                );
            }
        }

        db.update_youtube_stream_statistic(
            stream.id,
            stream.title,
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
            stream.likes,
        )
        .await?;
    }

    Ok(())
}
