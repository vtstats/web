#![allow(dead_code)]

use futures::future::{try_join, TryFutureExt};
use reqwest::{header::COOKIE, Client, Url};
use std::str::FromStr;

use crate::error::Result;

pub struct Channel {
    pub id: String,
    pub view_count: i32,
    pub subscriber_count: i32,
}

#[derive(serde::Deserialize, Debug)]
struct YouTubeChannelsListResponse {
    items: Vec<YouTubeChannel>,
}

#[derive(serde::Deserialize, Debug)]
struct YouTubeChannel {
    id: String,
    statistics: YouTubeChannelStatistics,
}

#[derive(serde::Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct YouTubeChannelStatistics {
    view_count: String,
    subscriber_count: String,
}

#[derive(serde::Deserialize)]
struct BilibiliUpstatResponse {
    data: BilibiliUpstatData,
}

#[derive(serde::Deserialize)]
struct BilibiliUpstatData {
    archive: BilibiliUpstatDataArchive,
}

#[derive(serde::Deserialize)]
struct BilibiliUpstatDataArchive {
    view: i32,
}

#[derive(serde::Deserialize)]
struct BilibiliStatResponse {
    data: BilibiliStatData,
}

#[derive(serde::Deserialize)]
struct BilibiliStatData {
    follower: i32,
}

pub async fn youtube_channels(client: &Client, ids: Vec<&str>, key: &str) -> Result<Vec<Channel>> {
    let mut channels = vec![];

    // youtube limits 50 channels per request
    for chunk in ids.chunks(50) {
        let url = Url::parse_with_params(
            "https://www.googleapis.com/youtube/v3/channels",
            &[
                ("part", "statistics"),
                ("fields", "items(id,statistics(viewCount,subscriberCount))"),
                ("maxResults", "50"),
                ("key", key),
                ("id", chunk.join(",").as_str()),
            ],
        )?;

        let res = client
            .get(url.clone())
            .send()
            .and_then(|res| res.json::<YouTubeChannelsListResponse>())
            .map_err(|err| (url, err))
            .await?;

        channels.extend(res.items.into_iter().map(|channel| Channel {
            id: channel.id,
            view_count: i32::from_str(&channel.statistics.view_count).unwrap(),
            subscriber_count: i32::from_str(&channel.statistics.subscriber_count).unwrap(),
        }));
    }

    Ok(channels)
}

pub async fn bilibili_channels(client: &Client, ids: Vec<&str>) -> Result<Vec<Channel>> {
    let mut channels = vec![];

    for id in ids {
        let stat_url =
            Url::parse_with_params("http://api.bilibili.com/x/relation/stat", &[("vmid", id)])?;

        let upstat_url =
            Url::parse_with_params("http://api.bilibili.com/x/space/upstat", &[("mid", id)])?;

        let (stat, upstat) = try_join(
            client
                .get(stat_url.clone())
                .send()
                .and_then(|res| res.json::<BilibiliStatResponse>())
                .map_err(|err| (stat_url, err)),
            client
                .get(upstat_url.clone())
                .header(COOKIE, option_env!("COOKIE").unwrap_or_default())
                .send()
                .and_then(|res| res.json::<BilibiliUpstatResponse>())
                .map_err(|err| (upstat_url, err)),
        )
        .await?;

        channels.push(Channel {
            id: id.to_string(),
            view_count: upstat.data.archive.view,
            subscriber_count: stat.data.follower,
        });
    }

    Ok(channels)
}
