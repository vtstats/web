#[path = "../error.rs"]
mod error;
mod filters;
mod pubsub;
mod reject;
#[path = "../requests/mod.rs"]
mod requests;
#[path = "../trace.rs"]
mod trace;
mod v3;
mod v4;
#[path = "../vtubers.rs"]
mod vtubers;

#[cfg(test)]
mod tests;

use reqwest::Client;
use sqlx::PgPool;
use std::env;
use std::net::SocketAddr;
use tracing::field::{display, Empty};
use tracing_appender::rolling::Rotation;
use warp::Filter;

use crate::error::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let _guard = trace::init("api=debug,warp=debug", Rotation::DAILY);

    let pool = PgPool::connect(&env::var("DATABASE_URL").unwrap()).await?;

    let client = Client::new();

    let cors = warp::cors().allow_any_origin();

    let routes = warp::path("api")
        .and(
            v4::api(pool.clone())
                .or(v3::api(pool.clone()))
                .or(pubsub::pubsub(pool, client)),
        )
        .with(cors)
        .with(warp::trace(|info| {
            let span = tracing::info_span!(
                "request",
                method = %info.method(),
                path = %info.path(),
                referer = Empty,
            );

            if let Some(referer) = info.referer() {
                span.record("referer", &display(referer));
            }

            span
        }))
        .recover(reject::handle_rejection);

    let addr: SocketAddr = env::var("ADDR")
        .ok()
        .and_then(|addr| addr.parse().ok())
        .unwrap_or_else(|| ([127, 0, 0, 1], 4200).into());

    cfg_if::cfg_if! {
        if #[cfg(feature = "tls")] {
            warp::serve(routes)
                .tls()
                .cert_path(env::var("SSL_CERT_PATH").unwrap())
                .key_path(env::var("SSL_KEY_PATH").unwrap())
                .run(addr)
                .await;
        } else {
            warp::serve(routes).run(addr).await;
        }
    }

    Ok(())
}
