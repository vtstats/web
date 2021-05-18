use futures::future::TryFutureExt;
use reqwest::Url;
use tracing::instrument;

use super::RequestHub;
use crate::error::Result;

impl RequestHub {
    #[instrument(
        name = "Fetch YouTube RSS Feed",
        skip(self, channel_id, now_str),
        fields(http.method = "GET", channel_id)
    )]
    pub async fn fetch_rss_feed(&self, channel_id: &str, now_str: &str) -> Result<String> {
        let url = Url::parse_with_params(
            "https://youtube.com/feeds/videos.xml",
            &[("channel_id", channel_id), ("_", now_str)],
        )?;

        let text = self
            .client
            .get(url.clone())
            .header("cache-control", "no-cache")
            .send()
            .and_then(|res| res.text())
            .map_err(|err| (url, err))
            .await?;

        Ok(text)
    }
}
