mod channels_list;
mod channels_report;
mod stream_times;
mod streams_list;
mod streams_report;

use channels_list::{bilibili_channels_list, youtube_channels_list};
use channels_report::channels_report;
use stream_times::stream_times;
use streams_list::youtube_streams_list;
use streams_report::streams_report;

use holostats_database::Database;
use warp::Filter;

use crate::filters::with_db;

pub fn api(
    db: Database,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path("v4").and(
        api_youtube_channels(db.clone())
            .or(api_bilibili_channels(db.clone()))
            .or(api_youtube_streams(db.clone()))
            .or(api_stream_times(db.clone()))
            .or(api_streams_report(db.clone()))
            .or(api_channels_report(db)),
    )
}

pub fn api_youtube_channels(
    db: Database,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("youtube_channels")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(db))
        .and_then(youtube_channels_list)
}

pub fn api_bilibili_channels(
    db: Database,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("bilibili_channels")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(db))
        .and_then(bilibili_channels_list)
}

pub fn api_youtube_streams(
    db: Database,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("youtube_streams")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(db))
        .and_then(youtube_streams_list)
}

pub fn api_streams_report(
    db: Database,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("streams_report")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(db))
        .and_then(streams_report)
}

pub fn api_channels_report(
    db: Database,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("channels_report")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(db))
        .and_then(channels_report)
}

pub fn api_stream_times(
    db: Database,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("stream_times")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(db))
        .and_then(stream_times)
}
