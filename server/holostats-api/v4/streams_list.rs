use chrono::{serde::ts_milliseconds_option, DateTime, Utc};
use holostats_database::Database;
use serde_with::{rust::StringWithSeparator, CommaSeparator};
use std::convert::Into;
use std::default::Default;
use tracing::Span;
use warp::Rejection;

use holostats_database::stream::{
    Column, ListYouTubeStreamsQuery, Ordering, Stream, YouTubeStreamsLastUpdated,
};

use crate::reject::WarpError;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReqQuery {
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    pub ids: Vec<String>,
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    pub status: Vec<String>,
    #[serde(default)]
    pub order_by: OrderBy,
    #[serde(default, with = "ts_milliseconds_option")]
    pub start_at: Option<DateTime<Utc>>,
    #[serde(default, with = "ts_milliseconds_option")]
    pub end_at: Option<DateTime<Utc>>,
}

#[derive(serde::Deserialize, Debug)]
pub enum OrderBy {
    #[serde(rename = "start_time:asc")]
    StartTimeAsc,
    #[serde(rename = "end_time:asc")]
    EndTimeAsc,
    #[serde(rename = "schedule_time:asc")]
    ScheduleTimeAsc,
    #[serde(rename = "start_time:desc")]
    StartTimeDesc,
    #[serde(rename = "end_time:desc")]
    EndTimeDesc,
    #[serde(rename = "schedule_time:desc")]
    ScheduleTimeDesc,
}

impl OrderBy {
    fn column(&self) -> Column {
        match self {
            OrderBy::ScheduleTimeAsc | OrderBy::ScheduleTimeDesc => Column::ScheduleTime,
            OrderBy::StartTimeAsc | OrderBy::StartTimeDesc => Column::StartTime,
            OrderBy::EndTimeAsc | OrderBy::EndTimeDesc => Column::EndTime,
        }
    }

    fn ordering(&self) -> Ordering {
        match self {
            OrderBy::StartTimeAsc | OrderBy::EndTimeAsc | OrderBy::ScheduleTimeAsc => Ordering::Asc,
            OrderBy::StartTimeDesc | OrderBy::EndTimeDesc | OrderBy::ScheduleTimeDesc => {
                Ordering::Desc
            }
        }
    }
}

impl Default for OrderBy {
    fn default() -> Self {
        OrderBy::StartTimeDesc
    }
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResBody {
    #[serde(with = "ts_milliseconds_option")]
    pub updated_at: Option<DateTime<Utc>>,
    pub streams: Vec<Stream>,
}

pub async fn youtube_streams_list(
    query: ReqQuery,
    db: Database,
) -> Result<impl warp::Reply, Rejection> {
    Span::current().record("name", &"GET /api/v4/youtube_streams");

    let ReqQuery {
        ids,
        status,
        order_by,
        start_at,
        end_at,
    } = query;

    tracing::info!(
        "ids={:?} status={:?} order_by={:?} start_at={:?} end_at={:?}",
        ids,
        status,
        order_by,
        start_at,
        end_at
    );

    let updated_at = YouTubeStreamsLastUpdated {}
        .execute(&db.pool)
        .await
        .map_err(Into::<WarpError>::into)?;

    let streams = ListYouTubeStreamsQuery {
        vtuber_ids: &ids,
        status: &status,
        start_at: start_at.as_ref().map(|date| (order_by.column(), date)),
        end_at: end_at.as_ref().map(|date| (order_by.column(), date)),
        order_by: Some((order_by.column(), order_by.ordering())),
        limit: Some(24),
        ..Default::default()
    }
    .execute(&db.pool)
    .await
    .map_err(Into::<WarpError>::into)?;

    Ok(warp::reply::json(&ResBody {
        updated_at,
        streams,
    }))
}
