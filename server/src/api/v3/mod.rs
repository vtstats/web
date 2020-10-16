use sqlx::PgPool;
use warp::Filter;

pub mod channels_list;
pub mod channels_report;
pub mod streams_list;
pub mod streams_report;

use channels_list::{bilibili_channels_list, youtube_channels_list};
use channels_report::channels_report;
use streams_list::{youtube_schedule_streams_list, youtube_streams_list};
use streams_report::streams_report;

use crate::filters::with_db;

pub fn api(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path("v3").and(
        api_youtube_channels(pool.clone())
            .or(api_bilibili_channels(pool.clone()))
            .or(api_youtube_streams(pool.clone()))
            .or(api_youtube_schedule_streams(pool.clone()))
            .or(api_streams_report(pool.clone()))
            .or(api_channels_report(pool)),
    )
}

pub fn api_youtube_channels(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("youtube_channels")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(youtube_channels_list)
}

pub fn api_bilibili_channels(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("bilibili_channels")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(bilibili_channels_list)
}

pub fn api_youtube_streams(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("youtube_streams")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(youtube_streams_list)
}

pub fn api_youtube_schedule_streams(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("youtube_schedule_streams")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(youtube_schedule_streams_list)
}

pub fn api_streams_report(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("streams_report")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(streams_report)
}

pub fn api_channels_report(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("channels_report")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(pool))
        .and_then(channels_report)
}
