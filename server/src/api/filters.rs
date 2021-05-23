use std::convert::Infallible;

use warp::Filter;

use crate::database::Database;
use crate::error::Error;

pub fn with_db(db: Database) -> impl Filter<Extract = (Database,), Error = Infallible> + Clone {
    warp::any().map(move || db.clone())
}

pub fn string_body() -> impl Filter<Extract = (String,), Error = warp::Rejection> + Copy {
    warp::body::bytes().and_then(|body: bytes::Bytes| async move {
        std::str::from_utf8(&body)
            .map(String::from)
            .map_err(Error::Utf8)
            .map_err(warp::reject::custom)
    })
}
