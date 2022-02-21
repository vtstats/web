use chrono::{serde::ts_milliseconds_option, DateTime, Utc};
use holostats_database::{
    channels::Channel,
    statistic::{Reports, Timestamp},
    Database,
};
use serde_with::{rust::StringWithSeparator, CommaSeparator};
use std::convert::Into;
use std::str::FromStr;
use tracing::Span;
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
    YoutubeChannelSubscriber,
    YoutubeChannelView,
    BilibiliChannelSubscriber,
    BilibiliChannelView,
}

impl FromStr for Metrics {
    type Err = &'static str;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "youtube_channel_subscriber" => Ok(Metrics::YoutubeChannelSubscriber),
            "youtube_channel_view" => Ok(Metrics::YoutubeChannelView),
            "bilibili_channel_subscriber" => Ok(Metrics::BilibiliChannelSubscriber),
            "bilibili_channel_view" => Ok(Metrics::BilibiliChannelView),
            _ => Err("unknown metrics"),
        }
    }
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResBody {
    channels: Vec<Channel>,
    reports: Reports<(Timestamp, i32)>,
}

pub async fn channels_report(query: ReqQuery, db: Database) -> Result<impl warp::Reply, Rejection> {
    Span::current().record("name", &"GET /api/v4/channels_report");

    tracing::info!(
        "ids={:?}, metrics={:?}, start_at={:?}, end_at={:?}",
        query.ids,
        query.metrics,
        query.start_at,
        query.end_at
    );

    let mut channels = Vec::with_capacity(query.ids.len());
    let mut reports = Vec::with_capacity(query.ids.len() * query.metrics.len());

    channels.extend(
        db.bilibili_channels(&query.ids)
            .await
            .map_err(Into::<WarpError>::into)?,
    );
    channels.extend(
        db.youtube_channels(&query.ids)
            .await
            .map_err(Into::<WarpError>::into)?,
    );

    for metric in &query.metrics {
        use Metrics::*;

        reports.extend(
            match metric {
                YoutubeChannelSubscriber => {
                    db.youtube_channel_subscriber(&query.ids, &query.start_at, &query.end_at)
                        .await
                }
                YoutubeChannelView => {
                    db.youtube_channel_view(&query.ids, &query.start_at, &query.end_at)
                        .await
                }
                BilibiliChannelSubscriber => {
                    db.bilibili_channel_subscriber(&query.ids, &query.start_at, &query.end_at)
                        .await
                }
                BilibiliChannelView => {
                    db.bilibili_channel_view(&query.ids, &query.start_at, &query.end_at)
                        .await
                }
            }
            .map_err(Into::<WarpError>::into)?,
        );
    }

    Ok(warp::reply::json(&ResBody { channels, reports }))
}
