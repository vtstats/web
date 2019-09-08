#![allow(dead_code)]

use chrono::{DateTime, Duration, Utc};
use futures::future::try_join;
use isahc::{prelude::Request, HttpClient, ResponseExt};
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_vec};
use std::collections::HashMap;
use std::fs;
use std::str::FromStr;
use url::Url;

use crate::types::{
    auth::{RefreshRequest, RefreshResponse, SignInRequest, SignInResponse},
    bilibili::{StatResponse, UpstatResponse},
    youtube::{Channel, ChannelsResponse, Video, VideosResponse},
    Result, Values,
};

///////// YouTube

pub async fn youtube_videos(client: &HttpClient, id: String) -> Result<Vec<Video>> {
    let request = Request::get(
        Url::parse_with_params(
            "https://www.googleapis.com/youtube/v3/videos",
            &[
                ("part", "id,liveStreamingDetails"),
                ("maxResults", "50"),
                ("key", env!("YOUTUBE_API_KEY0")),
                ("id", &id),
            ],
        )?
        .as_str(),
    )
    .body(())?;

    let response = client.send_async(request).await?.json::<VideosResponse>()?;

    Ok(response.items)
}

pub async fn youtube_videos_snippet(client: &HttpClient, id: String) -> Result<Vec<Video>> {
    let request = Request::get(
        Url::parse_with_params(
            "https://www.googleapis.com/youtube/v3/videos",
            &[
                ("part", "id,liveStreamingDetails,snippet"),
                ("maxResults", "50"),
                ("key", env!("YOUTUBE_API_KEY0")),
                ("id", &id),
            ],
        )?
        .as_str(),
    )
    .body(())?;

    let response = client.send_async(request).await?.json::<VideosResponse>()?;

    Ok(response.items)
}

pub async fn youtube_channels(client: &HttpClient, id: String) -> Result<Vec<Channel>> {
    let request = Request::get(
        Url::parse_with_params(
            "https://www.googleapis.com/youtube/v3/channels",
            &[
                ("part", "statistics"),
                ("key", env!("YOUTUBE_API_KEY1")),
                ("id", &id),
            ],
        )?
        .as_str(),
    )
    .body(())?;

    let response = client
        .send_async(request)
        .await?
        .json::<ChannelsResponse>()?;

    Ok(response.items)
}

