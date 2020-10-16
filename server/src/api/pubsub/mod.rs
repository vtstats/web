use reqwest::Client;
use sqlx::PgPool;
use warp::Filter;

mod publish;
mod verify;

use publish::publish_content;
use verify::verify_intent;

use crate::filters::{string_body, with_db};

pub fn pubsub(
    pool: PgPool,
    client: Client,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("pubsub").and(pubsub_verify().or(pubsub_publish(pool, client)))
}

pub fn pubsub_verify() -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::get().and(warp::query()).map(verify_intent)
}

pub fn pubsub_publish(
    pool: PgPool,
    client: Client,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::post()
        .and(string_body())
        .and(with_db(pool))
        .and(warp::any().map(move || client.clone()))
        .and_then(publish_content)
}
