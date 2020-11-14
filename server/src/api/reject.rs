use std::convert::Infallible;
use warp::http::StatusCode;
use warp::reject::Reject;
use warp::{Rejection, Reply};

use crate::error::Error;

impl Reject for Error {}

impl From<Error> for Rejection {
    fn from(err: Error) -> Rejection {
        warp::reject::custom(err)
    }
}

#[derive(serde::Serialize)]
pub struct ErrorMessage {
    pub code: u16,
    pub message: String,
}

pub async fn handle_rejection(err: Rejection) -> Result<impl Reply, Infallible> {
    let code;
    let message;

    if err.is_not_found() {
        code = StatusCode::NOT_FOUND;
        message = "NOT_FOUND";
    } else if let Some(err) = err.find::<Error>() {
        code = StatusCode::INTERNAL_SERVER_ERROR;
        message = match err {
            Error::Http(_, _) => "HTTP_ERROR",
            Error::Json(_) => "JSON_ERROR",
            Error::Database(_) => "DATABASE_ERROR",
            Error::Url(_) => "URL_ERROR",
            Error::Utf8(_) => "UTF8_ERROR",
        };
    } else if err.find::<warp::reject::InvalidQuery>().is_some() {
        code = StatusCode::UNPROCESSABLE_ENTITY;
        message = "INVALID_QUERY";
    } else if err.find::<warp::reject::MethodNotAllowed>().is_some() {
        code = StatusCode::METHOD_NOT_ALLOWED;
        message = "METHOD_NOT_ALLOWED";
    } else {
        code = StatusCode::INTERNAL_SERVER_ERROR;
        message = "UNHANDLED_REJECTION";
    }

    let json = warp::reply::json(&ErrorMessage {
        code: code.as_u16(),
        message: message.into(),
    });

    Ok(warp::reply::with_status(json, code))
}
