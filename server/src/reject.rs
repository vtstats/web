use std::convert::Infallible;
use warp::http::StatusCode;
use warp::Rejection;
use warp::Reply;

use crate::error::Error;

#[derive(serde::Serialize)]
struct ErrorMessage {
    code: u16,
    message: String,
}

pub async fn handle_rejection(err: Rejection) -> Result<impl Reply, Infallible> {
    let code;
    let message;

    if err.is_not_found() {
        code = StatusCode::NOT_FOUND;
        message = "NOT_FOUND";
    } else if let Some(_) = err.find::<warp::reject::MethodNotAllowed>() {
        code = StatusCode::METHOD_NOT_ALLOWED;
        message = "METHOD_NOT_ALLOWED";
    } else if err.find::<warp::reject::InvalidQuery>().is_some() {
        code = StatusCode::UNPROCESSABLE_ENTITY;
        message = "INVALID_QUERY";
    } else if let Some(err) = err.find::<Error>() {
        code = StatusCode::INTERNAL_SERVER_ERROR;
        match err {
            Error::Http(err) => {
                eprintln!("Http Error: {:?}", err);
                message = "HTTP_ERROR";
            }
            Error::Json(err) => {
                eprintln!("Json Error: {:?}", err);
                message = "JSON_ERROR";
            }
            Error::Sql(err) => {
                eprintln!("Sql Error: {:?}", err);
                message = "SQL_ERROR";
            }
            Error::Url(err) => {
                eprintln!("Url Error: {:?}", err);
                message = "URL_ERROR";
            }
            Error::Utf8(err) => {
                eprintln!("Utf8 Error: {:?}", err);
                message = "UTF8_ERROR";
            }
        }
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
