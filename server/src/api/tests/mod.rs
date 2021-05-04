mod channels_list;
mod streams_report;
mod utils;
mod xml;

use sqlx::PgPool;
use std::env::var;
use warp::test::request;
use warp::Filter;

use crate::reject::handle_rejection;
use crate::v3::api;

use utils::is_not_found;

#[tokio::test]
async fn not_found() {
    dotenv::dotenv().expect("Failed to load .env file");

    let uri = var("DATABASE_URL").unwrap();

    let pool = PgPool::connect(&uri).await.unwrap();

    let api = api(pool).recover(handle_rejection);

    let res = request()
        .method("GET")
        .path("/v3/not_found")
        .reply(&api)
        .await;

    is_not_found(res);
}
