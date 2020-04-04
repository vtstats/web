use std::convert::Infallible;
use warp::http::StatusCode;
use warp::Rejection;
use warp::Reply;

use crate::error::Error;

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
        match err {
            Error::Http(err) => {
                eprintln!("Http Error: {:?}", err);
                code = StatusCode::INTERNAL_SERVER_ERROR;
                message = "HTTP_ERROR";
            }
            Error::Json(err) => {
                eprintln!("Json Error: {:?}", err);
                code = StatusCode::INTERNAL_SERVER_ERROR;
                message = "JSON_ERROR";
            }
            Error::Database(err) => {
                eprintln!("Database Error: {:?}", err);
                code = StatusCode::INTERNAL_SERVER_ERROR;
                message = "DATABASE_ERROR";
            }
            Error::Url(err) => {
                eprintln!("Url Error: {:?}", err);
                code = StatusCode::INTERNAL_SERVER_ERROR;
                message = "URL_ERROR";
            }
            Error::Utf8(err) => {
                eprintln!("Utf8 Error: {:?}", err);
                code = StatusCode::INTERNAL_SERVER_ERROR;
                message = "UTF8_ERROR";
            }
        }
    } else if err.find::<warp::reject::InvalidQuery>().is_some() {
        code = StatusCode::UNPROCESSABLE_ENTITY;
        message = "INVALID_QUERY";
    } else if err.find::<warp::reject::MethodNotAllowed>().is_some() {
        code = StatusCode::METHOD_NOT_ALLOWED;
        message = "METHOD_NOT_ALLOWED";
    } else {
        eprintln!("unhandled rejection: {:?}", err);
        code = StatusCode::INTERNAL_SERVER_ERROR;
        message = "UNHANDLED_REJECTION";
    }

    let json = warp::reply::json(&ErrorMessage {
        code: code.as_u16(),
        message: message.into(),
    });

    Ok(warp::reply::with_status(json, code))
}
