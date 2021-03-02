use std::fmt::Write;

use sqlx::PgPool;
use warp::{Filter, Rejection};

use crate::error::Error;
use crate::filters::with_db;
use crate::vtubers::VTUBERS;

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

    let streams = sqlx::query!(r#"select stream_id from youtube_streams"#,)
        .fetch_all(&pool)
        .await
        .map_err(Error::Database)?;

    let mut res =
        String::with_capacity("https://taiwanv-dev.linnil1.me/stream/xxxxxxxxxxx".len() * streams.len());

    // TODO: error handling
    for page in PAGES {
        let _ = res.write_str("https://taiwanv-dev.linnil1.me");
        let _ = res.write_str(page);
        let _ = res.write_str("\n");
    }

    for vtb in VTUBERS {
        let _ = res.write_str("https://taiwanv-dev.linnil1.me/vtuber/");
        let _ = res.write_str(vtb.id);
        let _ = res.write_str("\n");
    }

    for stream in streams {
        let _ = res.write_str("https://taiwanv-dev.linnil1.me/stream/");
        let _ = res.write_str(&stream.stream_id);
        let _ = res.write_str("\n");
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
