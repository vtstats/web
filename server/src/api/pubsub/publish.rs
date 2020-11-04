use futures::future::TryFutureExt;
use reqwest::Client;
use roxmltree::Document;
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
    let doc = match Document::parse(&body) {
        Ok(doc) => doc,
        Err(_) => {
            eprintln!("Invalid XML: {}", body);
            return Ok(StatusCode::OK);
        }
    };

    if let Some((vtuber_id, video_id, title)) = parse_modification(&doc) {
        let streams = youtube_streams(&client, &[&video_id]).await?;

        if streams.len() == 0 {
            eprintln!("{}: stream not found", vtuber_id);
            return Ok(StatusCode::OK);
        }

        upload_thumbnail(&streams[0].id, &client).await;

        let _ = sqlx::query!(
            r#"
                insert into youtube_streams (stream_id, vtuber_id, title, status, schedule_time, start_time, end_time)
                     values ($1, $2, $3, $4::text::stream_status, $5, $6, $7)
                on conflict (stream_id) do update
                        set (title, status, schedule_time, start_time, end_time)
                          = ($3, $4::text::stream_status, $5, $6, $7)
            "#,
            streams[0].id,
            vtuber_id,
            title,
            streams[0].status.as_str(),
            streams[0].schedule_time,
            streams[0].start_time,
            streams[0].end_time,
        )
        .execute(&pool)
        .await
        .map_err(Error::Database)?;

        return Ok(StatusCode::OK);
    }

    if let Some((stream_id, vtuber_id)) = parse_deletion(&doc) {
        println!("try to delete stream {}", stream_id);

        let _ = sqlx::query!(
            r#"
                delete from youtube_streams
                      where stream_id = $1
                        and vtuber_id = $2
                        and status = 'scheduled'::stream_status
            "#,
            stream_id,
            vtuber_id,
        )
        .execute(&pool)
        .await
        .map_err(Error::Database)?;

        return Ok(StatusCode::OK);
    }

    eprintln!("Invalid XML: {}", body);

    return Ok(StatusCode::OK);
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

pub fn parse_modification<'a>(doc: &'a Document) -> Option<(&'a str, &'a str, &'a str)> {
    let video_id = doc
        .descendants()
        .find(|n| n.tag_name().name() == "videoId")
        .and_then(|n| n.text())?;

    // skip the frist title element
    let title = doc
        .descendants()
        .filter(|n| n.tag_name().name() == "title")
        .nth(1)
        .and_then(|n| n.text())?;

    let channel_id = doc
        .descendants()
        .find(|n| n.tag_name().name() == "channelId")
        .and_then(|n| n.text())?;

    let vtuber_id = VTUBERS
        .iter()
        .find(|v| v.youtube == Some(channel_id))
        .map(|v| v.id)?;

    Some((vtuber_id, video_id, title))
}

pub fn parse_deletion<'a>(doc: &'a Document) -> Option<(&'a str, &'a str)> {
    let stream_id = doc
        .descendants()
        .find(|n| n.tag_name().name() == "deleted-entry")
        .and_then(|n| n.attribute("ref"))
        .and_then(|r| r.get("yt:video:".len()..))?;

    let channel_id = doc
        .descendants()
        .find(|n| n.tag_name().name() == "uri")
        .and_then(|n| n.text())
        .and_then(|n| n.get("https://www.youtube.com/channel/".len()..))?;

    let vtuber_id = VTUBERS
        .iter()
        .find(|v| v.youtube == Some(channel_id))
        .map(|v| v.id)?;

    Some((stream_id, vtuber_id))
}
