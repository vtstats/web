use chrono::{DateTime, Utc};
use sqlx::PgPool;
use warp::{reply::Json, Rejection};

use crate::error::Error;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsListRequestQuery {
    pub ids: String,
    pub start_at: Option<DateTime<Utc>>,
    pub end_at: Option<DateTime<Utc>>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsListResponseBody {
    pub updated_at: Option<DateTime<Utc>>,
    pub streams: Vec<Stream>,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Stream {
    stream_id: String,
    title: String,
    vtuber_id: String,
    status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    schedule_time: Option<DateTime<Utc>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    start_time: Option<DateTime<Utc>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    end_time: Option<DateTime<Utc>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    average_viewer_count: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    max_viewer_count: Option<i32>,
    updated_at: DateTime<Utc>,
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
                     status::text,
                     vtuber_id,
                     schedule_time,
                     start_time,
                     end_time,
                     average_viewer_count,
                     max_viewer_count,
                     updated_at
                from youtube_streams
               where vtuber_id = any(string_to_array($1, ','))
                 and (start_time > $2 or $2 is null)
                 and (start_time < $3 or $3 is null)
            order by start_time desc
               limit 24
        "#,
        query.ids,
        query.start_at,
        query.end_at
    )
    .fetch_all(&pool)
    .await
    .map_err(Error::Database)?;

    Ok(warp::reply::json(&StreamsListResponseBody {
        updated_at,
        streams,
    }))
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScheduleStreamsListRequestQuery {
    pub ids: String,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScheduleStreamsListResponseBody {
    pub updated_at: Option<DateTime<Utc>>,
    pub streams: Vec<ScheduleStream>,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScheduleStream {
    pub stream_id: String,
    pub title: String,
    pub vtuber_id: String,
    pub schedule_time: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub async fn youtube_schedule_streams_list(
    query: ScheduleStreamsListRequestQuery,
    pool: PgPool,
) -> Result<Json, Rejection> {
    let updated_at = sqlx::query!("select max(updated_at) from youtube_streams")
        .fetch_one(&pool)
        .await
        .map(|row| row.max)
        .map_err(Error::Database)?;

    let streams = sqlx::query_as!(
        ScheduleStream,
        r#"
              select stream_id, title, vtuber_id, schedule_time, updated_at
                from youtube_streams
               where vtuber_id = any(string_to_array($1, ','))
                 and start_time is null
                 and end_time is null
                 and schedule_time is not null
            order by schedule_time asc
        "#,
        query.ids
    )
    .fetch_all(&pool)
    .await
    .map_err(Error::Database)?;

    Ok(warp::reply::json(&ScheduleStreamsListResponseBody {
        streams,
        updated_at,
    }))
}
