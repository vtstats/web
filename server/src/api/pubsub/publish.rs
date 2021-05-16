use roxmltree::Document;
use sqlx::PgPool;
use tracing::instrument;
use warp::{http::StatusCode, Rejection};

use crate::config::CONFIG;
use crate::error::Error;
use crate::requests::{RequestHub, Stream};

pub async fn publish_content(
    body: String,
    pool: PgPool,
    hub: RequestHub,
) -> Result<StatusCode, Rejection> {
    tracing::info!(name = "POST /api/pubsub/:pubsub", text = &body.as_str());

    let doc = match Document::parse(&body) {
        Ok(doc) => doc,
        Err(_) => {
            tracing::error!(err.msg = "failed to parse xml");
            return Ok(StatusCode::BAD_REQUEST);
        }
    };

    if let Some((vtuber_id, video_id)) = parse_modification(&doc) {
        tracing::info!(action = "Update video", vtuber_id, video_id);

        let streams = hub.youtube_streams(&[video_id.to_string()]).await?;

        if streams.is_empty() {
            tracing::error!(err.msg = "stream not found");
            return Ok(StatusCode::BAD_REQUEST);
        }

        let thumbnail_url = hub.upload_thumbnail(&streams[0].id).await;

        update_youtube_stream(&streams[0], vtuber_id, thumbnail_url, &pool).await?;

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

pub fn parse_modification<'a>(doc: &'a Document) -> Option<(&'a str, &'a str)> {
    let video_id = doc
        .descendants()
        .find(|n| n.tag_name().name() == "videoId")
        .and_then(|n| n.text())?;

    let channel_id = doc
        .descendants()
        .find(|n| n.tag_name().name() == "channelId")
        .and_then(|n| n.text())?;

    let vtuber = CONFIG.find_by_youtube_channel_id(channel_id)?;

    Some((&vtuber.id, video_id))
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

    let vtuber = CONFIG.find_by_youtube_channel_id(channel_id)?;

    Some((stream_id, &vtuber.id))
}

#[instrument(
    name = "Update youtube stream",
    skip(stream, vtuber_id, thumbnail_url, pool),
    fields(db.table = "youtube_streams")
)]
async fn update_youtube_stream(
    stream: &Stream,
    vtuber_id: &str,
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
        stream.title,
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
