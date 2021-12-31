pub mod filters;
pub mod pubsub;
pub mod reject;
pub mod sitemap;
pub mod v4;

use anyhow::Result;
use holostats_config::CONFIG;
use holostats_database::Database;
use holostats_request::RequestHub;
use holostats_tracing::init;
use std::net::SocketAddr;
use tracing::field::Empty;
use warp::Filter;

#[tokio::main]
async fn main() -> Result<()> {
    init("api", true);

    let hub = RequestHub::new();

    let db = Database::new().await?;

    let cors = warp::cors().allow_any_origin();

    let routes = warp::path("api")
        .and(
            v4::api(db.clone())
                .or(sitemap::sitemap(db.clone()))
                .or(pubsub::pubsub(db, hub)),
        )
        .with(cors)
        .recover(reject::handle_rejection)
        .with(warp::trace(|info| {
            let span = tracing::info_span!(
                "request",
                span.kind = "server",
                service.name = "holostats-api",
                referer = Empty
            );

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
