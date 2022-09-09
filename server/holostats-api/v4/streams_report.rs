use chrono::{serde::ts_milliseconds_option, DateTime, Utc};
use holostats_database::{
    statistic::{Report, Timestamp},
    stream::{ListYouTubeStreamsQuery, Stream},
    Database,
};
use serde_with::{rust::StringWithSeparator, CommaSeparator};
use std::convert::Into;
use tracing::Span;
use warp::Rejection;

use crate::reject::WarpError;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReqQuery {
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    ids: Vec<String>,
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    metrics: Vec<String>,
    #[serde(default, with = "ts_milliseconds_option")]
    start_at: Option<DateTime<Utc>>,
    #[serde(default, with = "ts_milliseconds_option")]
    end_at: Option<DateTime<Utc>>,
}

#[derive(serde::Serialize)]
#[serde(untagged)]
pub enum OneOf {
    A(Report<(Timestamp, i32)>),
    B(Report<(Timestamp, i32, i32)>),
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResBody {
    pub streams: Vec<Stream>,
    pub reports: Vec<OneOf>,
}

pub async fn streams_report(query: ReqQuery, db: Database) -> Result<impl warp::Reply, Rejection> {
    Span::current().record("name", &"GET /api/v4/streams_report");

    tracing::info!(
        "ids={:?} metrics={:?} start_at={:?} end_at={:?}",
        query.ids,
        query.metrics,
        query.start_at,
        query.end_at,
    );

    let streams = ListYouTubeStreamsQuery {
        stream_ids: &query.ids,
        ..Default::default()
    }
    .execute(&db.pool)
    .await
    .map_err(Into::<WarpError>::into)?;

    let mut reports = Vec::with_capacity(query.ids.len());

    for metric in &query.metrics {
        match metric.as_str() {
            "youtube_stream_viewer" => reports.extend(
                db.youtube_stream_viewer(&query.ids, &query.start_at, &query.end_at)
                    .await
                    .map_err(Into::<WarpError>::into)?
                    .into_iter()
                    .map(OneOf::A),
            ),
            "youtube_live_chat_message" => reports.extend(
                db.youtube_live_chat_message(&query.ids, &query.start_at, &query.end_at)
                    .await
                    .map_err(Into::<WarpError>::into)?
                    .into_iter()
                    .map(OneOf::B),
            ),
            _ => {}
        }
    }

    Ok(warp::reply::json(&ResBody { streams, reports }))
}
