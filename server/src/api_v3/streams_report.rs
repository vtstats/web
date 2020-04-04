use chrono::{DateTime, Utc};
use sqlx::PgPool;
use warp::{reply::Json, Rejection};

use crate::error::Error;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsReportRequestQuery {
    ids: String,
    metrics: String,
    start_at: Option<DateTime<Utc>>,
    end_at: Option<DateTime<Utc>>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsReportResponseBody {
    pub streams: Vec<Stream>,
    pub reports: Vec<StreamsReport>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsReport {
    pub id: String,
    pub kind: String,
    pub rows: Vec<(DateTime<Utc>, i32)>,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Stream {
    pub stream_id: String,
    pub title: String,
    pub vtuber_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub schedule_time: Option<DateTime<Utc>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start_time: Option<DateTime<Utc>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub end_time: Option<DateTime<Utc>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub average_viewer_count: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_viewer_count: Option<i32>,
    pub updated_at: DateTime<Utc>,
}

pub async fn streams_report(
    query: StreamsReportRequestQuery,
    pool: PgPool,
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
            id
        )
        .fetch_optional(&pool)
        .await
        .map_err(Error::Database)?;

        if let Some(stream) = stream {
            streams.push(stream);
            for metric in query.metrics.split(',') {
                match metric {
                    "youtube_stream_viewer" => reports.push(
                        youtube_stream_viewer(id, query.start_at, query.end_at, &pool).await?,
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
    id: &str,
    start_at: Option<DateTime<Utc>>,
    end_at: Option<DateTime<Utc>>,
    pool: &PgPool,
) -> Result<StreamsReport, Rejection> {
    let rows = sqlx::query!(
        r#"
            select time, value
              from youtube_stream_viewer_statistic
             where stream_id = $1
               and (time >= $2 or $2 is null)
               and (time <= $3 or $3 is null)
        "#,
        id,
        start_at,
        end_at
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)?;

    Ok(StreamsReport {
        id: id.to_string(),
        kind: String::from("youtube_stream_viewer"),
        rows: rows
            .into_iter()
            .map(|r| (r.time, r.value))
            .collect::<Vec<_>>(),
    })
}
