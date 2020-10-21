#[path = "../error.rs"]
mod error;
#[path = "../vtubers.rs"]
mod vtubers;

use futures::{stream, FutureExt, StreamExt};
use reqwest::{header::CONTENT_TYPE, Client};

use crate::error::Result;
use crate::vtubers::VTUBERS;

const CALLBACK_URL: &str = concat!("https://holo.poi.cat/api/pubsub/", env!("PUBSUBHUBBUB_URL"));

const TOPIC_BASE_URL: &str = "https://www.youtube.com/xml/feeds/videos.xml?channel_id=";

#[tokio::main]
async fn main() -> Result<()> {
    let client = Client::new();

    stream::iter(VTUBERS.iter().filter_map(|v| v.youtube).map(|channel_id| {
        client
            .post("https://pubsubhubbub.appspot.com/subscribe")
            .header(CONTENT_TYPE, "application/x-www-form-urlencoded")
            .body(format!(
                "hub.callback={}&hub.topic={}{}&hub.mode=subscribe",
                CALLBACK_URL, TOPIC_BASE_URL, channel_id
            ))
            .send()
            .map(|_| ())
    }))
    .buffer_unordered(10)
    .collect::<Vec<()>>()
    .await;

    Ok(())
}
