use chrono::Utc;
use futures::future::TryFutureExt;
use futures::{stream, StreamExt, TryStreamExt};
use reqwest::Url;
use tracing::instrument;

use super::RequestHub;
use crate::error::Result;

impl RequestHub {
    #[instrument(name = "Fetch RSS feeds", skip(self, ids))]
    pub async fn fetch_feeds(&self, ids: impl Iterator<Item = &str>) -> Result<Vec<String>> {
        let now = Utc::now();
        let now_str = now.to_string();

        stream::iter(ids.map(|channel_id| self.fetch(channel_id, &now_str)))
            .buffer_unordered(10)
            .try_collect::<Vec<String>>()
            .await
    }

    #[instrument(
        name = "Fetch YouTube RSS Feed",
        skip(self, channel_id, now_str),
        fields(http.method = "GET", channel_id)
    )]
    async fn fetch(&self, channel_id: &str, now_str: &str) -> Result<String> {
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
