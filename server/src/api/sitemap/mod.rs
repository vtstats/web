use std::fmt::Write;

use sqlx::PgPool;
use warp::{Filter, Rejection};

use crate::config::CONFIG;
use crate::error::Error;
use crate::filters::with_db;

const PAGES: &[&str] = &[
    "/youtube-channel",
    "/bilibili-channel",
    "/youtube-stream",
    "/youtube-schedule-stream",
    "/settings",
];

// Returns a sitemap for crawler
async fn sitemap_get(pool: PgPool) -> Result<impl warp::Reply, Rejection> {
    tracing::info!(name = "GET /api/sitemap");

    let streams = sqlx::query!(r#"select stream_id from youtube_streams"#)
        .fetch_all(&pool)
        .await
        .map_err(Error::Database)?;

    let url_len = "https://".len() + CONFIG.server.hostname.len() + "/stream/xxxxxxxxxxx".len();

    let mut res = String::with_capacity(url_len * streams.len());

    // TODO: error handling
    for page in PAGES {
        let _ = writeln!(res, "https://{}{}", CONFIG.server.hostname, page);
    }

    for vtb in &CONFIG.vtubers {
        let _ = writeln!(res, "https://{}/vtuber/{}", CONFIG.server.hostname, vtb.id);
    }

    for stream in streams {
        let _ = writeln!(
            res,
            "https://{}/stream/{}",
            CONFIG.server.hostname, &stream.stream_id
        );
    }

    Ok(res)
}

pub fn sitemap(
    pool: PgPool,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("sitemap")
        .and(warp::get())
        .and(with_db(pool))
        .and_then(sitemap_get)
}
