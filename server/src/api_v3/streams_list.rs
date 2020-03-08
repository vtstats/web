use chrono::{DateTime, Utc};
use sqlx::PgPool;
use warp::{reply::Json, Rejection};

use crate::error::Error;
use crate::vtubers::VTUBER_IDS;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsListRequestQuery {
    ids: String,
    #[serde(default = "crate::utils::epoch_date_time")]
    start_at: DateTime<Utc>,
    #[serde(default = "Utc::now")]
    end_at: DateTime<Utc>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsListResponseBody {
    updated_at: DateTime<Utc>,
    streams: Vec<Stream>,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Stream {
    stream_id: String,
    title: String,
    vtuber_id: String,
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

pub async fn youtube_streams_list(
    query: StreamsListRequestQuery,
    mut pool: PgPool,
) -> Result<Json, Rejection> {
    if query.ids.split(',').any(|id| !VTUBER_IDS.contains(&id)) {
        // TODO: return invalid request string
    }

    let rec = sqlx::query!("SELECT MAX(updated_at) FROM youtube_streams")
        .fetch_one(&mut pool)
        .await
        .map_err(Error::Database)
        .map_err(warp::reject::custom)?;

    let updated_at = rec.max;

    let streams = sqlx::query_as!(
        Stream,
        r#"
SELECT
    stream_id,
    title,
    vtuber_id,
    schedule_time,
    start_time,
    end_time,
    average_viewer_count,
    max_viewer_count,
    updated_at
FROM youtube_streams
WHERE vtuber_id = ANY(string_to_array($1, ','))
AND start_time > $2
AND start_time < $3
ORDER BY start_time DESC
        "#,
        query.ids,
        query.start_at,
        query.end_at
    )
    .fetch_all(&mut pool)
    .await
    .map_err(Error::Database)
    .map_err(warp::reject::custom)?;

    Ok(warp::reply::json(&StreamsListResponseBody {
        updated_at,
        streams,
    }))
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScheduleStreamsListRequestQuery {
    ids: String,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScheduleStreamsListResponseBody {
    updated_at: DateTime<Utc>,
    streams: Vec<ScheduleStream>,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScheduleStream {
    stream_id: String,
    title: String,
    vtuber_id: String,
    schedule_time: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}

pub async fn youtube_schedule_streams_list(
    query: ScheduleStreamsListRequestQuery,
    mut pool: PgPool,
) -> Result<Json, Rejection> {
    if query.ids.split(',').any(|id| !VTUBER_IDS.contains(&id)) {
        // TODO: return invalid request string
    }

    let rec = sqlx::query!("SELECT MAX(updated_at) FROM youtube_streams")
        .fetch_one(&mut pool)
        .await
        .map_err(Error::Database)
        .map_err(warp::reject::custom)?;

    let updated_at = rec.max;

    let streams = sqlx::query_as!(
        ScheduleStream,
        r#"
SELECT stream_id, title, vtuber_id, schedule_time, updated_at
FROM youtube_streams
WHERE vtuber_id = ANY(string_to_array($1, ','))
AND start_time IS NULL
AND end_time IS NULL
AND schedule_time IS NOT NULL
ORDER BY schedule_time ASC
        "#,
        query.ids
    )
    .fetch_all(&mut pool)
    .await
    .map_err(Error::Database)
    .map_err(warp::reject::custom)?;

    Ok(warp::reply::json(&ScheduleStreamsListResponseBody {
        streams,
        updated_at,
    }))
}