pub async fn youtube_first_video(
    client: &HttpClient,
    channel: &str,
    now_str: &str,
) -> Result<String> {
    // try to fetch the lastest rss feed by disabling http cache and appending random query string
    let request = Request::get(
        Url::parse_with_params(
            "https://youtube.com/feeds/videos.xml",
            &[("channel_id", channel), ("_", now_str)],
        )?
        .as_str(),
    )
    .header("Cache-Control", "no-cache")
    .body(())?;

    let mut response = client.send_async(request).await?;

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
    let stat_req = Request::get(
        Url::parse_with_params(
            "https://api.bilibili.com/x/relation/stat",
            &[("vmid", id.to_string())],
        )?
        .as_str(),
    )
    .body(())?;

    let upstat_req = Request::get(
        Url::parse_with_params(
            "https://api.bilibili.com/x/space/upstat",
            &[("mid", id.to_string())],
        )?
        .as_str(),
    )
    .body(())?;

    let (mut stat_res, mut upstat_res) =
        try_join(client.send_async(stat_req), client.send_async(upstat_req)).await?;

    Ok((
        stat_res.json::<StatResponse>()?.data.follower,
        upstat_res.json::<UpstatResponse>()?.data.archive.view,
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
    .body(to_vec(&values)?)?;

    let response = client.send_async(request).await?;

    if response.status().is_success() {
        println!("Updated Successfully.")
    } else {
        eprintln!("Failed to update.")
    }

    Ok(())
}

pub async fn vtuber_stats_timestamps(client: &HttpClient, id_token: &str) -> Result<Vec<i64>> {
    let request = Request::get(
        Url::parse_with_params(
            concat!(
                "https://",
                env!("FIREBASE_PROJECT_ID"),
                ".firebaseio.com/vtuberStats/_timestamps.json"
            ),
            &[("auth", id_token)],
        )?
        .as_str(),
    )
    .body(())?;

    let response = client
        .send_async(request)
        .await?
        .json::<HashMap<i64, bool>>()?;

    let mut timestamps: Vec<_> = response.into_iter().map(|(k, _)| k).collect();

    timestamps.sort();

    Ok(timestamps)
}

pub async fn stream_stats(client: &HttpClient, id_token: &str, id: &str) -> Result<Vec<usize>> {
    let request = Request::get(
        Url::parse_with_params(
            &format!(
                "https://{}.firebaseio.com/streamStats/{}.json",
                env!("FIREBASE_PROJECT_ID"),
                id
            ),
            &[("auth", id_token)],
        )?
        .as_str(),
    )
    .body(())?;

    if let Ok(map) = client
        .send_async(request)
        .await?
        .json::<HashMap<String, usize>>()
    {
        let array = map.values().copied().collect::<Vec<_>>();

        Ok(array)
    } else {
        Ok(Vec::new())
    }
}

pub async fn current_streams(client: &HttpClient, id_token: &str) -> Result<HashMap<String, bool>> {
    let request = Request::get(
        Url::parse_with_params(
            concat!(
                "https://",
                env!("FIREBASE_PROJECT_ID"),
                ".firebaseio.com/streams/_current.json",
            ),
            &[("auth", id_token)],
        )?
        .as_str(),
    )
    .body(())?;

    let response = client
        .send_async(request)
        .await?
        .json::<HashMap<String, bool>>()?;

    Ok(response)
}

pub async fn vtuber_stats_at(
    client: &HttpClient,
    id_token: &str,
    name: &str,
    timestamp: i64,
) -> Result<[i32; 4]> {
    let request = Request::get(
        Url::parse_with_params(
            &format!(
                "https://{}.firebaseio.com/vtuberStats/{}/{}.json",
                env!("FIREBASE_PROJECT_ID"),
                name,
                timestamp,
            ),
            &[("auth", id_token)],
        )?
        .as_str(),
    )
    .body(())?;

    let response = client.send_async(request).await?.json::<[i32; 4]>()?;

    Ok(response)
}

///////// Auth

#[derive(Serialize, Deserialize, Debug)]
pub struct Auth {
    pub id_token: String,
    pub refresh_token: String,
    pub expires_at: DateTime<Utc>,
}

pub async fn auth(client: &HttpClient) -> Result<Auth> {
    if let Ok(json) = fs::read_to_string(concat!(env!("CARGO_MANIFEST_DIR"), "/.auth.json")) {
        let auth = from_str::<Auth>(&json)?;

        if (auth.expires_at - Utc::now()).num_seconds() < 5 {
            refresh_token(client, &auth.refresh_token).await
        } else {
            Ok(auth)
        }
    } else {
        sign_in(&client).await
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
    .body(to_vec(&SignInRequest {
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
        to_vec(&auth)?,
    )?;

    println!("Signed in successfully.");

    Ok(auth)
}

async fn refresh_token(client: &HttpClient, refresh_token: &str) -> Result<Auth> {
    let request = Request::post(
        Url::parse_with_params(
            "https://securetoken.googleapis.com/v1/token",
            &[("key", env!("FIREBASE_WEB_API_KEY"))],
        )?
        .as_str(),
    )
    .header("content-type", "application/json")
    .body(to_vec(&RefreshRequest {
        grant_type: "refresh_token",
        refresh_token,
    })?)?;

    let response = client
        .send_async(request)
        .await?
        .json::<RefreshResponse>()?;

    let auth = Auth {
        expires_at: Utc::now() + Duration::seconds(i64::from_str(&response.expires_in)?),
        id_token: response.id_token,
        refresh_token: response.refresh_token,
    };

    fs::write(
        concat!(env!("CARGO_MANIFEST_DIR"), "/.auth.json"),
        to_vec(&auth)?,
    )?;

    println!("Token refreshed successfully.");

    Ok(auth)
}
