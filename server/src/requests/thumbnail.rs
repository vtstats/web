use bytes::Bytes;
use futures::{FutureExt, TryFutureExt};
use reqwest::{Response, Url};
use sha2::{Digest, Sha256};
use tracing::instrument;

use super::RequestHub;
use crate::config::CONFIG;
use crate::error::Result;

impl RequestHub {
    #[instrument(name = "Upload thumbnail", skip(self))]
    pub async fn upload_thumbnail(&self, stream_id: &str) -> Option<String> {
        let data = match self.youtube_thumbnail(stream_id).await {
            Ok(x) => x,
            Err(e) => {
                tracing::warn!(err = ?e, err.msg = "failed to upload thumbnail");
                return None;
            }
        };

        let content_sha256 = Sha256::digest(data.as_ref());

        let filename = format!("{}.{}.jpg", stream_id, hex::encode(content_sha256));

        match self.upload_file(&filename, data, "image/jpg").await {
            Ok(_) => Some(format!("{}/{}", CONFIG.s3.public_url, filename)),
            Err(e) => {
                tracing::warn!(err = ?e, err.msg = "failed to upload thumbnail");
                None
            }
        }
    }

    #[instrument(name = "Get YouTube video thumbnail", skip(self))]
    async fn youtube_thumbnail(&self, id: &str) -> Result<Bytes> {
        self.youtube_thumbnail_by_res(id, "maxresdefault")
            .or_else(|_| self.youtube_thumbnail_by_res(id, "sddefault"))
            .or_else(|_| self.youtube_thumbnail_by_res(id, "mqdefault"))
            .or_else(|_| self.youtube_thumbnail_by_res(id, "hqdefault"))
            .await
    }

    #[instrument(
        name = "Get YouTube video thumbnail by res",
        skip(self),
        fields(http.method = "GET", id, res)
    )]
    async fn youtube_thumbnail_by_res(&self, id: &str, res: &str) -> Result<Bytes> {
        let url = Url::parse(&format!("https://img.youtube.com/vi/{}/{}.jpg", id, res))?;

        let res = self
            .client
            .get(url.clone())
            .send()
            .map(|res| res.and_then(Response::error_for_status))
            .and_then(|res| res.bytes())
            .map_err(|err| (url, err))
            .await?;

        Ok(res)
    }
}
