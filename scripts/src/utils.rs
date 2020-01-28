#![allow(dead_code)]

use crate::consts::VTUBERS;
use chrono::{DateTime, Duration, Utc};
use isahc::{prelude::Request, HttpClient, ResponseExt};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, fs, str::FromStr};
use url::Url;

use crate::types::{
    auth::{RefreshRequest, RefreshResponse, SignInRequest, SignInResponse},
    bilibili::{StatResponse, UpstatResponse},
    youtube::{Channel, ChannelsResponse, LiveChatMessagesResponse, Video, VideosResponse},
    Result, ScheduleStream, Values,
};

///////// YouTube

pub async fn youtube_videos(client: &HttpClient, id: &str, key: &str) -> Result<Vec<Video>> {
    let response = client
        .get_async(
            Url::parse_with_params(
                "https://www.googleapis.com/youtube/v3/videos",
                &[
                    ("part", "id,liveStreamingDetails"),
                    ("fields", "items(id,liveStreamingDetails(actualStartTime,actualEndTime,scheduledStartTime,concurrentViewers))"),
                    ("maxResults", "50"),
                    ("key", key),
                    ("id", id),
                ],
            )?
            .as_str(),
        )
        .await?
        .json::<VideosResponse>()?;

    Ok(response.items)
}

pub async fn youtube_videos_snippet(
    client: &HttpClient,
    id: &str,
    key: &str,
) -> Result<Vec<Video>> {
    let response = client
        .get_async(
            Url::parse_with_params(
                "https://www.googleapis.com/youtube/v3/videos",
                &[
                    ("part", "id,liveStreamingDetails,snippet"),
                    ("fields", "items(id,snippet(title,channelId),liveStreamingDetails(actualStartTime,actualEndTime,scheduledStartTime,concurrentViewers))"),
                    ("maxResults", "50"),
                    ("key", key),
                    ("id", id),
                ],
            )?
            .as_str(),
        )
        .await?
        .json::<VideosResponse>()?;

    Ok(response.items)
}

pub async fn youtube_channels(client: &HttpClient, id: &str, key: &str) -> Result<Vec<Channel>> {
    let response = client
        .get_async(
            Url::parse_with_params(
                "https://www.googleapis.com/youtube/v3/channels",
                &[
                    ("part", "statistics"),
                    ("fields", "items(id,statistics(viewCount,subscriberCount))"),
                    ("key", key),
                    ("id", id),
                ],
            )?
            .as_str(),
        )
        .await?
        .json::<ChannelsResponse>()?;

    Ok(response.items)
}

pub async fn youtube_stream_chat(
    client: &HttpClient,
    id: &str,
    token: &str,
    key: &str,
) -> Result<LiveChatMessagesResponse> {
    let response = client
        .get_async(
            Url::parse_with_params(
                "https://www.googleapis.com/youtube/v3/liveChat/messages",
                &[
                    ("part", "snippet"),
                    ("fields", "nextPageToken,pollingIntervalMillis,items(snippet(publishedAt,superChatDetails(amountMicros,currency,tier)))"),
                    ("key", key),
                    ("pageToken", token),
                    ("liveChatId", id),
                ],
            )?
            .as_str(),
        )
        .await?
        .json::<LiveChatMessagesResponse>()?;

    Ok(response)
}

pub async fn youtube_first_video(
    client: &HttpClient,
    channel_id: &str,
    now_str: &str,
) -> Result<String> {
    let mut response = client
        .get_async(
            Url::parse_with_params(
                "https://youtube.com/feeds/videos.xml",
                // try to fetch the lastest rss feed by appending random query string
                &[("channel_id", channel_id), ("_", now_str)],
            )?
            .as_str(),
        )
        .await?;

    let text = response.text_async().await?;

    if let Some(line) = text.lines().nth(14) {
        let line = line.trim();
        // <yt:videoId>XXXXXXXXXXX</yt:videoId>
        if line.len() == 36 {
            Ok(String::from(&line[12..23]))
        } else {
            Ok(String::new())
        }
    } else {
        Ok(String::new())
    }
}

///////// Bilibili

pub async fn bilibili_stat(client: &HttpClient, id: usize) -> Result<(i32, i32)> {
    let a = Url::parse_with_params(
        "https://api.bilibili.com/x/relation/stat",
        &[("vmid", id.to_string())],
    )?;

    let b = Url::parse_with_params(
        "https://api.bilibili.com/x/space/upstat",
        &[("mid", id.to_string())],
    )?;

    let mut stat = client.get_async(a.as_str()).await?;

    let mut upstat = client.get_async(b.as_str()).await?;

    Ok((
        stat.json::<StatResponse>()?.data.follower,
        upstat.json::<UpstatResponse>()?.data.archive.view,
    ))
}

///////// Database

