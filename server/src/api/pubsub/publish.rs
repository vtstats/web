use reqwest::Client;
use roxmltree::Document;
use sha2::{Digest, Sha256};
use sqlx::PgPool;
use tracing::instrument;
use warp::{http::StatusCode, Rejection};

use crate::error::Error;
use crate::requests::{upload_file, youtube_streams, youtube_thumbnail, Stream};
use crate::vtubers::VTUBERS;

pub async fn publish_content(
    body: String,
    pool: PgPool,
    client: Client,
) -> Result<StatusCode, Rejection> {
    tracing::info!(name = "POST /api/pubsub/:pubsub", text = &body.as_str(),);

    let doc = match Document::parse(&body) {
        Ok(doc) => doc,
        Err(_) => {
            tracing::error!(err.msg = "failed to parse xml");
            return Ok(StatusCode::BAD_REQUEST);
        }
    };

    if let Some((vtuber_id, video_id, title)) = parse_modification(&doc) {
        tracing::info!(action = "Update video", vtuber_id, video_id);

        let streams = youtube_streams(&client, &[video_id.to_string()]).await?;

        if streams.is_empty() {
            tracing::error!(err.msg = "stream not found");
            return Ok(StatusCode::BAD_REQUEST);
        }

        let thumbnail_url = upload_thumbnail(&streams[0].id, &client)
            .await
            .map(|filename| format!("https://taiwanv-dev.linnil1.me/thumbnail/{}", filename));

        update_youtube_stream(&streams[0], vtuber_id, title, thumbnail_url, &pool).await?;

        return Ok(StatusCode::OK);
    }

    if let Some((video_id, vtuber_id)) = parse_deletion(&doc) {
        tracing::info!(action = "Delete video", vtuber_id, video_id);

        delete_schedule_stream(video_id, vtuber_id, &pool).await?;

        return Ok(StatusCode::OK);
    }

    tracing::error!(err.msg = "unkown xml schema");

    Ok(StatusCode::BAD_REQUEST)
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

async fn upload_thumbnail(stream_id: &str, client: &Client) -> Option<String> {
    let data = match youtube_thumbnail(stream_id, &client).await {
        Ok(x) => x,
        Err(e) => {
            tracing::warn!(err = ?e, err.msg = "failed to upload thumbnail");
            return None;
        }
    };

    let content_sha256 = Sha256::digest(data.as_ref());

    let filename = format!("{}.{}.jpg", stream_id, hex::encode(content_sha256));

    match upload_file(&filename, data, "image/jpg", &client).await {
        Ok(_) => Some(filename),
        Err(e) => {
            tracing::warn!(err = ?e, err.msg = "failed to upload thumbnail");
            None
        }
    }
}

#[instrument(
    name = "Update youtube stream",
    skip(stream, vtuber_id, title, thumbnail_url, pool),
    fields(db.table = "youtube_streams")
)]
async fn update_youtube_stream(
    stream: &Stream,
    vtuber_id: &str,
    title: &str,
    thumbnail_url: Option<String>,
    pool: &PgPool,
) -> Result<(), Error> {
    let _ = sqlx::query!(
        r#"
            insert into youtube_streams (stream_id, vtuber_id, title, status, thumbnail_url, schedule_time, start_time, end_time)
                 values ($1, $2, $3, $4, $5, $6, $7, $8)
            on conflict (stream_id) do update
                    set (title, status, thumbnail_url, schedule_time, start_time, end_time)
                      = ($3, $4, coalesce($5, youtube_streams.thumbnail_url), $6, $7, $8)
        "#,
        stream.id,
        vtuber_id,
        title,
        stream.status: _,
        thumbnail_url,
        stream.schedule_time,
        stream.start_time,
        stream.end_time,
    )
    .execute(pool)
    .await
    .map_err(Error::Database)?;

    Ok(())
}

#[instrument(
    name = "Delete schedule stream",
    skip(stream_id, vtuber_id, pool),
    fields(db.table = "youtube_streams")
)]
async fn delete_schedule_stream(
    stream_id: &str,
    vtuber_id: &str,
    pool: &PgPool,
) -> Result<(), Error> {
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
    .execute(pool)
    .await
    .map_err(Error::Database)?;

    Ok(())
}
