use chrono::{serde::ts_milliseconds_option, DateTime, Utc};
use serde_with::{rust::StringWithSeparator, CommaSeparator};
use warp::Rejection;

use crate::database::{channels::Channel, Database};
use crate::error::Error;

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
    pub channels: Vec<Channel>,
}

pub async fn youtube_channels_list(
    query: ReqQuery,
    db: Database,
) -> Result<impl warp::Reply, Rejection> {
    tracing::info!(
        name = "GET /api/v4/youtube_channels",
        ids = ?query.ids.as_slice(),
    );

    let updated_at = db
        .youtube_channel_last_updated()
        .await
        .map_err(Error::Database)?;

    let channels = db
        .youtube_channels(&query.ids)
        .await
        .map_err(Error::Database)?;

    Ok(warp::reply::json(&ResBody {
        updated_at,
        channels,
    }))
}

pub async fn bilibili_channels_list(
    query: ReqQuery,
    db: Database,
) -> Result<impl warp::Reply, Rejection> {
    tracing::info!(
        name = "GET /api/v4/bilibili_channels",
        ids = ?query.ids.as_slice(),
    );

    let updated_at = db
        .bilibili_channel_last_updated()
        .await
        .map_err(Error::Database)?;

    let channels = db
        .bilibili_channels(&query.ids)
        .await
        .map_err(Error::Database)?;

    Ok(warp::reply::json(&ResBody {
        updated_at,
        channels,
    }))
}
