use holostats_config::CONFIG;
use reqwest::header::CONTENT_TYPE;
use reqwest::{Response, Result};
use tracing::instrument;

use super::RequestHub;

impl RequestHub {
    #[instrument(
        name = "Subscribe YouTube PubSub",
        skip(self),
        fields(http.method = "POST", channel_id),
    )]
    pub async fn subscribe_youtube_pubsub(&self, channel_id: &str) -> Result<()> {
        const TOPIC_BASE_URL: &str = "https://www.youtube.com/xml/feeds/videos.xml?channel_id=";

        self.client
            .post("https://pubsubhubbub.appspot.com/subscribe")
            .header(CONTENT_TYPE, "application/x-www-form-urlencoded")
            .body(format!(
                "hub.callback=https://{}/api/pubsub/{}&hub.topic={}{}&hub.mode=subscribe",
                CONFIG.server.hostname, CONFIG.youtube.pubsub_path, TOPIC_BASE_URL, channel_id
            ))
            .send()
            .await
            .and_then(Response::error_for_status)
            .map(|_| ())
    }
}
