use chrono::{
    serde::{ts_milliseconds, ts_milliseconds_option},
    DateTime, Utc,
};
use serde::{ser::Serializer, Serialize};
use serde_with::{rust::StringWithSeparator, skip_serializing_none, CommaSeparator};
use sqlx::PgPool;
use std::str::FromStr;
use tracing::field::{debug, Empty};
use warp::Rejection;

use crate::error::Error;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsReportRequestQuery {
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
    YoutubeStreamViewer,
}

impl FromStr for Metrics {
    type Err = &'static str;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "youtube_stream_viewer" => Ok(Metrics::YoutubeStreamViewer),
            _ => Err("unknown metrics"),
        }
    }
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
    pub rows: Vec<Row>,
}

pub struct Row {
    pub time: DateTime<Utc>,
    pub value: i32,
}

// serializing row as a tuple, it helps reducing response size
impl Serialize for Row {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        #[derive(serde::Serialize)]
        struct RowHelper(#[serde(with = "ts_milliseconds")] DateTime<Utc>, i32);

        RowHelper(self.time, self.value).serialize(serializer)
    }
}

#[skip_serializing_none]
#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Stream {
    pub stream_id: String,
    pub title: String,
    pub vtuber_id: String,
    #[serde(with = "ts_milliseconds_option")]
    pub schedule_time: Option<DateTime<Utc>>,
    #[serde(with = "ts_milliseconds_option")]
    pub start_time: Option<DateTime<Utc>>,
    #[serde(with = "ts_milliseconds_option")]
    pub end_time: Option<DateTime<Utc>>,
    pub average_viewer_count: Option<i32>,
    pub max_viewer_count: Option<i32>,
    #[serde(with = "ts_milliseconds")]
    pub updated_at: DateTime<Utc>,
    pub status: String,
}

pub async fn streams_report(
    query: StreamsReportRequestQuery,
    pool: PgPool,
) -> Result<impl warp::Reply, Rejection> {
    let span = tracing::debug_span!(
        "streams_report_v4",
        ids = ?query.ids,
        metrics = ?query.metrics,
        start_at = Empty,
        end_at = Empty,
    );

    if let Some(start_at) = query.start_at {
        span.record("start_at", &debug(start_at));
    }

    if let Some(end_at) = query.end_at {
        span.record("end_at", &debug(end_at));
    }

    let mut streams = Vec::with_capacity(query.ids.len());
    let mut reports = Vec::with_capacity(query.ids.len());

    for id in query.ids {
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
                       updated_at,
                       status::text
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

            for metric in &query.metrics {
                reports.push(match metric {
                    Metrics::YoutubeStreamViewer => {
                        youtube_stream_viewer(&id, query.start_at, query.end_at, &pool).await?
                    }
                });
            }
        }
    }

    let etag = streams
        .iter()
        .map(|s| s.updated_at)
        .max()
        .map(|t| t.timestamp())
        .unwrap_or_default();

    Ok(warp::reply::with_header(
        warp::reply::json(&StreamsReportResponseBody { streams, reports }),
        "etag",
        format!(r#""{}""#, etag),
    ))
}

async fn youtube_stream_viewer(
    id: &str,
    start_at: Option<DateTime<Utc>>,
    end_at: Option<DateTime<Utc>>,
    pool: &PgPool,
) -> Result<StreamsReport, Rejection> {
    let rows = sqlx::query_as!(
        Row,
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
        rows,
    })
}
