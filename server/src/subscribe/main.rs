#[path = "../error.rs"]
mod error;
#[path = "../utils.rs"]
mod utils;
#[path = "../vtubers.rs"]
mod vtubers;

use futures::{stream, StreamExt};
use reqwest::{header::CONTENT_TYPE, Client};
use tracing::instrument;

use crate::error::Result;
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
    let ids = VTUBERS.iter().filter_map(|v| v.youtube).collect::<Vec<_>>();

    let client = Client::new();

    stream::iter(ids.iter().map(|channel_id| subscribe(&client, channel_id)))
        .buffer_unordered(10)
        .collect::<Vec<()>>()
        .await;

    Ok(())
}

#[instrument(
    name = "Subscribe YouTube Channel Feed",
    skip(client),
    fields(http.method = "POST", channel_id),
)]
async fn subscribe(client: &Client, channel_id: &str) {
    const CALLBACK_URL: &str =
        concat!("https://taiwanv-dev.linnil1.me/api/pubsub/", env!("PUBSUBHUBBUB_URL"));

    const TOPIC_BASE_URL: &str = "https://www.youtube.com/xml/feeds/videos.xml?channel_id=";

    let _ = client
        .post("https://pubsubhubbub.appspot.com/subscribe")
        .header(CONTENT_TYPE, "application/x-www-form-urlencoded")
        .body(format!(
            "hub.callback={}&hub.topic={}{}&hub.mode=subscribe",
            CALLBACK_URL, TOPIC_BASE_URL, channel_id
        ))
        .send()
        .await;
}
