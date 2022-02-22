use anyhow::Result;
use chrono::Utc;
use holostats_config::CONFIG;
use holostats_database::{streams::StreamStatus as StreamStatus_, Database};
use holostats_request::{RequestHub, StreamStatus};
use tracing::{field::Empty, Instrument, Span};

#[tokio::main]
async fn main() -> Result<()> {
    let _guard = holostats_tracing::init("stream_stat", false);

    let fut = async {
        if let Err(err) = real_main().await {
            Span::current().record("otel.status_code", &"ERROR");
            tracing::error!("Failed to fetch stream_state: {:?}", err);
        }
    };

    let span = tracing::info_span!(
        "stream_stat",
        service.name = "holostats-cron",
        span.kind = "consumer",
        otel.status_code = Empty,
    );

    fut.instrument(span).await;

    Ok(())
}

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

    for stream in streams {
        if let Some(vtb) = CONFIG.find_by_youtube_channel_id(&stream.channel_id) {
            let payload = &format!("{},{}", vtb.id, stream.id);

            // sends a notification to other clients
            if let Err(err) = db.notify("get_live_chat", payload).await {
                tracing::error!(
                    payload = payload.as_str(),
                    "Failed to notify `get_live_chat` channel: {:?}",
                    err
                );
            }

            tracing::debug!(
                vtuber_id = vtb.id.as_str(),
                stream_id = stream.id.as_str(),
                "YouTube Stream {}, viewer={}, like={}",
                &stream.id,
                stream.viewers.unwrap_or_default(),
                stream.likes.unwrap_or_default(),
            );
        } else {
            tracing::warn!("Unkown youtube channel id {}", &stream.channel_id);
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

    db.terminate_stream(&offline_ids, now).await?;

    Ok(())
}
