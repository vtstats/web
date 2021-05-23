use chrono::{serde::ts_milliseconds_option, DateTime, Utc};
use serde_with::{rust::StringWithSeparator, CommaSeparator};
use std::default::Default;
use warp::Rejection;

use crate::database::{streams::OrderBy as OrderBy_, streams::Stream, Database};
use crate::error::Error;

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
    tracing::info!(
        name = "GET /api/v4/youtube_streams",
        ids = ?query.ids.as_slice(),
        status = ?query.status,
        order_by = ?query.order_by,
    );

    if let Some(start_at) = query.start_at {
        tracing::info!(?start_at);
    }

    if let Some(end_at) = query.end_at {
        tracing::info!(?end_at);
    }

    let updated_at = db
        .youtube_stream_last_updated()
        .await
        .map_err(Error::Database)?;

    let streams = db
        .youtube_streams(
            &query.ids,
            &query.status,
            query.order_by.into(),
            &query.start_at,
            &query.end_at,
        )
        .await
        .map_err(Error::Database)?;

    Ok(warp::reply::json(&ResBody {
        updated_at,
        streams,
    }))
}
