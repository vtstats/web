use sqlx::PgPool;
use warp::{reply::Json, Rejection};

use crate::consts::VTUBER_IDS;
use crate::error::Error;

#[derive(serde::Deserialize)]
pub struct ChannelsListRequestQuery {
    ids: String,
}

#[derive(serde::Serialize)]
pub struct ChannelsListResponseBody {
    channels: Vec<Channel>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Channel {
    vtuber_id: String,
    subscriber_count: i32,
    daily_subscriber_count: i32,
    weekly_subscriber_count: i32,
    monthly_subscriber_count: i32,
    view_count: i32,
    daily_view_count: i32,
    weekly_view_count: i32,
    monthly_view_count: i32,
}

pub async fn youtube_channels_list(
    query: ChannelsListRequestQuery,
    mut pool: PgPool,
) -> Result<Json, Rejection> {
    let ids = query.ids.split(',').collect::<Vec<_>>();

    if ids.iter().any(|id| !VTUBER_IDS.contains(id)) {
        // TODO: return invalid request string
    }

    let channels = sqlx::query_as!(
        Channel,
        r#"
SELECT
    vtuber_id,
    subscriber_count,
    daily_subscriber_count,
    weekly_subscriber_count,
    monthly_subscriber_count,
    view_count,
    daily_view_count,
    weekly_view_count,
    monthly_view_count
FROM youtube_channels
        "#
    )
    .fetch_all(&mut pool)
    .await
    .map_err(Error::Sql)
    .map_err(warp::reject::custom)?;

    let channels = channels
        .into_iter()
        .filter(|row| ids.contains(&&*row.vtuber_id))
        .collect::<Vec<_>>();

    Ok(warp::reply::json(&ChannelsListResponseBody { channels }))
}

pub async fn bilibili_channels_list(
    query: ChannelsListRequestQuery,
    mut pool: PgPool,
) -> Result<Json, Rejection> {
    let ids = query.ids.split(',').collect::<Vec<_>>();

    let channels = sqlx::query_as!(
        Channel,
        r#"
SELECT
    vtuber_id,
    subscriber_count,
    daily_subscriber_count,
    weekly_subscriber_count,
    monthly_subscriber_count,
    view_count,
    daily_view_count,
    weekly_view_count,
    monthly_view_count
FROM bilibili_channels
        "#,
    )
    .fetch_all(&mut pool)
    .await
    .map_err(Error::Sql)
    .map_err(warp::reject::custom)?;

    let channels = channels
        .into_iter()
        .filter(|row| ids.contains(&&*row.vtuber_id))
        .collect::<Vec<_>>();

    Ok(warp::reply::json(&ChannelsListResponseBody { channels }))
}
