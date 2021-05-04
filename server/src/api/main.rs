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
#[path = "../vtubers.rs"]
mod vtubers;

#[cfg(test)]
mod tests;

use dotenv::dotenv;
use sqlx::PgPool;
use std::env;
use std::net::SocketAddr;
use tracing::field::Empty;
use warp::Filter;

use crate::error::Result;
use crate::requests::RequestHub;

#[tokio::main]
async fn main() -> Result<()> {
    dotenv().expect("Failed to load .env file");

    utils::init_logger();

    utils::init_tracing("api", true);

    let hub = RequestHub::new();

    let pool = PgPool::connect(&env::var("DATABASE_URL").unwrap()).await?;

    let cors = warp::cors().allow_any_origin();

    let routes = warp::path("api")
        .and(
            v4::api(pool.clone())
                .or(v3::api(pool.clone()))
                .or(sitemap::sitemap(pool.clone()))
                .or(pubsub::pubsub(pool, hub)),
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

    let addr: SocketAddr = env::var("ADDR")
        .ok()
        .and_then(|addr| addr.parse().ok())
        .unwrap_or_else(|| ([127, 0, 0, 1], 4200).into());

    warp::serve(routes).run(addr).await;

    Ok(())
}
