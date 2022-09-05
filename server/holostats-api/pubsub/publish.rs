use hmac::{Hmac, Mac};
use holostats_config::CONFIG;
use holostats_request::{RequestHub, StreamStatus};
use roxmltree::Document;
use sha1::Sha1;
use std::convert::Into;
use tracing::Span;
use warp::{http::StatusCode, Rejection};

use holostats_database::{
    stream::{EndStreamQuery, StreamStatus as StreamStatus_, UpsertYouTubeStreamQuery},
    Database,
};

use crate::reject::WarpError;

pub async fn publish_content(
    body: String,
    signature: String,
    db: Database,
    hub: RequestHub,
) -> Result<StatusCode, Rejection> {
    Span::current().record("name", &"POST /api/pubsub");

    tracing::debug!("body={}", body.as_str());

    let expected = generate_signature(&body);
    let found = signature.trim_start_matches("sha1=");

    if expected != found {
        tracing::error!("Bad signature, expected={}, found={}", expected, found);
        return Ok(StatusCode::BAD_REQUEST);
    }

    let doc = match Document::parse(&body) {
        Ok(doc) => doc,
        Err(err) => {
            tracing::error!("failed to parse xml: {:?}", err);
            return Ok(StatusCode::BAD_REQUEST);
        }
    };

    if let Some((vtuber_id, video_id)) = parse_modification(&doc) {
        tracing::info!(
            "update stream: vtuber_id={}, video_id={}",
            vtuber_id,
            video_id
        );

        let streams = hub
            .youtube_streams(&[video_id.to_string()])
            .await
            .map_err(WarpError)?;

        if streams.is_empty() {
            tracing::error!("Stream not found, stream_id={}", video_id);
            return Ok(StatusCode::BAD_REQUEST);
        }

        for stream in streams {
            let thumbnail_url = hub.upload_thumbnail(&stream.id).await;

            UpsertYouTubeStreamQuery {
                stream_id: &stream.id,
                vtuber_id,
                title: &stream.title,
                status: match stream.status {
                    StreamStatus::Ended => StreamStatus_::Ended,
                    StreamStatus::Live => StreamStatus_::Live,
                    StreamStatus::Scheduled => StreamStatus_::Scheduled,
                },
                thumbnail_url,
                schedule_time: stream.schedule_time,
                start_time: stream.start_time,
                end_time: stream.end_time,
            }
            .execute(&db.pool)
            .await
            .map_err(Into::<WarpError>::into)?;
        }

        return Ok(StatusCode::OK);
    }

    if let Some((video_id, vtuber_id)) = parse_deletion(&doc) {
        tracing::info!(
            "Delete stream: vtuber_id={}, video_id={}",
            vtuber_id,
            video_id
        );

        EndStreamQuery {
            id: video_id,
            ..Default::default()
        }
        .execute(&db.pool)
        .await
        .map_err(Into::<WarpError>::into)?;

        return Ok(StatusCode::OK);
    }

    tracing::error!("Unkown xml schema");

    Ok(StatusCode::BAD_REQUEST)
}

pub fn generate_signature(data: &str) -> String {
    let mut mac = Hmac::<Sha1>::new_from_slice(CONFIG.youtube.pubsub_secret.as_bytes())
        .expect("HMAC can take key of any size");

    mac.update(data.as_bytes());

    let result = mac.finalize().into_bytes();

    hex::encode(result)
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
