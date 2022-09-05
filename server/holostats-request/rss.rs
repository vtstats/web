use anyhow::Result;
use reqwest::Url;
use tracing::instrument;

use super::RequestHub;

impl RequestHub {
    #[instrument(name = "Fetch YouTube RSS Feed", skip(self, channel_id, now_str))]
    pub async fn fetch_rss_feed(&self, channel_id: &str, now_str: &str) -> Result<String> {
        let url = Url::parse_with_params(
            "https://youtube.com/feeds/videos.xml",
            &[("channel_id", channel_id), ("_", now_str)],
        )?;

        let req = (&self.client).get(url).header("cache-control", "no-cache");

        let res = crate::otel::send(&self.client, req).await?;

        let text = res.text().await?;

        Ok(text)
    }
}
