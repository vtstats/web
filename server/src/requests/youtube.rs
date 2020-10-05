use chrono::{Timelike, Utc};

pub fn youtube_api_key() -> &'static str {
    if Utc::now().hour() % 2 == 0 {
        env!("YOUTUBE_API_KEY0")
    } else {
        env!("YOUTUBE_API_KEY1")
    }
}
