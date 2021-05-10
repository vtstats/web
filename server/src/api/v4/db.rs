use chrono::{
    serde::{ts_milliseconds, ts_milliseconds_option},
    DateTime, Utc,
};
use serde_with::skip_serializing_none;
use sqlx::PgPool;
use tracing::instrument;

use crate::error::{Error, Result};

type UtcTime = DateTime<Utc>;

// ==== channel ====

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Channel {
    pub kind: String,
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
    pub updated_at: UtcTime,
}

#[instrument(
    name = "Select from youtube_channels",
    skip(ids, pool),
    fields(db.table = "youtube_channels")
)]
pub async fn youtube_channels(ids: &[String], pool: &PgPool) -> Result<Vec<Channel>> {
    sqlx::query_as!(
        Channel,
        r#"
            select 'youtube' as "kind!",
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
              from youtube_channels
             where vtuber_id = any($1)
        "#,
        &ids
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)
}

#[instrument(
    name = "Get last updated time of youtube_channels",
    skip(pool),
    fields(db.table = "youtube_channels")
)]
pub async fn youtube_channel_max_updated_at(pool: &PgPool) -> Result<Option<UtcTime>> {
    sqlx::query!("select max(updated_at) from youtube_channels")
        .fetch_one(pool)
        .await
        .map(|row| row.max)
        .map_err(Error::Database)
}

// ==== channel EX ====

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ChannelEX {
    pub kind: String,
    pub vtuber_id: String,
    pub video_count: i32,
    pub weekly_video: i32,
    pub weekly_live: i32,
    pub weekly_duration: i32,
    pub monthly_video: i32,
    pub monthly_live: i32,
    pub monthly_duration: i32,
    #[serde(with = "ts_milliseconds")]
    pub updated_at: UtcTime,
}

#[instrument(
    name = "Select from youtube_channels_ex",
    skip(ids, pool),
    fields(db.table = "youtube_channels_ex")
)]
pub async fn youtube_channels_ex(ids: &[String], pool: &PgPool) -> Result<Vec<ChannelEX>> {
    sqlx::query_as!(
        ChannelEX,
        r#"
            select 'youtube' as "kind!",
                   vtuber_id,
                   video_count,
                   weekly_video,
                   weekly_live,
                   weekly_duration,
                   monthly_video,
                   monthly_live,
                   monthly_duration,
                   updated_at
              from youtube_channels_ex
             where vtuber_id = any($1)
        "#,
        &ids
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)
}

#[instrument(
    name = "Get last updated time of youtube_channels_ex",
    skip(pool),
    fields(db.table = "youtube_channels_ex")
)]
pub async fn youtube_channel_ex_max_updated_at(pool: &PgPool) -> Result<Option<UtcTime>> {
    sqlx::query!("select max(updated_at) from youtube_channels_ex")
        .fetch_one(pool)
        .await
        .map(|row| row.max)
        .map_err(Error::Database)
}

// ==== Bilibili channel ====

#[instrument(
    name = "Select from bilibili_channels",
    skip(ids, pool),
    fields(db.table = "bilibili_channels")
)]
pub async fn bilibili_channels(ids: &[String], pool: &PgPool) -> Result<Vec<Channel>> {
    sqlx::query_as!(
        Channel,
        r#"
            select 'bilibili' as "kind!",
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
              from bilibili_channels
             where vtuber_id = any($1)
        "#,
        &ids
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)
}

#[instrument(
    name = "Get last updated time of bilibili_channels",
    skip(pool),
    fields(db.table = "bilibili_channels")
)]
pub async fn bilibili_channel_max_updated_at(pool: &PgPool) -> Result<Option<UtcTime>> {
    sqlx::query!("select max(updated_at) from bilibili_channels")
        .fetch_one(pool)
        .await
        .map(|row| row.max)
        .map_err(Error::Database)
}

// ==== stream ====

#[skip_serializing_none]
#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Stream {
    pub stream_id: String,
    pub title: String,
    pub vtuber_id: String,
    pub thumbnail_url: Option<String>,
    #[serde(with = "ts_milliseconds_option")]
    pub schedule_time: Option<UtcTime>,
    #[serde(with = "ts_milliseconds_option")]
    pub start_time: Option<UtcTime>,
    #[serde(with = "ts_milliseconds_option")]
    pub end_time: Option<UtcTime>,
    pub average_viewer_count: Option<i32>,
    pub max_viewer_count: Option<i32>,
    #[serde(with = "ts_milliseconds")]
    pub updated_at: UtcTime,
    pub status: StreamStatus,
}

#[derive(Debug, sqlx::Type, serde::Serialize)]
#[sqlx(type_name = "stream_status", rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
pub enum StreamStatus {
    Scheduled,
    Live,
    Ended,
}

#[instrument(
    name = "Get last updated time of youtube_streams",
    skip(pool),
    fields(db.table = "youtube_streams")
)]
pub async fn youtube_stream_max_updated_at(pool: &PgPool) -> Result<Option<UtcTime>> {
    sqlx::query!("select max(updated_at) from youtube_streams")
        .fetch_one(pool)
        .await
        .map(|row| row.max)
        .map_err(Error::Database)
}

// ==== statistic ====

pub struct Statistic {
    pub id: String,
    pub time: DateTime<Utc>,
    pub value: i32,
}

#[derive(serde::Serialize)]
pub struct Timestamp(#[serde(with = "ts_milliseconds")] DateTime<Utc>);

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Report {
    pub id: String,
    pub kind: String,
    pub rows: Vec<(Timestamp, i32)>,
}

pub fn generate_report(rows: Vec<Statistic>, kind: &str) -> Vec<Report> {
    let mut reports = Vec::<Report>::new();

    for row in rows {
        let last = reports.last_mut();
        if let Some(report) = last.filter(|report| report.id == row.id) {
            report.rows.push((Timestamp(row.time), row.value));
        } else {
            reports.push(Report {
                id: row.id.to_string(),
                kind: kind.to_string(),
                rows: Vec::new(),
            })
        }
    }

    reports
}
