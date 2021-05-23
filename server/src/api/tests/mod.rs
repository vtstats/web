mod channels_list;
mod streams_report;
mod utils;
mod xml;

use warp::test::request;
use warp::Filter;

use crate::database::Database;
use crate::reject::handle_rejection;
use crate::v3::api;

use utils::is_not_found;

#[tokio::test]
async fn not_found() {
    let db = Database::new().await.unwrap();

    let api = api(db).recover(handle_rejection);

    let res = request()
        .method("GET")
        .path("/v3/not_found")
        .reply(&api)
        .await;

    is_not_found(res);
}
