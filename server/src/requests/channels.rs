use futures::future::{try_join, TryFutureExt};
use futures::{stream, StreamExt};
use reqwest::{header::COOKIE, Client, Url};
use serde::{Deserialize, Serialize};
use std::str::FromStr;
use tracing::instrument;

use crate::utils::json;
use crate::{error::Result, utils};

#[derive(Debug)]
pub struct Channel {
    pub id: String,
    pub view_count: i32,
    pub subscriber_count: i32,
}

#[derive(Deserialize, Debug)]
struct YouTubeChannelsListResponse {
    items: Vec<YouTubeChannel>,
}

#[derive(Deserialize, Serialize, Debug)]
struct YouTubeChannel {
    id: String,
    statistics: YouTubeChannelStatistics,
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct YouTubeChannelStatistics {
    view_count: String,
    subscriber_count: Option<String>,
}

#[derive(Deserialize)]
struct BilibiliUpstatResponse {
    data: BilibiliUpstatData,
}

#[derive(Deserialize, Debug)]
struct BilibiliUpstatData {
    archive: BilibiliUpstatDataArchive,
}

#[derive(Deserialize, Debug)]
struct BilibiliUpstatDataArchive {
    view: i32,
}

#[derive(Deserialize)]
struct BilibiliStatResponse {
    data: BilibiliStatData,
}

#[derive(Deserialize, Debug)]
struct BilibiliStatData {
    follower: i32,
}

#[instrument(name = "Fetch YouTube Channels Stats", skip(client, ids))]
pub async fn youtube_channels(client: &Client, ids: Vec<&str>) -> Result<Vec<Channel>> {
    let mut res = Vec::with_capacity(ids.len());

    // youtube limits 50 channels per request
    for chunk in ids.chunks(50) {
        let channels = youtube_channels_api(&client, &chunk.join(",")).await?;

        res.extend(channels.into_iter().map(|channel| {
            Channel {
                id: channel.id,
                view_count: i32::from_str(&channel.statistics.view_count).unwrap(),
                subscriber_count: i32::from_str(
                    &channel
                        .statistics
                        .subscriber_count
                        .unwrap_or(String::from("0")),
                )
                .unwrap(),
            }
        }));
    }

    Ok(res)
}

#[instrument(
    name = "Call YouTube channels API",
    skip(client),
    fields(http.method = "GET", id),
)]
async fn youtube_channels_api(client: &Client, id: &str) -> Result<Vec<YouTubeChannel>> {
    let url = Url::parse_with_params(
        "https://www.googleapis.com/youtube/v3/channels",
        &[
            ("part", "statistics"),
            ("fields", "items(id,statistics(viewCount,subscriberCount))"),
            ("maxResults", "50"),
            ("key", utils::youtube_api_key()),
            ("id", id),
        ],
    )?;

    let res = client
        .get(url.clone())
        .send()
        .and_then(|res| res.json::<YouTubeChannelsListResponse>())
        .map_err(|err| (url, err))
        .await?;

    tracing::info!(channels = json(&res.items));

    Ok(res.items)
}

#[instrument(name = "Fetch Bilibili Channels Stats", skip(client, ids))]
pub async fn bilibili_channels(client: &Client, ids: Vec<&str>) -> Result<Vec<Channel>> {
    let res = stream::iter(ids.iter().map(|id| {
        try_join(
            bilibili_stat_api(&client, id),
            bilibili_upstat_api(&client, id),
        )
        .map_ok(move |(stat, upstat)| Channel {
            id: id.to_string(),
            view_count: upstat.archive.view,
            subscriber_count: stat.follower,
        })
    }))
    .buffer_unordered(5)
    .collect::<Vec<_>>()
    .await;

    res.into_iter().collect()
}

#[instrument(
    name = "Call Bilibili channel stat API",
    skip(client),
    fields(http.method = "GET", id)
)]
async fn bilibili_stat_api(client: &Client, id: &str) -> Result<BilibiliStatData> {
    let url = Url::parse_with_params("http://api.bilibili.com/x/relation/stat", &[("vmid", id)])?;

    let res = client
        .get(url.clone())
        .send()
        .and_then(|res| res.json::<BilibiliStatResponse>())
        .map_err(|err| (url, err))
        .await?;

    tracing::info!(subscriber_count = res.data.follower);

    Ok(res.data)
}

#[instrument(
    name = "Call Bilibili channel upstat API",
    skip(client),
    fields(http.method = "GET", id)
)]
async fn bilibili_upstat_api(client: &Client, id: &str) -> Result<BilibiliUpstatData> {
    let url = Url::parse_with_params("http://api.bilibili.com/x/space/upstat", &[("mid", id)])?;

    let res = client
        .get(url.clone())
        .header(COOKIE, option_env!("COOKIE").unwrap_or_default())
        .send()
        .and_then(|res| res.json::<BilibiliUpstatResponse>())
        .map_err(|err| (url, err))
        .await?;

    tracing::info!(view_count = res.data.archive.view);

    Ok(res.data)
}
