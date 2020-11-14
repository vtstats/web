use chrono::{DateTime, Utc};
use sqlx::PgPool;
use warp::{reply::Json, Rejection};

use crate::error::Error;

#[derive(serde::Deserialize)]
pub struct ChannelsListRequestQuery {
    ids: String,
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

pub async fn youtube_channels_list(
    query: ChannelsListRequestQuery,
    pool: PgPool,
) -> Result<Json, Rejection> {
    tracing::debug_span!("youtube_channels_v3", ids = ?query.ids);

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
             where vtuber_id = any(string_to_array($1, ','))
        "#,
        query.ids
    )
    .fetch_all(&pool)
    .await
    .map_err(Error::Database)?;

    Ok(warp::reply::json(&ChannelsListResponseBody {
        updated_at,
        channels,
    }))
}

pub async fn bilibili_channels_list(
    query: ChannelsListRequestQuery,
    pool: PgPool,
) -> Result<Json, Rejection> {
    tracing::debug_span!("bilibili_channels_v3", ids = ?query.ids);

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
             where vtuber_id = any(string_to_array($1, ','))
        "#,
        query.ids
    )
    .fetch_all(&pool)
    .await
    .map_err(Error::Database)?;

    Ok(warp::reply::json(&ChannelsListResponseBody {
        updated_at,
        channels,
    }))
}
