mod api_v3;
mod error;
mod filters;
mod reject;
mod requests;
mod vtubers;

#[cfg(test)]
mod tests;

use reqwest::Client;
use sqlx::PgPool;
use std::env;
use warp::Filter;

use crate::error::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let pool = PgPool::new(&env::var("DATABASE_URL").unwrap()).await?;

    let client = Client::new();

    let api_routes = filters::api(pool, client);

    let static_routes = warp::any().and(warp::fs::dir("/var/www/holostats/"));

    let routes = api_routes
        .or(static_routes)
        .recover(reject::handle_rejection);

    cfg_if::cfg_if! {
        if #[cfg(feature = "prod")] {
            println!("Server listening at 0.0.0.0:443");

            warp::serve(routes)
                .tls()
                .cert(env!("HOLO_POI_CAT_CERTIFICATE"))
                .key(env!("HOLO_POI_CAT_PRIVATE_KEY"))
                .run(([0, 0, 0, 0], 443))
                .await;
        } else {
            println!("Server listening at 127.0.0.1:4300");

            warp::serve(routes).run(([127, 0, 0, 1], 4300)).await;
        }
    }

    Ok(())
}
