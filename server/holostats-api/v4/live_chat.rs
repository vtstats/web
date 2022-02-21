use holostats_database::{
    live_chat::{MemberMessage, PaidMessage},
    Database,
};
use std::convert::Into;
use tracing::Span;
use warp::Rejection;

use crate::reject::WarpError;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReqQuery {
    pub id: String,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResBody {
    pub paid: Vec<PaidMessage>,
    pub member: Vec<MemberMessage>,
}

pub async fn live_chat_highlight(
    query: ReqQuery,
    db: Database,
) -> Result<impl warp::Reply, Rejection> {
    Span::current().record("name", &"GET /api/v4/live_chat/highlight");

    tracing::info!("id={}", query.id);

    let paid = db
        .select_paid_messages(&query.id)
        .await
        .map_err(Into::<WarpError>::into)?;

    let member = db
        .select_member_messages(&query.id)
        .await
        .map_err(Into::<WarpError>::into)?;

    Ok(warp::reply::json(&ResBody { paid, member }))
}
