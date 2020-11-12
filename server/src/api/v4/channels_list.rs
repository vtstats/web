use chrono::{
    serde::{ts_milliseconds, ts_milliseconds_option},
    DateTime, Utc,
};
use serde_with::{rust::StringWithSeparator, CommaSeparator};
use sqlx::PgPool;
use warp::Rejection;

use crate::error::Error;

#[derive(serde::Deserialize)]
pub struct ChannelsListRequestQuery {
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    ids: Vec<String>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ChannelsListResponseBody {
    #[serde(with = "ts_milliseconds_option")]
    pub updated_at: Option<DateTime<Utc>>,
    pub channels: Vec<Channel>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Channel {
    pub vtuber_id: String,
    pub subscriber_count: i32,
    pub daily_subscriber_count: i32,
    pub weekly_subscriber_count: i32,
    pub monthly_subscriber_count: i32,
    pub view_count: i32,
    pub daily_view_count: i32,
    pub weekly_view_count: i32,
    pub monthly_view_count: i32,
    #[serde(with = "ts_milliseconds")]
    pub updated_at: DateTime<Utc>,
}

pub async fn youtube_channels_list(
    query: ChannelsListRequestQuery,
    pool: PgPool,
) -> Result<impl warp::Reply, Rejection> {
    let updated_at = sqlx::query!("select max(updated_at) from youtube_channels")
        .fetch_one(&pool)
        .await
        .map(|row| row.max)
        .map_err(Error::Database)?;

    let channels = sqlx::query_as!(
        Channel,
        r#"
            select vtuber_id,
                   subscriber_count,
                   daily_subscriber_count,
                   weekly_subscriber_count,
                   monthly_subscriber_count,
                   view_count,
                   daily_view_count,
                   weekly_view_count,
                   monthly_view_count,
                   updated_at
              from youtube_channels
             where vtuber_id = any($1)
        "#,
        &query.ids
    )
    .fetch_all(&pool)
    .await
    .map_err(Error::Database)?;

    let etag = updated_at.map(|t| t.timestamp()).unwrap_or_default();

    Ok(warp::reply::with_header(
        warp::reply::json(&ChannelsListResponseBody {
            updated_at,
            channels,
        }),
        "etag",
        format!(r#""{}""#, etag),
    ))
}

pub async fn bilibili_channels_list(
    query: ChannelsListRequestQuery,
    pool: PgPool,
) -> Result<impl warp::Reply, Rejection> {
    let updated_at = sqlx::query!("select max(updated_at) from bilibili_channels")
        .fetch_one(&pool)
        .await
        .map(|row| row.max)
        .map_err(Error::Database)?;

    let channels = sqlx::query_as!(
        Channel,
        r#"
            select vtuber_id,
                   subscriber_count,
                   daily_subscriber_count,
                   weekly_subscriber_count,
                   monthly_subscriber_count,
                   view_count,
                   daily_view_count,
                   weekly_view_count,
                   monthly_view_count,
                   updated_at
              from bilibili_channels
             where vtuber_id = any($1)
        "#,
        &query.ids
    )
    .fetch_all(&pool)
    .await
    .map_err(Error::Database)?;

    let etag = updated_at.map(|t| t.timestamp()).unwrap_or_default();

    Ok(warp::reply::with_header(
        warp::reply::json(&ChannelsListResponseBody {
            updated_at,
            channels,
        }),
        "etag",
        format!(r#""{}""#, etag),
    ))
}
