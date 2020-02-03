use chrono::{DateTime, Utc};
use sqlx::PgPool;
use warp::{reply::Json, Rejection};

use crate::error::Error;

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
pub struct StreamsListResponseBody {
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
}

pub async fn youtube_streams_list(
    query: StreamsListRequestQuery,
    mut pool: PgPool,
) -> Result<Json, Rejection> {
    let ids = query.ids.split(',').collect::<Vec<_>>();

    let rows = sqlx::query_as!(
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
    max_viewer_count
FROM youtube_streams
WHERE start_time > $1
AND start_time < $2
ORDER BY start_time DESC
        "#,
        query.start_at,
        query.end_at
    )
    .fetch_all(&mut pool)
    .await
    .map_err(Error::Sql)
    .map_err(warp::reject::custom)?;

    let streams = rows
        .into_iter()
        .filter(|row| ids.contains(&&*row.vtuber_id))
        .take(24)
        .collect::<Vec<_>>();

    Ok(warp::reply::json(&StreamsListResponseBody { streams }))
}
