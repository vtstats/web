use chrono::{DateTime, Utc};
use holostats_database::{
    channels::Channel as Channel_,
    statistic::{Reports, Timestamp},
    Database,
};
use serde_with::{rust::StringWithSeparator, CommaSeparator};
use std::convert::Into;
use warp::{reply::Json, Rejection};

use crate::reject::WarpError;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChannelsReportRequestQuery {
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    ids: Vec<String>,
    metrics: String,
    start_at: Option<DateTime<Utc>>,
    end_at: Option<DateTime<Utc>>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ChannelsReportResponseBody {
    channels: Vec<Channel>,
    reports: Reports<(Timestamp, i32)>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Channel {
    platform: String,
    vtuber_id: String,
    subscriber_count: i32,
    daily_subscriber_count: i32,
    weekly_subscriber_count: i32,
    monthly_subscriber_count: i32,
    view_count: i32,
    daily_view_count: i32,
    weekly_view_count: i32,
    monthly_view_count: i32,
    updated_at: DateTime<Utc>,
}

impl From<Channel_> for Channel {
    fn from(ch: Channel_) -> Self {
        Channel {
            platform: ch.kind,
            vtuber_id: ch.vtuber_id,
            subscriber_count: ch.subscriber_count,
            daily_subscriber_count: ch.daily_subscriber_count,
            weekly_subscriber_count: ch.weekly_subscriber_count,
            monthly_subscriber_count: ch.monthly_subscriber_count,
            view_count: ch.view_count,
            daily_view_count: ch.daily_view_count,
            weekly_view_count: ch.weekly_view_count,
            monthly_view_count: ch.monthly_view_count,
            updated_at: ch.updated_at,
        }
    }
}

pub async fn channels_report(
    query: ChannelsReportRequestQuery,
    db: Database,
) -> Result<Json, Rejection> {
    tracing::info!(
        name = "GET /api/v3/channels_report",
        ids = ?query.ids.as_slice(),
        metrics = &query.metrics.as_str(),
    );

    if let Some(start_at) = query.start_at {
        tracing::info!(?start_at);
    }

    if let Some(end_at) = query.end_at {
        tracing::info!(?end_at);
    }

    let channels = db
        .youtube_channels(&query.ids)
        .await
        .map_err(Into::<WarpError>::into)?;

    let channels = channels.into_iter().map(Into::into).collect();

    let mut reports = vec![];

    for metric in query.metrics.split(',') {
        reports.extend(
            match metric {
                "youtube_channel_subscriber" => {
                    db.youtube_channel_subscriber(&query.ids, &query.start_at, &query.end_at)
                        .await
                }
                "youtube_channel_view" => {
                    db.youtube_channel_view(&query.ids, &query.start_at, &query.end_at)
                        .await
                }
                "bilibili_channel_subscriber" => {
                    db.bilibili_channel_subscriber(&query.ids, &query.start_at, &query.end_at)
                        .await
                }
                "bilibili_channel_view" => {
                    db.bilibili_channel_view(&query.ids, &query.start_at, &query.end_at)
                        .await
                }
                _ => continue,
            }
            .map_err(Into::<WarpError>::into)?,
        );
    }

    Ok(warp::reply::json(&ChannelsReportResponseBody {
        channels,
        reports,
    }))
}
