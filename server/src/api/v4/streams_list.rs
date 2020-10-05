use chrono::{
    serde::{ts_milliseconds, ts_milliseconds_option},
    DateTime, Utc,
};
use serde_with::{rust::StringWithSeparator, skip_serializing_none, CommaSeparator};
use sqlx::PgPool;
use warp::{reply::Json, Rejection};

use crate::error::Error;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsListRequestQuery {
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    pub ids: Vec<String>,
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    pub status: Vec<String>,
    pub order_by: Option<OrderBy>,
    #[serde(default, with = "ts_milliseconds_option")]
    pub start_at: Option<DateTime<Utc>>,
    #[serde(default, with = "ts_milliseconds_option")]
    pub end_at: Option<DateTime<Utc>>,
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum OrderBy {
    StartTime,
    EndTime,
    ScheduleTime,
}

impl OrderBy {
    fn as_str(&self) -> &'static str {
        match self {
            OrderBy::StartTime => "start_time",
            OrderBy::EndTime => "end_time",
            OrderBy::ScheduleTime => "schedule_time",
        }
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
    status: String,
}

// TODO: sqlx doesn't yet support user-defined types in query_as!
// https://github.com/launchbadge/sqlx/issues/148
//
// #[derive(PartialEq, Debug, sqlx::Type, serde::Serialize)]
// #[sqlx(rename = "youtube_stream_status")]
// #[sqlx(rename_all = "lowercase")]
// #[serde(rename_all = "lowercase")]
// enum YouTubeStreamStatus {
//     Schedule,
//     Live,
//     End,
// }

pub async fn youtube_streams_list(
    query: StreamsListRequestQuery,
    pool: PgPool,
) -> Result<Json, Rejection> {
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
                     status::text
                from youtube_streams
               where vtuber_id = any($1)
                 and status::text = any($5)
                 and (
                       case $4
                         when 'schedule_time' then schedule_time < $2
                         when 'end_time' then end_time < $2
                         else start_time < $2
                       end
                       or $2 is null
                     )
                 and (
                       case $4
                         when 'schedule_time' then schedule_time > $3
                         when 'end_time' then end_time > $3
                         else start_time > $3
                       end
                       or $3 is null
                     )
            order by case $4
                       when 'schedule_time' then schedule_time
                       when 'end_time' then end_time
                       else start_time
                     end
                     desc
               limit 24
        "#,
        &query.ids,
        query.start_at,
        query.end_at,
        query.order_by.map(|o| o.as_str()),
        &query.status,
    )
    .fetch_all(&pool)
    .await
    .map_err(Error::Database)?;

    Ok(warp::reply::json(&StreamsListResponseBody {
        updated_at,
        streams,
    }))
}
