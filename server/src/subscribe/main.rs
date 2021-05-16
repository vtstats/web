#[path = "../config.rs"]
mod config;
#[path = "../error.rs"]
mod error;
#[path = "../requests/mod.rs"]
mod requests;
#[path = "../utils.rs"]
mod utils;

use futures::{stream, StreamExt};
use tracing::instrument;

use crate::config::CONFIG;
use crate::error::Result;
use crate::requests::RequestHub;

#[tokio::main]
async fn main() -> Result<()> {
    utils::init_logger();

    let _guard = utils::init_tracing("subscribe", false);

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
        .collect::<Vec<()>>()
        .await;

    Ok(())
}
