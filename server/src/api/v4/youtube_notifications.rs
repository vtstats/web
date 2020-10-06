use reqwest::Client;
use sqlx::PgPool;
use warp::{http::StatusCode, Rejection};

use crate::error::Error;
use crate::requests;
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
    let (vtuber_id, video_id, title) = match parse_xml(&body) {
        Some(i) => i,
        _ => {
            eprintln!("Invalid XML: {}", body);
            return Ok(StatusCode::OK);
        }
    };

    let streams = requests::youtube_streams(&client, &[&video_id]).await?;

    for stream in streams {
        let _ = sqlx::query!(
            r#"
                insert into youtube_streams (stream_id, vtuber_id, title, status, schedule_time, start_time, end_time)
                     values ($1, $2, $3, $4::text::stream_status, $5, $6, $7)
                on conflict (stream_id) do update
                        set (title, status, schedule_time, start_time, end_time)
                          = ($3, $4::text::stream_status, $5, $6, $7)
            "#,
            stream.id,
            vtuber_id,
            title,
            stream.status.as_str(),
            stream.schedule_time,
            stream.start_time,
            stream.end_time,
        )
        .execute(&pool)
        .await
        .map_err(Error::Database)?;
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
        .map(|v| v.id)
        .map(String::from)?;

    Some((vtuber_id, video_id, title))
}
