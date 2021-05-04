#[path = "../error.rs"]
mod error;
#[path = "../requests/mod.rs"]
mod requests;
#[path = "../utils.rs"]
mod utils;
#[path = "../vtubers.rs"]
mod vtubers;

use dotenv::dotenv;
use futures::{stream, StreamExt};
use tracing::instrument;

use crate::error::Result;
use crate::requests::RequestHub;
use crate::vtubers::VTUBERS;

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
    dotenv().expect("Failed to load .env file");

    let hub = RequestHub::new();

    let ids = VTUBERS.iter().filter_map(|v| v.youtube).collect::<Vec<_>>();

    stream::iter(
        ids.iter()
            .map(|channel_id| hub.subscribe_youtube_pubsub(&channel_id)),
    )
    .buffer_unordered(10)
    .collect::<Vec<()>>()
    .await;

    Ok(())
}
