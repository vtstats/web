use reqwest::Client;
use sqlx::PgPool;
use warp::Filter;

mod channels_list;
mod channels_report;
mod streams_list;
mod streams_report;
mod youtube_notifications;

use channels_list::{bilibili_channels_list, youtube_channels_list};
use channels_report::channels_report;
use streams_list::youtube_streams_list;
use streams_report::streams_report;
use youtube_notifications::{publish_content, verify_intent};

use crate::filters::{string_body, with_db};

pub fn api(
    pool: PgPool,
    client: Client,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    api_youtube_channels(pool.clone())
        .or(api_bilibili_channels(pool.clone()))
        .or(api_youtube_streams(pool.clone()))
        .or(api_streams_report(pool.clone()))
        .or(api_channels_report(pool.clone()))
        .or(api_verify_intent())
        .or(api_publish_content(pool, client))
}

pub fn api_youtube_channels(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "v4" / "youtube_channels")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(youtube_channels_list)
}

pub fn api_bilibili_channels(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "v4" / "bilibili_channels")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(bilibili_channels_list)
}

pub fn api_youtube_streams(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "v4" / "youtube_streams")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(youtube_streams_list)
}

pub fn api_streams_report(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "v4" / "streams_report")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(streams_report)
}

pub fn api_channels_report(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "v4" / "channels_report")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(channels_report)
}

pub fn api_verify_intent(
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "v4" / ..)
        .and(warp::path(env!("PUBSUBHUBBUB_URL")))
        .and(warp::path::end())
        .and(warp::get())
        .and(warp::query())
        .map(verify_intent)
}

pub fn api_publish_content(
    pool: PgPool,
    client: Client,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "v4" / ..)
        .and(warp::path(env!("PUBSUBHUBBUB_URL")))
        .and(warp::path::end())
        .and(warp::post())
        .and(string_body())
        .and(with_db(pool))
        .and(warp::any().map(move || client.clone()))
        .and_then(publish_content)
}
