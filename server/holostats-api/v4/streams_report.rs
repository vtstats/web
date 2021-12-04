use chrono::{serde::ts_milliseconds_option, DateTime, Utc};
use holostats_database::{statistic::Report, streams::Stream, Database};
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
    YoutubeLiveChatMessageFromMember,
}

impl FromStr for Metrics {
    type Err = &'static str;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "youtube_stream_viewer" => Ok(Metrics::YoutubeStreamViewer),
            "youtube_live_chat_message" => Ok(Metrics::YoutubeLiveChatMessage),
            "youtube_live_chat_message_from_member" => {
                Ok(Metrics::YoutubeLiveChatMessageFromMember)
            }
            _ => Err("unknown metrics"),
        }
    }
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResBody {
    pub streams: Vec<Stream>,
    pub reports: Vec<Report>,
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
        reports.extend(match metric {
            Metrics::YoutubeStreamViewer => db
                .youtube_stream_viewer(&query.ids, &query.start_at, &query.end_at)
                .await
                .map_err(Into::<WarpError>::into)?,
            Metrics::YoutubeLiveChatMessage => db
                .youtube_live_chat_message(&query.ids, &query.start_at, &query.end_at)
                .await
                .map_err(Into::<WarpError>::into)?,
            Metrics::YoutubeLiveChatMessageFromMember => db
                .youtube_live_chat_message_from_member(&query.ids, &query.start_at, &query.end_at)
                .await
                .map_err(Into::<WarpError>::into)?,
        });
    }

    Ok(warp::reply::json(&ResBody { streams, reports }))
}
