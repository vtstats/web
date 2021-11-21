use holostats_database::Database;
use std::convert::Into;
use warp::Rejection;

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
    tracing::info!(name = "GET /api/v4/stream_times", id = query.id.as_str());

    let times = db
        .stream_times(&query.id)
        .await
        .map_err(Into::<WarpError>::into)?;

    Ok(warp::reply::json(&ResBody { times }))
}
