use std::convert::Infallible;

use sqlx::PgPool;
use warp::Filter;

use crate::error::Error;

pub fn with_db(pool: PgPool) -> impl Filter<Extract = (PgPool,), Error = Infallible> + Clone {
    warp::any().map(move || pool.clone())
}

pub fn string_body() -> impl Filter<Extract = (String,), Error = warp::Rejection> + Copy {
    warp::body::bytes().and_then(|body: bytes::Bytes| async move {
        std::str::from_utf8(&body)
            .map(String::from)
            .map_err(Error::Utf8)
            .map_err(warp::reject::custom)
    })
}
