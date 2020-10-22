use bytes::Bytes;
use pretty_assertions::assert_eq;
use serde::Serialize;
use serde_json::to_string;
use warp::http::{header::CONTENT_TYPE, Response, StatusCode};

use crate::reject::ErrorMessage;

pub fn is_not_found(res: Response<Bytes>) {
    is_json(
        res,
        StatusCode::NOT_FOUND,
        &ErrorMessage {
            code: StatusCode::NOT_FOUND.as_u16(),
            message: "NOT_FOUND".into(),
        },
    );
}

pub fn is_invalid_query(res: Response<Bytes>) {
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
