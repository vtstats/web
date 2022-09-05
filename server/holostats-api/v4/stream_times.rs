use std::convert::Into;
use tracing::Span;
use warp::Rejection;

use holostats_database::{stream::StreamTimesQuery, Database};

use crate::reject::WarpError;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReqQuery {
    id: String,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResBody {
    pub times: Vec<(i64, i64)>,
}

pub async fn stream_times(query: ReqQuery, db: Database) -> Result<impl warp::Reply, Rejection> {
    Span::current().record("name", &"GET /api/v4/stream_times");

    tracing::info!("id={}", query.id);

    let times = StreamTimesQuery {
        vtuber_id: &query.id,
        ..Default::default()
    }
    .execute(&db.pool)
    .await
    .map_err(Into::<WarpError>::into)?;

    Ok(warp::reply::json(&ResBody { times }))
}
