use chrono::{DateTime, Utc};
use holostats_database::{statistic::Report, streams::Stream as Stream_, Database};
use serde_with::{rust::StringWithSeparator, skip_serializing_none, CommaSeparator};
use std::convert::Into;
use warp::{reply::Json, Rejection};

use crate::reject::WarpError;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsReportRequestQuery {
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    ids: Vec<String>,
    metrics: String,
    start_at: Option<DateTime<Utc>>,
    end_at: Option<DateTime<Utc>>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StreamsReportResponseBody {
    pub streams: Vec<Stream>,
    pub reports: Vec<Report>,
}

#[skip_serializing_none]
#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Stream {
    pub stream_id: String,
    pub title: String,
    pub vtuber_id: String,
    pub thumbnail_url: Option<String>,
    pub schedule_time: Option<DateTime<Utc>>,
    pub start_time: Option<DateTime<Utc>>,
    pub end_time: Option<DateTime<Utc>>,
    pub average_viewer_count: Option<i32>,
    pub max_viewer_count: Option<i32>,
    pub updated_at: DateTime<Utc>,
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

pub async fn streams_report(
    query: StreamsReportRequestQuery,
    db: Database,
) -> Result<Json, Rejection> {
    tracing::info!(
        name = "GET /api/v3/streams_report",
        ids = ?query.ids.as_slice(),
        metrics = &query.metrics.as_str(),
    );

    if let Some(start_at) = query.start_at {
        tracing::info!(?start_at);
    }

    if let Some(end_at) = query.end_at {
        tracing::info!(?end_at);
    }

    let streams = db
        .youtube_streams_by_ids(&query.ids)
        .await
        .map_err(Into::<WarpError>::into)?;

    let streams = streams.into_iter().map(Into::into).collect();

    let mut reports = vec![];

    for metric in query.metrics.split(',') {
        match metric {
            "youtube_stream_viewer" => reports.extend(
                db.youtube_stream_viewer(&query.ids, &query.start_at, &query.end_at)
                    .await
                    .map_err(Into::<WarpError>::into)?,
            ),
            _ => (),
        }
    }

    Ok(warp::reply::json(&StreamsReportResponseBody {
        streams,
        reports,
    }))
}
