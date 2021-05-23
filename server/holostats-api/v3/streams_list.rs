use chrono::{DateTime, Utc};
use holostats_database::{streams::OrderBy, streams::Stream as Stream_, Database};
use serde_with::{rust::StringWithSeparator, skip_serializing_none, CommaSeparator};
use std::convert::Into;
use warp::{reply::Json, Rejection};

use crate::reject::WarpError;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsListRequestQuery {
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    pub ids: Vec<String>,
    pub start_at: Option<DateTime<Utc>>,
    pub end_at: Option<DateTime<Utc>>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsListResponseBody {
    pub updated_at: Option<DateTime<Utc>>,
    pub streams: Vec<Stream>,
}

#[skip_serializing_none]
#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Stream {
    stream_id: String,
    title: String,
    vtuber_id: String,
    thumbnail_url: Option<String>,
    schedule_time: Option<DateTime<Utc>>,
    start_time: Option<DateTime<Utc>>,
    end_time: Option<DateTime<Utc>>,
    average_viewer_count: Option<i32>,
    max_viewer_count: Option<i32>,
    updated_at: DateTime<Utc>,
}

impl From<Stream_> for Stream {
    fn from(st: Stream_) -> Self {
        Stream {
            stream_id: st.stream_id,
            title: st.title,
            vtuber_id: st.vtuber_id,
            thumbnail_url: st.thumbnail_url,
            schedule_time: st.schedule_time,
            start_time: st.start_time,
            end_time: st.end_time,
            average_viewer_count: st.average_viewer_count,
            max_viewer_count: st.max_viewer_count,
            updated_at: st.updated_at,
        }
    }
}

pub async fn youtube_streams_list(
    query: StreamsListRequestQuery,
    db: Database,
) -> Result<Json, Rejection> {
    tracing::info!(
        name = "GET /api/v3/youtube_streams",
        ids = ?query.ids.as_slice(),
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
        .map_err(Into::<WarpError>::into)?;

    let streams = db
        .youtube_streams(
            &query.ids,
            &["live".into(), "ended".into()],
            OrderBy::StartTimeDesc,
            &query.start_at,
            &query.end_at,
        )
        .await
        .map_err(Into::<WarpError>::into)?;

    let streams = streams.into_iter().map(Into::into).collect();

    Ok(warp::reply::json(&StreamsListResponseBody {
        updated_at,
        streams,
    }))
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScheduleStreamsListRequestQuery {
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    pub ids: Vec<String>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScheduleStreamsListResponseBody {
    pub updated_at: Option<DateTime<Utc>>,
    pub streams: Vec<ScheduleStream>,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScheduleStream {
    pub stream_id: String,
    pub title: String,
    pub vtuber_id: String,
    pub schedule_time: Option<DateTime<Utc>>,
    pub updated_at: DateTime<Utc>,
    pub thumbnail_url: Option<String>,
}

impl From<Stream_> for ScheduleStream {
    fn from(st: Stream_) -> Self {
        ScheduleStream {
            stream_id: st.stream_id,
            title: st.title,
            vtuber_id: st.vtuber_id,
            thumbnail_url: st.thumbnail_url,
            schedule_time: st.schedule_time,
            updated_at: st.updated_at,
        }
    }
}

pub async fn youtube_schedule_streams_list(
    query: ScheduleStreamsListRequestQuery,
    db: Database,
) -> Result<Json, Rejection> {
    tracing::info!(
        name = "GET /api/v3/youtube_schedule_streams",
        ids = ?query.ids.as_slice(),
    );

    let updated_at = db
        .youtube_stream_last_updated()
        .await
        .map_err(Into::<WarpError>::into)?;

    let streams = db
        .youtube_streams(
            &query.ids,
            &["scheduled".into()],
            OrderBy::ScheduleTimeAsc,
            &None,
            &None,
        )
        .await
        .map_err(Into::<WarpError>::into)?;

    let streams = streams.into_iter().map(Into::into).collect();

    Ok(warp::reply::json(&ScheduleStreamsListResponseBody {
        streams,
        updated_at,
    }))
}
