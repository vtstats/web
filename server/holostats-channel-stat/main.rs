use anyhow::Result;
use chrono::{DateTime, Utc};
use holostats_config::CONFIG;
use holostats_database::Database;
use holostats_request::RequestHub;
use tracing::{field::Empty, Instrument, Span};

#[tokio::main]
async fn main() -> Result<()> {
    let _guard = holostats_tracing::init("channel_stat", false);

    let hub = RequestHub::new();

    let db = Database::new().await?;

    let now = Utc::now();

    let fut = async {
        if let Err(err) = bilibili_channels_stats(&hub, &db, now).await {
            Span::current().record("otel.status_code", &"ERROR");
            tracing::error!("Failed to fetch channel stats, {:?}", err);
        }

        if let Err(err) = youtube_channels_stats(&hub, &db, now).await {
            Span::current().record("otel.status_code", &"ERROR");
            tracing::error!("Failed to fetch channel stats, {:?}", err);
        }
    };

    let span = tracing::info_span!(
        "channel_stat",
        service.name = "holostats-cron",
        span.kind = "consumer",
        otel.status_code = Empty
    );

    fut.instrument(span).await;

    Ok(())
}

async fn bilibili_channels_stats(
    hub: &RequestHub,
    db: &Database,
    now: DateTime<Utc>,
) -> Result<()> {
    let ids = CONFIG
        .vtubers
        .iter()
        .filter_map(|v| v.bilibili.as_deref())
        .collect::<Vec<_>>();

    let channels = hub.bilibili_channels(ids).await?;

    for channel in channels {
        let vtuber_id = match CONFIG.find_by_bilibili_channel_id(&channel.id) {
            Some(vtb) => &vtb.id,
            _ => {
                tracing::warn!("Unknown bilibili channel id {}", channel.id.as_str());
                continue;
            }
        };

        tracing::debug!(
            vtuber_id = vtuber_id.as_str(),
            "Bilibili channel {}, subscriber={} view={}",
            &vtuber_id,
            channel.subscriber_count,
            channel.view_count,
        );

        db.update_bilibili_channel_statistic(
            vtuber_id,
            now,
            channel.view_count,
            channel.subscriber_count,
        )
        .await?;
    }

    Ok(())
}

async fn youtube_channels_stats(hub: &RequestHub, db: &Database, now: DateTime<Utc>) -> Result<()> {
    let ids = CONFIG
        .vtubers
        .iter()
        .filter_map(|v| v.youtube.as_deref())
        .collect::<Vec<_>>();

    let channels = hub.youtube_channels(ids).await?;

    for channel in channels {
        let vtuber_id = match CONFIG.find_by_youtube_channel_id(&channel.id) {
            Some(vtb) => &vtb.id,
            _ => {
                tracing::warn!("Unknown youtube channel id {}", channel.id.as_str());
                continue;
            }
        };

        tracing::debug!(
            vtuber_id = vtuber_id.as_str(),
            "YouTube channel {}, subscriber={} view={}",
            vtuber_id.as_str(),
            channel.subscriber_count,
            channel.view_count,
        );

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
