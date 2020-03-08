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
    mut pool: PgPool,
    client: Client,
) -> Result<StatusCode, Rejection> {
    let now = Utc::now();

    if let Some((vtuber_id, video_id, title)) = parse_xml(&body) {
        let streams = youtube_streams(
            &client,
            &[&video_id],
            if now.hour() % 2 == 0 {
                env!("YOUTUBE_API_KEY0")
            } else {
                env!("YOUTUBE_API_KEY1")
            },
        )
        .await
        .map_err(warp::reject::custom)?;

        for stream in streams.items {
            if let Some(details) = stream.live_streaming_details {
                let _ = sqlx::query!(
                    r#"
INSERT INTO youtube_streams (stream_id, title, vtuber_id)
VALUES ($1, $2, $3)
ON CONFLICT (stream_id) DO UPDATE
SET title = $4
                    "#,
                    stream.id,
                    title,
                    vtuber_id,
                    title
                )
                .execute(&mut pool)
                .await
                .map_err(Error::Sql)
                .map_err(warp::reject::custom)?;

                // TODO(sqlx): for now sqlx doesn't spport Option, https://github.com/launchbadge/sqlx/pull/94
                if let Some(schedule) = details.scheduled_start_time {
                    let _ = sqlx::query!(
                        "UPDATE youtube_streams SET schedule_time = $1 WHERE stream_id = $2",
                        schedule,
                        stream.id
                    )
                    .execute(&mut pool)
                    .await
                    .map_err(Error::Sql)
                    .map_err(warp::reject::custom)?;
                }

                if let Some(start) = details.actual_start_time {
                    let _ = sqlx::query!(
                        "UPDATE youtube_streams SET start_time = $1 WHERE stream_id = $2",
                        start,
                        stream.id
                    )
                    .execute(&mut pool)
                    .await
                    .map_err(Error::Sql)
                    .map_err(warp::reject::custom)?;
                }

                if let Some(end) = details.actual_end_time {
                    let _ = sqlx::query!(
                        "UPDATE youtube_streams SET end_time = $1 WHERE stream_id = $2",
                        end,
                        stream.id
                    )
                    .execute(&mut pool)
                    .await
                    .map_err(Error::Sql)
                    .map_err(warp::reject::custom)?;
                }
            }
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
