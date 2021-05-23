use holostats_config::CONFIG;
use holostats_database::Database;
use std::convert::Into;
use std::fmt::Write;
use warp::{Filter, Rejection};

use crate::filters::with_db;
use crate::reject::WarpError;

const PAGES: &[&str] = &[
    "/youtube-channel",
    "/bilibili-channel",
    "/youtube-stream",
    "/youtube-schedule-stream",
    "/settings",
];

// Returns a sitemap for crawler
async fn sitemap_get(db: Database) -> Result<impl warp::Reply, Rejection> {
    tracing::info!(name = "GET /api/sitemap");

    let ids = db.stream_ids().await.map_err(Into::<WarpError>::into)?;

    let url_len = "https://".len() + CONFIG.server.hostname.len() + "/stream/xxxxxxxxxxx".len();

    let mut res = String::with_capacity(url_len * ids.len());

    for id in ids {
        let _ = writeln!(res, "https://{}/stream/{}", CONFIG.server.hostname, id);
    }

    for page in PAGES {
        let _ = writeln!(res, "https://{}{}", CONFIG.server.hostname, page);
    }

    for vtb in &CONFIG.vtubers {
        let _ = writeln!(res, "https://{}/vtuber/{}", CONFIG.server.hostname, vtb.id);
    }

    Ok(res)
}

pub fn sitemap(
    db: Database,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("sitemap")
        .and(warp::get())
        .and(with_db(db))
        .and_then(sitemap_get)
}
