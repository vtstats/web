use chrono::{Timelike, Utc};
use reqwest::Client;
use sqlx::PgPool;
use warp::{http::StatusCode, Rejection};

use crate::error::Error;
use crate::requests::youtube_streams;
use crate::vtubers::VTUBERS;

#[derive(serde::Deserialize)]
pub struct VerifyIntentRequestQuery {
    #[serde(rename = "hub.challenge")]
    challenge: String,
}

pub fn verify_intent(query: VerifyIntentRequestQuery) -> String {
    query.challenge
}

pub async fn publish_content(
    body: String,
    pool: PgPool,
    client: Client,
) -> Result<StatusCode, Rejection> {
    if let Some((vtuber_id, video_id, title)) = parse_xml(&body) {
        let streams = youtube_streams(
            &client,
            &[&video_id],
            if Utc::now().hour() % 2 == 0 {
                env!("YOUTUBE_API_KEY0")
            } else {
                env!("YOUTUBE_API_KEY1")
            },
        )
        .await?;

        for stream in streams {
            let _ = sqlx::query!(
                r#"
                    insert into youtube_streams (stream_id, vtuber_id, title, schedule_time, start_time, end_time)
                         values ($1, $2, $3, $4, $5, $6)
                    on conflict (stream_id) do update
                            set (title, schedule_time, start_time, end_time)
                              = ($3, $4, $5, $6)
                "#,
                stream.id,
                vtuber_id,
                title,
                stream.schedule_time,
                stream.start_time,
                stream.end_time,
            )
            .execute(&pool)
            .await
            .map_err(Error::Database)?;
        }
    } else {
        eprintln!("Invalid XML: {}", body);
    }

    Ok(StatusCode::OK)
}

fn parse_xml(xml: &str) -> Option<(String, String, String)> {
    let doc = roxmltree::Document::parse(xml).ok()?;

    let video_id = doc
        .descendants()
        .find(|n| n.tag_name().name() == "videoId")
        .and_then(|n| n.text())
        .map(String::from)?;

    // skip the frist title element
    let title = doc
        .descendants()
        .filter(|n| n.tag_name().name() == "title")
        .nth(1)
        .and_then(|n| n.text())
        .map(String::from)?;

    let channel_id = doc
        .descendants()
        .find(|n| n.tag_name().name() == "channelId")
        .and_then(|n| n.text())?;

    let vtuber_id = VTUBERS
        .iter()
        .find(|v| v.youtube == Some(channel_id))
        .map(|v| v.name)
        .map(String::from)?;

    Some((vtuber_id, video_id, title))
}
