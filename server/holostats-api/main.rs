pub mod filters;
pub mod pubsub;
pub mod reject;
pub mod sitemap;
pub mod v4;

use anyhow::Result;
use holostats_config::CONFIG;
use holostats_database::Database;
use holostats_request::RequestHub;
use std::net::SocketAddr;
use tracing::field::Empty;
use warp::Filter;

#[tokio::main]
async fn main() -> Result<()> {
    holostats_tracing::init("api", true);

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
                name = Empty,
                span.kind = "server",
                service.name = "holostats-api",
                req.path = info.path(),
                req.method = info.method().as_str(),
                req.referer = Empty,
                otel.status_code = Empty,
                otel.status_description = Empty,
            );

            if let Some(referer) = info.referer() {
                span.record("req.referer", &referer);
            }

            span
        }));

    let addr: SocketAddr = CONFIG.server.address.parse().unwrap();

    println!("API server running at {}", addr);

    warp::serve(routes).run(addr).await;

    Ok(())
}
