use bytes::Bytes;
use holostats_database::Database;
use pretty_assertions::assert_eq;
use serde::Serialize;
use serde_json::to_string;
use warp::http::{header::CONTENT_TYPE, Response, StatusCode};
use warp::test::request;
use warp::Filter;

use crate::reject::{handle_rejection, ErrorMessage};
use crate::v3::api;

// helpers
fn is_not_found(res: Response<Bytes>) {
    is_json(
        res,
        StatusCode::NOT_FOUND,
        &ErrorMessage {
            code: StatusCode::NOT_FOUND.as_u16(),
            message: "NOT_FOUND".into(),
        },
    );
}

fn is_invalid_query(res: Response<Bytes>) {
    is_json(
        res,
        StatusCode::UNPROCESSABLE_ENTITY,
        &ErrorMessage {
            code: StatusCode::UNPROCESSABLE_ENTITY.as_u16(),
            message: "INVALID_QUERY".into(),
        },
    );
}

fn is_json<T: Serialize>(res: Response<Bytes>, status: StatusCode, body: &T) {
    assert_eq!(res.status(), status);
    assert_eq!(res.headers()[CONTENT_TYPE], "application/json");
    assert_eq!(
        String::from_utf8_lossy(res.body()),
        to_string(&body).unwrap()
    );
}

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

#[tokio::test]
async fn invalid_query() {
    let db = Database::new().await.unwrap();

    let api = api(db).recover(handle_rejection);

    is_invalid_query(
        request()
            .method("GET")
            .path("/v3/youtube_channels")
            .reply(&api)
            .await,
    );

    is_invalid_query(
        request()
            .method("GET")
            .path("/v3/youtube_channels?foo=bar")
            .reply(&api)
            .await,
    );

    is_invalid_query(
        request()
            .method("GET")
            .path("/v3/streams_report")
            .reply(&api)
            .await,
    );

    is_invalid_query(
        request()
            .method("GET")
            .path("/v3/streams_report?foo=bar")
            .reply(&api)
            .await,
    );

    is_invalid_query(
        request()
            .method("GET")
            .path("/v3/streams_report?ids=yuudachi")
            .reply(&api)
            .await,
    );

    is_invalid_query(
        request()
            .method("GET")
            .path("/v3/streams_report?metrics=yuudachi")
            .reply(&api)
            .await,
    );
}
