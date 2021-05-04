use reqwest::header::CONTENT_TYPE;
use tracing::instrument;

use super::RequestHub;

impl RequestHub {
    #[instrument(
        name = "Subscribe YouTube PubSub",
        skip(self),
        fields(http.method = "POST", channel_id),
    )]
    pub async fn subscribe_youtube_pubsub(&self, channel_id: &str) {
        const TOPIC_BASE_URL: &str = "https://www.youtube.com/xml/feeds/videos.xml?channel_id=";

        let _ = self
            .client
            .post("https://pubsubhubbub.appspot.com/subscribe")
            .header(CONTENT_TYPE, "application/x-www-form-urlencoded")
            .body(format!(
                "hub.callback={}&hub.topic={}{}&hub.mode=subscribe",
                self.pubsub_url, TOPIC_BASE_URL, channel_id
            ))
            .send()
            .await;
    }
}
