use chrono::{DateTime, Utc};
use sqlx::PgPool;
use warp::{reply::Json, Rejection};

use crate::error::Error;
use crate::vtubers::VTUBER_IDS;

#[derive(serde::Deserialize)]
pub struct ChannelsListRequestQuery {
    ids: String,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ChannelsListResponseBody {
    updated_at: DateTime<Utc>,
    channels: Vec<Channel>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Channel {
    vtuber_id: String,
    subscriber_count: i32,
    daily_subscriber_count: i32,
    weekly_subscriber_count: i32,
    monthly_subscriber_count: i32,
    view_count: i32,
    daily_view_count: i32,
    weekly_view_count: i32,
    monthly_view_count: i32,
    updated_at: DateTime<Utc>,
}

pub async fn youtube_channels_list(
    query: ChannelsListRequestQuery,
    mut pool: PgPool,
) -> Result<Json, Rejection> {
    if query.ids.split(',').any(|id| !VTUBER_IDS.contains(&id)) {
        // TODO: return invalid request string
    }

    let rec = sqlx::query!("SELECT MAX(updated_at) FROM youtube_channels")
        .fetch_one(&mut pool)
        .await
        .map_err(Error::Database)
        .map_err(warp::reject::custom)?;

    let updated_at = rec.max;

    let channels = sqlx::query_as!(
        Channel,
        r#"
SELECT
    vtuber_id,
    subscriber_count,
    daily_subscriber_count,
    weekly_subscriber_count,
    monthly_subscriber_count,
    view_count,
    daily_view_count,
    weekly_view_count,
    monthly_view_count,
    updated_at
FROM youtube_channels
WHERE vtuber_id = ANY(string_to_array($1, ','))
        "#,
        query.ids
    )
    .fetch_all(&mut pool)
    .await
    .map_err(Error::Database)
    .map_err(warp::reject::custom)?;

    Ok(warp::reply::json(&ChannelsListResponseBody {
        updated_at,
        channels,
    }))
}

pub async fn bilibili_channels_list(
    query: ChannelsListRequestQuery,
    mut pool: PgPool,
) -> Result<Json, Rejection> {
    if query.ids.split(',').any(|id| !VTUBER_IDS.contains(&id)) {
        // TODO: return invalid request string
    }

    let rec = sqlx::query!("SELECT MAX(updated_at) FROM bilibili_channels")
        .fetch_one(&mut pool)
        .await
        .map_err(Error::Database)
        .map_err(warp::reject::custom)?;

    let updated_at = rec.max;

    let channels = sqlx::query_as!(
        Channel,
        r#"
SELECT
    vtuber_id,
    subscriber_count,
    daily_subscriber_count,
    weekly_subscriber_count,
    monthly_subscriber_count,
    view_count,
    daily_view_count,
    weekly_view_count,
    monthly_view_count,
    updated_at
FROM bilibili_channels
WHERE vtuber_id = ANY(string_to_array($1, ','))
        "#,
        query.ids
    )
    .fetch_all(&mut pool)
    .await
    .map_err(Error::Database)
    .map_err(warp::reject::custom)?;

    Ok(warp::reply::json(&ChannelsListResponseBody {
        updated_at,
        channels,
    }))
}
