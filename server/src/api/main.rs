#[path = "../error.rs"]
mod error;
mod filters;
mod pubsub;
mod reject;
#[path = "../requests/mod.rs"]
mod requests;
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
use tracing_subscriber::fmt::format::FmtSpan;
use warp::Filter;

use crate::error::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let filter = env::var("RUST_LOG").unwrap_or_else(|_| "api=debug,warp=debug".into());

    let log_directory = env::var("LOG_DIR").unwrap();

    let database_url = env::var("DATABASE_URL").unwrap();

    let file_appender = tracing_appender::rolling::daily(log_directory, "log");

    let (non_blocking, _guard) = tracing_appender::non_blocking(file_appender);

    tracing_subscriber::fmt()
        .with_env_filter(filter)
        .with_writer(non_blocking)
        .with_span_events(FmtSpan::CLOSE)
        .init();

    let pool = PgPool::new(&database_url).await?;

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

    let addr: SocketAddr = option_env!("ADDR")
        .and_then(|addr| addr.parse().ok())
        .unwrap_or_else(|| ([127, 0, 0, 1], 4200).into());

    warp::serve(routes).run(addr).await;

    Ok(())
}
