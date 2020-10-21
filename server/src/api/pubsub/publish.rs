use futures::future::TryFutureExt;
use reqwest::Client;
use sqlx::PgPool;
use warp::{http::StatusCode, Rejection};

use crate::error::Error;
use crate::requests::{upload_file, youtube_streams, youtube_thumbnail};
use crate::vtubers::VTUBERS;

pub async fn publish_content(
    body: String,
    pool: PgPool,
    client: Client,
) -> Result<StatusCode, Rejection> {
    let (vtuber_id, video_id, title) = match parse_xml(&body) {
        Some(xml) => xml,
        None => {
            eprintln!("Invalid XML: {}", body);
            return Ok(StatusCode::OK);
        }
    };

    let streams = youtube_streams(&client, &[&video_id]).await?;

    if streams.len() == 0 {
        eprintln!("{}: stream not found", vtuber_id);
        return Ok(StatusCode::OK);
    }

    upload_thumbnail(&streams[0].id, &client).await;

    let _ = sqlx::query!(
        r#"
            insert into youtube_streams (stream_id, vtuber_id, title, schedule_time, start_time, end_time)
                 values ($1, $2, $3, $4, $5, $6)
            on conflict (stream_id) do update
                    set (title, schedule_time, start_time, end_time)
                      = ($3, $4, $5, $6)
        "#,
        streams[0].id,
        vtuber_id,
        title,
        streams[0].schedule_time,
        streams[0].start_time,
        streams[0].end_time,
    )
    .execute(&pool)
    .await
    .map_err(Error::Database)?;

    Ok(StatusCode::OK)
}

async fn upload_thumbnail(stream_id: &str, client: &Client) {
    match youtube_thumbnail(stream_id, &client)
        .and_then(|thumbnail| {
            upload_file(
                format!("{}.jpg", stream_id),
                thumbnail,
                "image/jpg",
                &client,
            )
        })
        .await
    {
        Ok(_) => println!("{}: thumbnail uploaded", stream_id),
        Err(e) => eprintln!("{}: failed to upload thumbnail {:?}", stream_id, e),
    }
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
