use chrono::{DateTime, NaiveDate, Utc};
use warp::{Filter, Rejection};

use crate::error::Error;

pub fn epoch_date_time() -> DateTime<Utc> {
    DateTime::from_utc(NaiveDate::from_ymd(1970, 1, 1).and_hms(0, 0, 0), Utc)
}

pub fn body_string() -> impl Filter<Extract = (String,), Error = Rejection> + Copy {
    warp::body::bytes().and_then(|body: bytes::Bytes| async move {
        std::str::from_utf8(&body)
            .map(String::from)
            .map_err(Error::Utf8)
            .map_err(warp::reject::custom)
    })
}
