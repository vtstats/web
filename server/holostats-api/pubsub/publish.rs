use hmac::{Hmac, Mac, NewMac};
use holostats_config::CONFIG;
use holostats_database::{streams::StreamStatus as StreamStatus_, Database};
use holostats_request::{RequestHub, StreamStatus};
use roxmltree::Document;
use sha1::Sha1;
use std::convert::Into;
use warp::{http::StatusCode, Rejection};

use crate::reject::WarpError;

pub async fn publish_content(
    body: String,
    signature: Option<String>,
    db: Database,
    hub: RequestHub,
) -> Result<StatusCode, Rejection> {
    tracing::info!(name = "POST /api/pubsub/:pubsub", text = &body.as_str());

    if let Some(signature) = signature.as_ref().map(|s| s.trim_start_matches("sha1=")) {
        if verify_signature(&body, signature) {
            println!("signature = {}: verified", signature);
        } else {
            eprintln!("signature = {}: failed", signature);
        }
    }

    let doc = match Document::parse(&body) {
        Ok(doc) => doc,
        Err(_) => {
            tracing::error!(err.msg = "failed to parse xml");
            return Ok(StatusCode::BAD_REQUEST);
        }
    };

    if let Some((vtuber_id, video_id)) = parse_modification(&doc) {
        tracing::info!(action = "Update video", vtuber_id, video_id);

        let streams = hub
            .youtube_streams(&[video_id.to_string()])
            .await
            .map_err(WarpError)?;

        if streams.is_empty() {
            tracing::error!(err.msg = "stream not found");
            return Ok(StatusCode::BAD_REQUEST);
        }

        for stream in streams {
            let thumbnail_url = hub.upload_thumbnail(&stream.id).await;

            db.upsert_youtube_stream(
                stream.id,
                vtuber_id,
                stream.title,
                match stream.status {
                    StreamStatus::Ended => StreamStatus_::Ended,
                    StreamStatus::Live => StreamStatus_::Live,
                    StreamStatus::Scheduled => StreamStatus_::Scheduled,
                },
                thumbnail_url,
                stream.schedule_time,
                stream.start_time,
                stream.end_time,
            )
            .await
            .map_err(Into::<WarpError>::into)?;
        }

        return Ok(StatusCode::OK);
    }

    if let Some((video_id, vtuber_id)) = parse_deletion(&doc) {
        tracing::info!(action = "Delete video", vtuber_id, video_id);

        db.delete_schedule_stream(video_id, vtuber_id)
            .await
            .map_err(Into::<WarpError>::into)?;

        return Ok(StatusCode::OK);
    }

    tracing::error!(err.msg = "unkown xml schema");

    Ok(StatusCode::BAD_REQUEST)
}

pub fn verify_signature(data: &str, signature: &str) -> bool {
    let mut mac = Hmac::<Sha1>::new_from_slice(CONFIG.youtube.pubsub_secret.as_bytes())
        .expect("HMAC can take key of any size");

    mac.update(data.as_bytes());

    let result = mac.finalize().into_bytes();

    hex::encode(result) == signature
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
