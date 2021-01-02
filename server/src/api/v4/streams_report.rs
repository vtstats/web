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
pub struct ResBody {
    pub streams: Vec<db::Stream>,
    pub reports: Vec<db::Report>,
}

pub async fn streams_report(query: ReqQuery, pool: PgPool) -> Result<impl warp::Reply, Rejection> {
    tracing::info!(
        name = "GET /api/v4/streams_report",
        ids = ?query.ids.as_slice(),
        metrics = ?query.metrics.as_slice(),
    );

    if let Some(start_at) = query.start_at {
        tracing::info!(?start_at);
    }

    if let Some(end_at) = query.end_at {
        tracing::info!(?end_at);
    }

    let mut streams = Vec::with_capacity(query.ids.len());
    let mut reports = Vec::with_capacity(query.ids.len());

    streams.extend(youtube_streams(&query, &pool).await?);

    for metric in &query.metrics {
        reports.extend(match metric {
            Metrics::YoutubeStreamViewer => youtube_stream_viewer(&query, &pool).await?,
        });
    }

    let etag = streams
        .iter()
        .map(|s| s.updated_at)
        .max()
        .map(|t| t.timestamp())
        .unwrap_or_default();

    Ok(warp::reply::with_header(
        warp::reply::json(&ResBody { streams, reports }),
        "etag",
        format!(r#""{}""#, etag),
    ))
}

#[instrument(
    name = "Select youtube streams",
    skip(query, pool),
    fields(db.table = "youtube_streams"),
)]
async fn youtube_streams(query: &ReqQuery, pool: &PgPool) -> Result<Vec<db::Stream>, Error> {
    sqlx::query_as!(
        db::Stream,
        r#"
            select stream_id,
                   title,
                   vtuber_id,
                   thumbnail_url,
                   schedule_time,
                   start_time,
                   end_time,
                   average_viewer_count,
                   max_viewer_count,
                   updated_at,
                   status as "status: _"
              from youtube_streams
             where stream_id = any($1)
        "#,
        &query.ids
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)
}

#[instrument(
    name = "Select youtube_stream_viewer_statistic",
    skip(query, pool),
    fields(db.table = "youtube_stream_viewer_statistic"),
)]
async fn youtube_stream_viewer(query: &ReqQuery, pool: &PgPool) -> Result<Vec<db::Report>, Error> {
    let rows = sqlx::query_as!(
        db::Statistic,
        r#"
            select stream_id as id, time, value
              from youtube_stream_viewer_statistic
             where stream_id = any($1)
               and (time >= $2 or $2 is null)
               and (time <= $3 or $3 is null)
          order by stream_id
        "#,
        &query.ids,
        query.start_at,
        query.end_at
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)?;

    Ok(db::generate_report(rows, "youtube_stream_viewer"))
}