pub async fn patch_values(client: &HttpClient, id_token: &str, values: Values) -> Result<()> {
    let request = Request::patch(
        Url::parse_with_params(
            concat!(
                "https://",
                env!("FIREBASE_PROJECT_ID"),
                ".firebaseio.com/.json"
            ),
            &[("format", "slient"), ("auth", id_token)],
        )?
        .as_str(),
    )
    .body(serde_json::to_vec(&values)?)?;

    let response = client.send_async(request).await?;

    if response.status().is_success() {
        println!("Updated Successfully.")
    } else {
        eprintln!("Failed to update.")
    }

    Ok(())
}

pub async fn vtuber_stats_timestamps(client: &HttpClient, auth: &str) -> Result<Vec<i64>> {
    let response = client
        .get_async(
            Url::parse_with_params(
                concat!(
                    "https://",
                    env!("FIREBASE_PROJECT_ID"),
                    ".firebaseio.com/vtuberStats/ayame.json"
                ),
                &[("auth", auth), ("shallow", "true")],
            )?
            .as_str(),
        )
        .await?
        .json::<HashMap<i64, bool>>()?;

    let mut timestamps: Vec<_> = response.into_iter().map(|(k, _)| k).collect();

    timestamps.sort();

    Ok(timestamps)
}

pub async fn schedule_streams(client: &HttpClient) -> Result<Vec<String>> {
    let ids = VTUBERS.iter().map(|v| v.name).collect::<Vec<_>>();
    let ids = ids.join(",");

    let now = Utc::now();

    let url = Url::parse_with_params(
        "https://holo.poi.cat/api_v2/youtube_schedule_stream",
        &[
            ("ids", ids.as_str()),
            ("startAt", "2000-01-01T00:00:00.000Z"),
            ("endAt", now.to_rfc3339().as_str()),
            ("shallow", "true"),
        ],
    )?;

    let response = client
        .get_async(url.as_str())
        .await?
        .json::<ScheduleStream>()?;

    Ok(response.streams)
}

pub async fn vtuber_stats_at(
    client: &HttpClient,
    auth: &str,
    name: &str,
    timestamp: i64,
) -> Result<[i32; 4]> {
    client
        .get_async(
            Url::parse_with_params(
                &format!(
                    "https://{}.firebaseio.com/vtuberStats/{}/{}.json",
                    env!("FIREBASE_PROJECT_ID"),
                    name,
                    timestamp,
                ),
                &[("auth", auth)],
            )?
            .as_str(),
        )
        .await?
        .json::<[i32; 4]>()
        .or(Ok([0; 4]))
}

///////// Auth

#[derive(Serialize, Deserialize, Debug)]
pub struct Auth {
    pub id_token: String,
    pub refresh_token: String,
    pub expires_at: DateTime<Utc>,
}

impl Auth {
    pub async fn new(client: &HttpClient) -> Result<Auth> {
        if let Ok(json) = fs::read(concat!(env!("CARGO_MANIFEST_DIR"), "/.auth.json")) {
            let mut auth: Auth = serde_json::from_slice(&json)?;

            if (auth.expires_at - Utc::now()).num_seconds() < 5 {
                auth.refresh_token(client).await?;
            }

            Ok(auth)
        } else {
            Auth::sign_in(&client).await
        }
    }

    async fn sign_in(client: &HttpClient) -> Result<Auth> {
        let request = Request::post(
            Url::parse_with_params(
                "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword",
                &[("key", env!("FIREBASE_WEB_API_KEY"))],
            )?
            .as_str(),
        )
        .header("content-type", "application/json")
        .body(serde_json::to_vec(&SignInRequest {
            email: env!("FIREBASE_USER_EMAIL"),
            password: env!("FIREBASE_USER_PASSWORD"),
            return_secure_token: true,
        })?)?;

        let response = client.send_async(request).await?.json::<SignInResponse>()?;

        let auth = Auth {
            expires_at: Utc::now() + Duration::seconds(i64::from_str(&response.expires_in)?),
            id_token: response.id_token,
            refresh_token: response.refresh_token,
        };

        fs::write(
            concat!(env!("CARGO_MANIFEST_DIR"), "/.auth.json"),
            serde_json::to_vec(&auth)?,
        )?;

        println!("Signed in successfully.");

        Ok(auth)
    }

    async fn refresh_token(&mut self, client: &HttpClient) -> Result<()> {
        let request = Request::post(
            Url::parse_with_params(
                "https://securetoken.googleapis.com/v1/token",
                &[("key", env!("FIREBASE_WEB_API_KEY"))],
            )?
            .as_str(),
        )
        .header("content-type", "application/json")
        .body(serde_json::to_vec(&RefreshRequest {
            grant_type: "refresh_token",
            refresh_token: &self.refresh_token,
        })?)?;

        let response = client
            .send_async(request)
            .await?
            .json::<RefreshResponse>()?;

        self.expires_at = Utc::now() + Duration::seconds(i64::from_str(&response.expires_in)?);
        self.id_token = response.id_token;
        self.refresh_token = response.refresh_token;

        fs::write(
            concat!(env!("CARGO_MANIFEST_DIR"), "/.auth.json"),
            serde_json::to_vec(&self)?,
        )?;

        println!("Token refreshed successfully.");

        Ok(())
    }
}
