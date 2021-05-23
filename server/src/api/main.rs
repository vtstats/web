#[path = "../config.rs"]
mod config;
#[path = "../database/mod.rs"]
mod database;
#[path = "../error.rs"]
mod error;
mod filters;
mod pubsub;
mod reject;
#[path = "../requests/mod.rs"]
mod requests;
mod sitemap;
#[path = "../utils.rs"]
mod utils;
mod v3;
mod v4;

#[cfg(test)]
mod tests;

use std::net::SocketAddr;
use tracing::field::Empty;
use warp::Filter;

use crate::config::CONFIG;
use crate::database::Database;
use crate::error::Result;
use crate::requests::RequestHub;

#[tokio::main]
async fn main() -> Result<()> {
    utils::init_logger();

    utils::init_tracing("api", true);

    let hub = RequestHub::new();

    let db = Database::new().await?;

    let cors = warp::cors().allow_any_origin();

    let routes = warp::path("api")
        .and(
            v4::api(db.clone())
                .or(v3::api(db.clone()))
                .or(sitemap::sitemap(db.clone()))
                .or(pubsub::pubsub(db, hub)),
        )
        .with(cors)
        .recover(reject::handle_rejection)
        .with(warp::trace(|info| {
            let span =
                tracing::info_span!("request", service.name = "holostats-api", referer = Empty);

            if let Some(referer) = info.referer() {
                span.record("referer", &referer);
            }

            span
        }));

    let addr: SocketAddr = CONFIG.server.address.parse().unwrap();

    println!("API server running at {}", addr);

    warp::serve(routes).run(addr).await;

    Ok(())
}
