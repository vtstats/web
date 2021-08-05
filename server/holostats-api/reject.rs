use anyhow::Error as AnyhowError;
use holostats_database::DatabaseError;
use holostats_request::RequestError;
use std::convert::Infallible;
use std::error::Error;
use warp::http::StatusCode;
use warp::reject::Reject;
use warp::{Rejection, Reply};

#[derive(Debug)]
pub struct WarpError(pub AnyhowError);

impl Reject for WarpError {}

impl<T: Error + Send + Sync + 'static> From<T> for WarpError {
    fn from(err: T) -> Self {
        WarpError(AnyhowError::new(err))
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
    } else if let Some(WarpError(err)) = err.find::<WarpError>() {
        code = StatusCode::INTERNAL_SERVER_ERROR;
        message = "INTERNAL_SERVER_ERROR";

        if err.is::<DatabaseError>() {
            tracing::error!(
                otel.status_code = "ERROR",
                otel.status_description = "DATABASE_ERROR"
            );
        } else if err.is::<RequestError>() {
            tracing::error!(
                otel.status_code = "ERROR",
                otel.status_description = "REQUEST_ERROR"
            );
        } else {
            tracing::error!(
                otel.status_code = "ERROR",
                otel.status_description = "INTERNAL_SERVER_ERROR"
            );
        }
    } else if err.find::<warp::reject::InvalidQuery>().is_some() {
        code = StatusCode::UNPROCESSABLE_ENTITY;
        message = "INVALID_QUERY";
    } else if err.find::<warp::reject::MethodNotAllowed>().is_some() {
        code = StatusCode::METHOD_NOT_ALLOWED;
        message = "METHOD_NOT_ALLOWED";
    } else {
        code = StatusCode::INTERNAL_SERVER_ERROR;
        message = "UNHANDLED_REJECTION";
        tracing::error!(
            otel.status_code = "ERROR",
            otel.status_description = "UNHANDLED_REJECTION"
        );
    }

    let json = warp::reply::json(&ErrorMessage {
        code: code.as_u16(),
        message: message.into(),
    });

    Ok(warp::reply::with_status(json, code))
}
