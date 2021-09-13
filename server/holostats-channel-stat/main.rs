use anyhow::Result;
use chrono::Utc;
use holostats_config::CONFIG;
use holostats_database::Database;
use holostats_request::RequestHub;
use holostats_utils::tracing::init;
use tracing::instrument;

#[tokio::main]
async fn main() -> Result<()> {
    let _guard = init("channel_stat", false);

    real_main().await
}

#[instrument(
    name = "channel_stat"
    span.kind = "consumer"
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
        .await?;
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
        .await?;
    }

    Ok(())
}
