use anyhow::{Error, Result};
use futures::{stream, StreamExt, TryStreamExt};
use holostats_config::CONFIG;
use holostats_request::RequestHub;
use tracing::{field::Empty, Instrument, Span};

#[tokio::main]
async fn main() -> Result<()> {
    let _guard = holostats_tracing::init("subscribe", false);

    let fut = async {
        if let Err(err) = real_main().await {
            Span::current().record("otel.status_code", &"ERROR");
            tracing::error!("Failed to subscribe YT pubsusb: {:?}", err);
        }
    };

    let span = tracing::info_span!(
        "subscribe-feed",
        service.name = "holostats-cron",
        span.kind = "consumer",
        otel.status_code = Empty,
        otel.status_description = Empty,
    );

    fut.instrument(span).await;

    Ok(())
}

async fn real_main() -> Result<()> {
    let hub = RequestHub::new();

    let subscribe_stream = CONFIG
        .vtubers
        .iter()
        .filter_map(|v| v.youtube.as_ref())
        .map(|channel_id| hub.subscribe_youtube_pubsub(&channel_id));

    stream::iter(subscribe_stream)
        .buffer_unordered(10)
        .map_err(Error::new)
        .try_collect::<Vec<()>>()
        .await?;

    Ok(())
}
