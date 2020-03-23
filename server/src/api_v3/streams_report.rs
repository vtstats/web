use chrono::{DateTime, Utc};
use sqlx::PgPool;
use warp::{reply::Json, Rejection};

use crate::error::Error;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsReportRequestQuery {
    ids: String,
    metrics: String,
    #[serde(default = "crate::utils::epoch_date_time")]
    start_at: DateTime<Utc>,
    #[serde(default = "Utc::now")]
    end_at: DateTime<Utc>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsReportResponseBody {
    streams: Vec<Stream>,
    reports: Vec<StreamsReport>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsReport {
    id: String,
    kind: String,
    rows: Vec<(DateTime<Utc>, i32)>,
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

pub async fn streams_report(
    query: StreamsReportRequestQuery,
    mut pool: PgPool,
) -> Result<Json, Rejection> {
    let mut streams = vec![];
    let mut reports = vec![];

    for id in query.ids.split(',') {
        let stream = sqlx::query_as!(
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
       updated_at
  from youtube_streams
 where stream_id = $1
        "#,
            id.to_string()
        )
        .fetch_optional(&mut pool)
        .await
        .map_err(Error::Database)
        .map_err(warp::reject::custom)?;

        if let Some(stream) = stream {
            streams.push(stream);
            for metric in query.metrics.split(',') {
                match metric {
                    "youtube_stream_viewer" => reports.push(
                        youtube_stream_viewer(
                            id.to_string(),
                            query.start_at,
                            query.end_at,
                            &mut pool,
                        )
                        .await?,
                    ),
                    _ => (),
                }
            }
        }
    }

    Ok(warp::reply::json(&StreamsReportResponseBody {
        streams,
        reports,
    }))
}

async fn youtube_stream_viewer(
    id: String,
    start_at: DateTime<Utc>,
    end_at: DateTime<Utc>,
    pool: &mut PgPool,
) -> Result<StreamsReport, Rejection> {
    let rows = sqlx::query!(
        r#"
select time, value
  from youtube_stream_viewer_statistic
 where stream_id = $1
   and time > $2
   and time < $3
        "#,
        id,
        start_at,
        end_at
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)
    .map_err(warp::reject::custom)?;

    Ok(StreamsReport {
        id,
        kind: String::from("youtube_stream_viewer"),
        rows: rows
            .into_iter()
            .map(|r| (r.time, r.value))
            .collect::<Vec<_>>(),
    })
}
