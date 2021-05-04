use sqlx::PgPool;
use std::env::var;
use warp::Filter;

pub mod publish;
pub mod verify;

use publish::publish_content;
use verify::verify_intent;

use crate::filters::{string_body, with_db};
use crate::requests::RequestHub;

pub fn pubsub(
    pool: PgPool,
    hub: RequestHub,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path::path("pubsub")
        .and(warp::path::path(var("PUBSUB_PATH").unwrap()))
        .and(warp::path::end())
        .and(pubsub_verify().or(pubsub_publish(pool, hub)))
}

pub fn pubsub_verify() -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::get().and(warp::query()).map(verify_intent)
}

pub fn pubsub_publish(
    pool: PgPool,
    hub: RequestHub,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::post()
        .and(string_body())
        .and(with_db(pool))
        .and(warp::any().map(move || hub.clone()))
        .and_then(publish_content)
}
