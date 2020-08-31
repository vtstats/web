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

    let cors = warp::cors().allow_any_origin();

    let routes = filters::api(pool, client)
        .with(cors)
        .recover(reject::handle_rejection);

    println!("Server listening at 127.0.0.1:4300");

    warp::serve(routes).run(([127, 0, 0, 1], 4300)).await;

    Ok(())
}
