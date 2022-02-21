use chrono::{serde::ts_milliseconds_option, DateTime, Utc};
use holostats_database::{streams::OrderBy as OrderBy_, streams::Stream, Database};
use serde_with::{rust::StringWithSeparator, CommaSeparator};
use std::convert::Into;
use std::default::Default;
use tracing::Span;
use warp::Rejection;

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

impl Into<OrderBy_> for OrderBy {
    fn into(self) -> OrderBy_ {
        match self {
            OrderBy::StartTimeAsc => OrderBy_::StartTimeAsc,
            OrderBy::EndTimeAsc => OrderBy_::EndTimeAsc,
            OrderBy::ScheduleTimeAsc => OrderBy_::ScheduleTimeAsc,
            OrderBy::StartTimeDesc => OrderBy_::StartTimeDesc,
            OrderBy::EndTimeDesc => OrderBy_::EndTimeDesc,
            OrderBy::ScheduleTimeDesc => OrderBy_::ScheduleTimeDesc,
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

    tracing::info!(
        "ids={:?} status={:?} order_by={:?} start_at={:?} end_at={:?}",
        query.ids,
        query.status,
        query.order_by,
        query.start_at,
        query.end_at
    );

    let updated_at = db
        .youtube_stream_last_updated()
        .await
        .map_err(Into::<WarpError>::into)?;

    let streams = db
        .youtube_streams(
            &query.ids,
            &query.status,
            query.order_by.into(),
            &query.start_at,
            &query.end_at,
        )
        .await
        .map_err(Into::<WarpError>::into)?;

    Ok(warp::reply::json(&ResBody {
        updated_at,
        streams,
    }))
}
