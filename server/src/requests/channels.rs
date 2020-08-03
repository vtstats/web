#![allow(dead_code)]

use futures::future::{try_join, TryFutureExt};
use reqwest::{header::COOKIE, Client, Url};
use std::str::FromStr;

use crate::error::Result;

pub struct Channel<T> {
    pub id: T,
    pub view_count: i32,
    pub subscriber_count: i32,
}

/// ===== YouTube =====

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

pub async fn youtube_channels(
    client: &Client,
    ids: Vec<&str>,
    key: &str,
) -> Result<Vec<Channel<String>>> {
    let url = Url::parse_with_params(
        "https://www.googleapis.com/youtube/v3/channels",
        &[
            ("part", "statistics"),
            ("fields", "items(id,statistics(viewCount,subscriberCount))"),
            ("key", key),
            ("id", ids.join(",").as_str()),
        ],
    )?;

    let response = client
        .get(url)
        .send()
        .await?
        .json::<YouTubeChannelsListResponse>()
        .await?;

    Ok(response
        .items
        .into_iter()
        .map(|channel| Channel {
            id: channel.id,
            view_count: i32::from_str(&channel.statistics.view_count).unwrap(),
            subscriber_count: i32::from_str(&channel.statistics.subscriber_count).unwrap(),
        })
        .collect())
}

/// ===== Bilibili =====

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

pub async fn bilibili_channels(client: &Client, ids: Vec<usize>) -> Result<Vec<Channel<usize>>> {
    let mut channels = vec![];

    for id in ids {
        let stat_url = Url::parse_with_params(
            "http://api.bilibili.com/x/relation/stat",
            &[("vmid", id.to_string())],
        )?;

        let upstat_url = Url::parse_with_params(
            "http://api.bilibili.com/x/space/upstat",
            &[("mid", id.to_string())],
        )?;

        let (stat, upstat) = try_join(
            client
                .get(stat_url)
                .send()
                .and_then(|res| res.json::<BilibiliStatResponse>()),
            client
                .get(upstat_url)
                .header(COOKIE, option_env!("COOKIE").unwrap_or_default())
                .send()
                .and_then(|res| res.json::<BilibiliUpstatResponse>()),
        )
        .await?;

        channels.push(Channel {
            id,
            view_count: upstat.data.archive.view,
            subscriber_count: stat.data.follower,
        });
    }

    Ok(channels)
}
