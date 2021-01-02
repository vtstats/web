use chrono::{serde::ts_milliseconds_option, DateTime, Utc};
use serde_with::{rust::StringWithSeparator, CommaSeparator};
use sqlx::PgPool;
use std::str::FromStr;
use tracing::instrument;
use warp::Rejection;

use super::db;
use crate::error::Error;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReqQuery {
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    ids: Vec<String>,
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    metrics: Vec<Metrics>,
    #[serde(default, with = "ts_milliseconds_option")]
    start_at: Option<DateTime<Utc>>,
    #[serde(default, with = "ts_milliseconds_option")]
    end_at: Option<DateTime<Utc>>,
}

#[derive(Debug)]
pub enum Metrics {
    YoutubeChannelSubscriber,
    YoutubeChannelView,
    BilibiliChannelSubscriber,
    BilibiliChannelView,
}

impl FromStr for Metrics {
    type Err = &'static str;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "youtube_channel_subscriber" => Ok(Metrics::YoutubeChannelSubscriber),
            "youtube_channel_view" => Ok(Metrics::YoutubeChannelView),
            "bilibili_channel_subscriber" => Ok(Metrics::BilibiliChannelSubscriber),
            "bilibili_channel_view" => Ok(Metrics::BilibiliChannelView),
            _ => Err("unknown metrics"),
        }
    }
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResBody {
    channels: Vec<db::Channel>,
    reports: Vec<db::Report>,
}

pub async fn channels_report(query: ReqQuery, pool: PgPool) -> Result<impl warp::Reply, Rejection> {
    tracing::info!(
        name = "GET /api/v4/channels_report",
        ids = ?query.ids.as_slice(),
        metrics = ?query.metrics.as_slice(),
    );

    if let Some(start_at) = query.start_at {
        tracing::info!(?start_at);
    }

    if let Some(end_at) = query.end_at {
        tracing::info!(?end_at);
    }

    let mut channels = Vec::with_capacity(query.ids.len());
    let mut reports = Vec::with_capacity(query.ids.len() * query.metrics.len());

    channels.extend(db::bilibili_channels(&query.ids, &pool).await?);
    channels.extend(db::youtube_channels(&query.ids, &pool).await?);

    for metric in &query.metrics {
        use Metrics::*;

        reports.extend(match metric {
            YoutubeChannelSubscriber => youtube_channel_subscriber(&query, &pool).await?,
            YoutubeChannelView => youtube_channel_view(&query, &pool).await?,
            BilibiliChannelSubscriber => bilibili_channel_subscriber(&query, &pool).await?,
            BilibiliChannelView => bilibili_channel_view(&query, &pool).await?,
        });
    }

    let etag = &channels
        .iter()
        .map(|c| c.updated_at)
        .max()
        .map(|t| t.timestamp())
        .unwrap_or_default();

    Ok(warp::reply::with_header(
        warp::reply::json(&ResBody { channels, reports }),
        "etag",
        format!(r#""{}""#, etag),
    ))
}

#[instrument(
    name = "select youtube_channel_subscriber_statistic",
    skip(query, pool),
    fields(db.table = "youtube_channel_subscriber_statistic"),
)]
async fn youtube_channel_subscriber(
    query: &ReqQuery,
    pool: &PgPool,
) -> Result<Vec<db::Report>, Error> {
    let rows = sqlx::query_as!(
        db::Statistic,
        r#"
            select vtuber_id as id, time, value
              from youtube_channel_subscriber_statistic
             where vtuber_id = any($1)
               and (time >= $2 or $2 is null)
               and (time <= $3 or $3 is null)
             order by vtuber_id
        "#,
        &query.ids,
        query.start_at,
        query.end_at
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)?;

    Ok(db::generate_report(rows, "youtube_channel_subscriber"))
}

#[instrument(
    name = "select youtube_channel_view_statistic",
    skip(query, pool),
    fields(db.table = "youtube_channel_view_statistic"),
)]
async fn youtube_channel_view(query: &ReqQuery, pool: &PgPool) -> Result<Vec<db::Report>, Error> {
    let rows = sqlx::query_as!(
        db::Statistic,
        r#"
            select vtuber_id as id, time, value
              from youtube_channel_view_statistic
             where vtuber_id = any($1)
               and (time >= $2 or $2 is null)
               and (time <= $3 or $3 is null)
             order by vtuber_id
        "#,
        &query.ids,
        query.start_at,
        query.end_at
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)?;

    Ok(db::generate_report(rows, "youtube_channel_view"))
}

#[instrument(
    name = "select bilibili_channel_subscriber_statistic",
    skip(query, pool),
    fields(db.table = "bilibili_channel_subscriber_statistic"),
)]
async fn bilibili_channel_subscriber(
    query: &ReqQuery,
    pool: &PgPool,
) -> Result<Vec<db::Report>, Error> {
    let rows = sqlx::query_as!(
        db::Statistic,
        r#"
            select vtuber_id as id, time, value
              from bilibili_channel_subscriber_statistic
             where vtuber_id = any($1)
               and (time >= $2 or $2 is null)
               and (time <= $3 or $3 is null)
             order by vtuber_id
        "#,
        &query.ids,
        query.start_at,
        query.end_at
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)?;

    Ok(db::generate_report(rows, "bilibili_channel_subscriber"))
}

#[instrument(
    name = "select bilibili_channel_view_statistic",
    skip(query, pool),
    fields(db.table = "bilibili_channel_view_statistic"),
)]
async fn bilibili_channel_view(query: &ReqQuery, pool: &PgPool) -> Result<Vec<db::Report>, Error> {
    let rows = sqlx::query_as!(
        db::Statistic,
        r#"
            select vtuber_id as id, time, value
              from bilibili_channel_view_statistic
             where vtuber_id = any($1)
               and (time >= $2 or $2 is null)
               and (time <= $3 or $3 is null)
             order by vtuber_id
        "#,
        &query.ids,
        query.start_at,
        query.end_at,
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)?;

    Ok(db::generate_report(rows, "bilibili_channel_view"))
}
