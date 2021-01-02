use chrono::{serde::ts_milliseconds_option, DateTime, Utc};
use serde_with::{rust::StringWithSeparator, CommaSeparator};
use sqlx::PgPool;
use warp::Rejection;

use super::db;

#[derive(serde::Deserialize)]
pub struct ReqQuery {
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    ids: Vec<String>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResBody {
    #[serde(with = "ts_milliseconds_option")]
    pub updated_at: Option<DateTime<Utc>>,
    pub channels: Vec<db::Channel>,
}

pub async fn youtube_channels_list(
    query: ReqQuery,
    pool: PgPool,
) -> Result<impl warp::Reply, Rejection> {
    tracing::info!(
        name = "GET /api/v4/youtube_channels",
        ids = ?query.ids.as_slice(),
    );

    let updated_at = db::youtube_channel_max_updated_at(&pool).await?;

    let channels = db::youtube_channels(&query.ids, &pool).await?;

    let etag = updated_at.map(|t| t.timestamp()).unwrap_or_default();

    Ok(warp::reply::with_header(
        warp::reply::json(&ResBody {
            updated_at,
            channels,
        }),
        "etag",
        format!(r#""{}""#, etag),
    ))
}

pub async fn bilibili_channels_list(
    query: ReqQuery,
    pool: PgPool,
) -> Result<impl warp::Reply, Rejection> {
    tracing::info!(
        name = "GET /api/v4/bilibili_channels",
        ids = ?query.ids.as_slice(),
    );

    let updated_at = db::bilibili_channel_max_updated_at(&pool).await?;

    let channels = db::bilibili_channels(&query.ids, &pool).await?;

    let etag = updated_at.map(|t| t.timestamp()).unwrap_or_default();

    Ok(warp::reply::with_header(
        warp::reply::json(&ResBody {
            updated_at,
            channels,
        }),
        "etag",
        format!(r#""{}""#, etag),
    ))
}
