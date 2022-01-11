use chrono::{serde::ts_milliseconds_option, DateTime, Utc};
use holostats_database::{
    statistic::{Report, Timestamp},
    streams::Stream,
    Database,
};
use serde_with::{rust::StringWithSeparator, CommaSeparator};
use std::convert::Into;
use std::str::FromStr;
use warp::Rejection;

use crate::reject::WarpError;

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
    YoutubeLiveChatMessage,
    YoutubeStreamLike,
}

impl FromStr for Metrics {
    type Err = &'static str;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "youtube_stream_viewer" => Ok(Metrics::YoutubeStreamViewer),
            "youtube_stream_like" => Ok(Metrics::YoutubeStreamLike),
            "youtube_live_chat_message" => Ok(Metrics::YoutubeLiveChatMessage),
            _ => Err("unknown metrics"),
        }
    }
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

    streams.extend(
        db.youtube_streams_by_ids(&query.ids)
            .await
            .map_err(Into::<WarpError>::into)?,
    );

    for metric in &query.metrics {
        match metric {
            Metrics::YoutubeStreamViewer => reports.extend(
                db.youtube_stream_viewer(&query.ids, &query.start_at, &query.end_at)
                    .await
                    .map_err(Into::<WarpError>::into)?
                    .into_iter()
                    .map(OneOf::A),
            ),
            Metrics::YoutubeStreamLike => reports.extend(
                db.youtube_stream_like(&query.ids, &query.start_at, &query.end_at)
                    .await
                    .map_err(Into::<WarpError>::into)?
                    .into_iter()
                    .map(OneOf::A),
            ),
            Metrics::YoutubeLiveChatMessage => reports.extend(
                db.youtube_live_chat_message(&query.ids, &query.start_at, &query.end_at)
                    .await
                    .map_err(Into::<WarpError>::into)?
                    .into_iter()
                    .map(OneOf::B),
            ),
        }
    }

    Ok(warp::reply::json(&ResBody { streams, reports }))
}
