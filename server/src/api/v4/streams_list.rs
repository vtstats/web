use chrono::{
    serde::{ts_milliseconds, ts_milliseconds_option},
    DateTime, Utc,
};
use serde_with::{rust::StringWithSeparator, skip_serializing_none, CommaSeparator};
use sqlx::PgPool;
use std::default::Default;
use tracing::field::{debug, Empty};
use warp::Rejection;

use crate::error::Error;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsListRequestQuery {
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    pub ids: Vec<String>,
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    pub status: Vec<String>,
    #[serde(default)]
    pub order_by: OrderBy,
    #[serde(default, with = "ts_milliseconds_option")]
    pub start_at: Option<DateTime<Utc>>,
    #[serde(default, with = "ts_milliseconds_option")]
    pub end_at: Option<DateTime<Utc>>,
}

#[derive(serde::Deserialize, Debug)]
pub enum OrderBy {
    #[serde(rename = "start_time:asc")]
    StartTimeAsc,
    #[serde(rename = "end_time:asc")]
    EndTimeAsc,
    #[serde(rename = "schedule_time:asc")]
    ScheduleTimeAsc,
    #[serde(rename = "start_time:desc")]
    StartTimeDesc,
    #[serde(rename = "end_time:desc")]
    EndTimeDesc,
    #[serde(rename = "schedule_time:desc")]
    ScheduleTimeDesc,
}

impl OrderBy {
    fn as_str(&self) -> &'static str {
        match self {
            OrderBy::StartTimeAsc => "start_time:asc",
            OrderBy::EndTimeAsc => "end_time:asc",
            OrderBy::ScheduleTimeAsc => "schedule_time:asc",
            OrderBy::StartTimeDesc => "start_time:desc",
            OrderBy::EndTimeDesc => "end_time:desc",
            OrderBy::ScheduleTimeDesc => "schedule_time:desc",
        }
    }
}

impl Default for OrderBy {
    fn default() -> Self {
        OrderBy::StartTimeDesc
    }
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsListResponseBody {
    #[serde(with = "ts_milliseconds_option")]
    pub updated_at: Option<DateTime<Utc>>,
    pub streams: Vec<Stream>,
}

#[skip_serializing_none]
#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Stream {
    stream_id: String,
    title: String,
    vtuber_id: String,
    #[serde(with = "ts_milliseconds_option")]
    schedule_time: Option<DateTime<Utc>>,
    #[serde(with = "ts_milliseconds_option")]
    start_time: Option<DateTime<Utc>>,
    #[serde(with = "ts_milliseconds_option")]
    end_time: Option<DateTime<Utc>>,
    average_viewer_count: Option<i32>,
    max_viewer_count: Option<i32>,
    #[serde(with = "ts_milliseconds")]
    updated_at: DateTime<Utc>,
    status: StreamStatus,
}

#[derive(Debug, sqlx::Type, serde::Serialize)]
#[sqlx(rename = "stream_status", rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
pub enum StreamStatus {
    Scheduled,
    Live,
    Ended,
}

pub async fn youtube_streams_list(
    query: StreamsListRequestQuery,
    pool: PgPool,
) -> Result<impl warp::Reply, Rejection> {
    let span = tracing::debug_span!(
        "youtube_streams_v4",
        ids = ?query.ids,
        status = ?query.status,
        order_by = ?query.order_by,
        start_at = Empty,
        end_at = Empty,
    );

    if let Some(start_at) = query.start_at {
        span.record("start_at", &debug(start_at));
    }

    if let Some(end_at) = query.end_at {
        span.record("end_at", &debug(end_at));
    }

    let updated_at = sqlx::query!("select max(updated_at) from youtube_streams")
        .fetch_one(&pool)
        .await
        .map(|row| row.max)
        .map_err(Error::Database)?;

    let streams = sqlx::query_as!(
        Stream,
        r#"
              select stream_id,
                     title,
                     vtuber_id,
                     schedule_time,
                     start_time,
                     end_time,
                     average_viewer_count,
                     max_viewer_count,
                     updated_at,
                     status as "status: _"
                from youtube_streams
               where vtuber_id = any($1)
                 and status::text = any($5)
                 and (
                       -- start_at
                       case $4
                         when 'schedule_time:asc'  then schedule_time > $2
                         when 'schedule_time:desc' then schedule_time > $2
                         when 'end_time:asc'       then end_time      > $2
                         when 'end_time:desc'      then end_time      > $2
                         when 'start_time:asc'     then start_time    > $2
                         when 'start_time:desc'    then start_time    > $2
                       end
                       or $2 is null
                     )
                 and (
                       -- end_at
                       case $4
                         when 'schedule_time:asc'  then schedule_time < $3
                         when 'schedule_time:desc' then schedule_time < $3
                         when 'end_time:asc'       then end_time      < $3
                         when 'end_time:desc'      then end_time      < $3
                         when 'start_time:asc'     then start_time    < $3
                         when 'start_time:desc'    then start_time    < $3
                       end
                       or $3 is null
                     )
            order by case $4
                       when 'start_time:asc'     then start_time
                       when 'end_time:asc'       then end_time
                       when 'schedule_time:asc'  then schedule_time
                       else null
                     end asc,
                     case $4
                       when 'start_time:desc'    then start_time
                       when 'end_time:desc'      then end_time
                       when 'schedule_time:desc' then schedule_time
                       else null
                     end desc
               limit 24
        "#,
        &query.ids,
        query.start_at,
        query.end_at,
        query.order_by.as_str(),
        &query.status,
    )
    .fetch_all(&pool)
    .await
    .map_err(Error::Database)?;

    let etag = updated_at.map(|t| t.timestamp()).unwrap_or_default();

    Ok(warp::reply::with_header(
        warp::reply::json(&StreamsListResponseBody {
            updated_at,
            streams,
        }),
        "etag",
        format!(r#""{}""#, etag),
    ))
}
