use anyhow::{Error, Result};
use futures::{stream, StreamExt, TryStreamExt};
use holostats_config::CONFIG;
use holostats_request::RequestHub;
use holostats_utils::tracing::init;
use tracing::instrument;

#[tokio::main]
async fn main() -> Result<()> {
    let _guard = init("subscribe", false);

    real_main().await
}

#[instrument(
    name = "subscribe-feed"
    fields(service.name = "holostats-cron")
)]
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
