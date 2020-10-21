use bytes::Bytes;
use futures::future::{FutureExt, TryFutureExt};
use reqwest::{Client, Response, Url};

use crate::error::Result;

pub async fn youtube_thumbnail(id: &str, client: &Client) -> Result<Bytes> {
    let url = Url::parse(&format!(
        "https://img.youtube.com/vi/{}/maxresdefault.jpg",
        id
    ))?;

    let res = client
        .get(url.clone())
        .send()
        .map(|res| res.and_then(Response::error_for_status))
        .and_then(|res| res.bytes())
        .map_err(|err| (url, err))
        .await?;

    Ok(res)
}
