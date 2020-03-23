mod channels_list;
mod utils;

use reqwest::Client;
use sqlx::PgPool;
use warp::test::request;
use warp::Filter;

use crate::filters::api;
use crate::reject::handle_rejection;

use utils::is_not_found;

#[tokio::test]
async fn not_found() {
    let pool = PgPool::new(env!("DATABASE_URL")).await.unwrap();

    let client = Client::new();

    let api = api(pool, client).recover(handle_rejection);

    let res = request()
        .method("GET")
        .path("/api/v3/not_found")
        .reply(&api)
        .await;

    is_not_found(res);
}
