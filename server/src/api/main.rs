#[path = "../error.rs"]
mod error;
mod filters;
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
use warp::Filter;

use crate::error::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let pool = PgPool::new(&env::var("DATABASE_URL").unwrap()).await?;

    let client = Client::new();

    let cors = warp::cors().allow_any_origin();

    let routes = v3::api(pool.clone(), client.clone())
        .or(v4::api(pool, client))
        .with(cors)
        .recover(reject::handle_rejection);

    println!("Server listening at 127.0.0.1:4300");

    warp::serve(routes).run(([127, 0, 0, 1], 4300)).await;

    Ok(())
}
