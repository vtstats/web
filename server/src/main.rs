mod api_v3;
mod error;
mod filters;
mod reject;
mod requests;
mod utils;
mod vtubers;

#[cfg(test)]
mod tests;

use reqwest::Client;
use sqlx::PgPool;
use warp::Filter;

use crate::error::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let pg_pool = PgPool::new(env!("DATABASE_URL")).await?;

    let http_client = Client::new();

    // trun into Filter
    let pg_pool = warp::any().map(move || pg_pool.clone());

    let http_client = warp::any().map(move || http_client.clone());

    let api_v3_routes = warp::path!("api" / "v3" / ..).and(
        warp::path!("youtube_channels")
            .and(warp::get())
            .and(warp::query())
            .and(pg_pool.clone())
            .and_then(api_v3::youtube_channels_list)
            .or(warp::path!("bilibili_channels")
                .and(warp::get())
                .and(warp::query())
                .and(pg_pool.clone())
                .and_then(api_v3::bilibili_channels_list))
            .or(warp::path!("youtube_streams")
                .and(warp::get())
                .and(warp::query())
                .and(pg_pool.clone())
                .and_then(api_v3::youtube_streams_list))
            .or(warp::path!("youtube_schedule_streams")
                .and(warp::get())
                .and(warp::query())
                .and(pg_pool.clone())
                .and_then(api_v3::youtube_schedule_streams_list))
            .or(warp::path!("streams_report")
                .and(warp::get())
                .and(warp::query())
                .and(pg_pool.clone())
                .and_then(api_v3::streams_report))
            .or(warp::path!("channels_report")
                .and(warp::get())
                .and(warp::query())
                .and(pg_pool.clone())
                .and_then(api_v3::channels_report))
            .or(warp::path(env!("PUBSUBHUBBUB_URL"))
                .and(warp::path::end())
                .and(warp::get())
                .and(warp::query())
                .map(api_v3::verify_intent))
            .or(warp::path(env!("PUBSUBHUBBUB_URL"))
                .and(warp::path::end())
                .and(warp::post())
                .and(utils::body_string())
                .and(pg_pool)
                .and(http_client)
                .and_then(api_v3::publish_content)),
    );

    let routes = api_v3_routes.recover(reject::handle_rejection);

    println!("Server listening at 127.0.0.1:4300");

    warp::serve(routes).run(([127, 0, 0, 1], 4300)).await;

    Ok(())
}
