use bytes::Bytes;
use futures::{FutureExt, TryFutureExt};
use reqwest::{Client, Response, Url};
use tracing::instrument;

use crate::error::Result;

#[instrument(name = "Get YouTube video thumbnail", skip(client))]
pub async fn youtube_thumbnail(id: &str, client: &Client) -> Result<Bytes> {
    youtube_thumbnail_by_res(id, "maxresdefault", &client)
        .or_else(|_| youtube_thumbnail_by_res(id, "sddefault", &client))
        .or_else(|_| youtube_thumbnail_by_res(id, "mqdefault", &client))
        .or_else(|_| youtube_thumbnail_by_res(id, "hqdefault", &client))
        .await
}

#[instrument(
    name = "Get YouTube video thumbnail by res",
    skip(client),
    fields(http.method = "GET", id, res)
)]
async fn youtube_thumbnail_by_res(id: &str, res: &str, client: &Client) -> Result<Bytes> {
    let url = Url::parse(&format!("https://img.youtube.com/vi/{}/{}.jpg", id, res))?;

    let res = client
        .get(url.clone())
        .send()
        .map(|res| res.and_then(Response::error_for_status))
        .and_then(|res| res.bytes())
        .map_err(|err| (url, err))
        .await?;

    Ok(res)
}
