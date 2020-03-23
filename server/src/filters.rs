use std::convert::Infallible;

use reqwest::Client;
use sqlx::PgPool;
use warp::Filter;

use crate::api_v3;
use crate::error::Error;

pub fn api(
    pool: PgPool,
    client: Client,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    youtube_channels(pool.clone())
        .or(bilibili_channels(pool.clone()))
        .or(youtube_streams(pool.clone()))
        .or(youtube_schedule_streams(pool.clone()))
        .or(streams_report(pool.clone()))
        .or(channels_report(pool.clone()))
        .or(verify_intent())
        .or(publish_content(pool, client))
}

pub fn youtube_channels(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "v3" / "youtube_channels")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(api_v3::youtube_channels_list)
}

pub fn bilibili_channels(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "v3" / "bilibili_channels")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(api_v3::bilibili_channels_list)
}

pub fn youtube_streams(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "v3" / "youtube_streams")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(api_v3::youtube_streams_list)
}

pub fn youtube_schedule_streams(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "v3" / "youtube_schedule_streams")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(api_v3::youtube_schedule_streams_list)
}

pub fn streams_report(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "v3" / "streams_report")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(api_v3::streams_report)
}

pub fn channels_report(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "v3" / "channels_report")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(api_v3::channels_report)
}

pub fn verify_intent() -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "v3" / ..)
        .and(warp::path(env!("PUBSUBHUBBUB_URL")))
        .and(warp::path::end())
        .and(warp::get())
        .and(warp::query())
        .map(api_v3::verify_intent)
}

pub fn publish_content(
    pool: PgPool,
    client: Client,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "v3" / ..)
        .and(warp::path(env!("PUBSUBHUBBUB_URL")))
        .and(warp::path::end())
        .and(warp::post())
        .and(string_body())
        .and(with_db(pool))
        .and(warp::any().map(move || client.clone()))
        .and_then(api_v3::publish_content)
}

fn with_db(pool: PgPool) -> impl Filter<Extract = (PgPool,), Error = Infallible> + Clone {
    warp::any().map(move || pool.clone())
}

fn string_body() -> impl Filter<Extract = (String,), Error = warp::Rejection> + Copy {
    warp::body::bytes().and_then(|body: bytes::Bytes| async move {
        std::str::from_utf8(&body)
            .map(String::from)
            .map_err(Error::Utf8)
            .map_err(warp::reject::custom)
    })
}
