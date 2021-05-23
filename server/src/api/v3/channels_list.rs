use chrono::{DateTime, Utc};
use serde_with::{rust::StringWithSeparator, CommaSeparator};
use warp::{reply::Json, Rejection};

use crate::database::{channels::Channel as Channel_, Database};
use crate::error::Error;

#[derive(serde::Deserialize)]
pub struct ChannelsListRequestQuery {
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    ids: Vec<String>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ChannelsListResponseBody {
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
    pub updated_at: DateTime<Utc>,
}

impl From<Channel_> for Channel {
    fn from(ch: Channel_) -> Self {
        Channel {
            vtuber_id: ch.vtuber_id,
            subscriber_count: ch.subscriber_count,
            daily_subscriber_count: ch.daily_subscriber_count,
            weekly_subscriber_count: ch.weekly_subscriber_count,
            monthly_subscriber_count: ch.monthly_subscriber_count,
            view_count: ch.view_count,
            daily_view_count: ch.daily_view_count,
            weekly_view_count: ch.weekly_view_count,
            monthly_view_count: ch.monthly_view_count,
            updated_at: ch.updated_at,
        }
    }
}

pub async fn youtube_channels_list(
    query: ChannelsListRequestQuery,
    db: Database,
) -> Result<Json, Rejection> {
    tracing::info!(
        name = "GET /api/v3/youtube_channels",
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

    let channels = channels.into_iter().map(Into::into).collect();

    Ok(warp::reply::json(&ChannelsListResponseBody {
        updated_at,
        channels,
    }))
}

pub async fn bilibili_channels_list(
    query: ChannelsListRequestQuery,
    db: Database,
) -> Result<Json, Rejection> {
    tracing::info!(
        name = "GET /api/v3/bilibili_channels",
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

    let channels = channels.into_iter().map(Into::into).collect();

    Ok(warp::reply::json(&ChannelsListResponseBody {
        updated_at,
        channels,
    }))
}
