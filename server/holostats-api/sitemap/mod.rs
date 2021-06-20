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

#[derive(serde::Deserialize)]
pub struct Query {
    #[serde(rename = "baseUrl")]
    base_url: String,
}

// Returns a sitemap for crawler like google search
async fn sitemap_get(query: Query, db: Database) -> Result<impl warp::Reply, Rejection> {
    tracing::info!(name = "GET /api/sitemap");

    let ids = db.stream_ids().await.map_err(Into::<WarpError>::into)?;

    let url_len = "https://".len() + query.base_url.len() + "/stream/xxxxxxxxxxx".len();

    let mut res = String::with_capacity(url_len * ids.len());

    for id in ids {
        let _ = writeln!(res, "https://{}/stream/{}", query.base_url, id);
    }

    for page in PAGES {
        let _ = writeln!(res, "https://{}{}", query.base_url, page);
    }

    for vtb in &CONFIG.vtubers {
        let _ = writeln!(res, "https://{}/vtuber/{}", query.base_url, vtb.id);
    }

    Ok(res)
}

pub fn sitemap(
    db: Database,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("sitemap")
        .and(warp::get())
        .and(warp::query())
        .and(with_db(db))
        .and_then(sitemap_get)
}
