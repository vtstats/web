use anyhow::Result;
use chrono::Utc;
use std::collections::HashSet;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tokio::time::sleep;
use tracing::{field::Empty, Instrument, Span};

use holostats_database::stream::{
    EndStreamQuery, GetUpcomingStreamsQuery, StreamStatus, UpdateYouTubeStreamQuery,
};
use holostats_database::Database;
use holostats_request::RequestHub;

#[tokio::main]
async fn main() -> Result<()> {
    holostats_tracing::init("stream_metadata", true);

    let hub = RequestHub::new();
    let db = Database::new().await?;

    let seen = Arc::new(Mutex::new(HashSet::<String>::new()));

    loop {
        let streams = GetUpcomingStreamsQuery.execute(&db.pool).await?;

        for stream in streams {
            {
                let mut seen = seen.lock().unwrap();

                if seen.contains(&stream.stream_id) {
                    continue;
                }

                seen.insert((&stream.stream_id).into());
            }

            let seen = seen.clone();
            let hub = hub.clone();
            let db = db.clone();

            tokio::spawn(async move {
                if let Err(err) =
                    update_stream_metadata(&stream.stream_id, &stream.vtuber_id, hub, db).await
                {
                    eprintln!("[{}]: err {}", &stream.stream_id, err);
                }

                seen.lock().unwrap().remove(&stream.stream_id);
            });
        }

        sleep(Duration::from_secs(15)).await;
    }
}

async fn update_stream_metadata(
    stream_id: &str,
    vtuber_id: &str,
    hub: RequestHub,
    db: Database,
) -> Result<()> {
    println!("[{}]: started", &stream_id);

    let mut next_continuation: Option<String> = None;
    let mut is_live = false;

    loop {
        let update = async {
            let response = match next_continuation {
                Some(ref cont) => hub.updated_metadata_with_continuation(&cont).await,
                None => hub.updated_metadata(&stream_id).await,
            }?;

            match (
                response.timeout(),
                response.continuation(),
                response.is_waiting(),
            ) {
                // stream not found
                (None, _, _) | (_, None, _) => {
                    EndStreamQuery {
                        id: stream_id,
                        date: Utc::now(),
                    }
                    .execute(&db.pool)
                    .await?;

                    Result::<_>::Ok(None)
                }

                // stream was ended
                (Some(timeout), _, false) if timeout.as_secs() > 5 => {
                    let streams = hub.youtube_streams(&[stream_id.to_string()]).await?;

                    if let Some(stream) = streams.first() {
                        UpdateYouTubeStreamQuery {
                            id: &stream_id,
                            date: Utc::now(),
                            title: Some(&stream.title),
                            end_time: stream.end_time,
                            start_time: stream.start_time,
                            schedule_time: stream.schedule_time,
                            likes: stream.likes,
                            status: Some(StreamStatus::Ended),
                            viewers: stream.viewers,
                        }
                        .execute(&db.pool)
                        .await?;
                    }

                    Ok(None)
                }

                // stream is still waiting
                (Some(timeout), Some(continuation), true) => {
                    tracing::info!("sleep {}ms", timeout.as_millis());
                    sleep(timeout).await;

                    Ok(Some(continuation.to_string()))
                }

                // stream is on air
                (Some(timeout), Some(continuation), false) => {
                    let now = Utc::now();

                    UpdateYouTubeStreamQuery {
                        id: &stream_id,
                        date: now,
                        title: response.title().as_deref(),
                        status: Some(StreamStatus::Live),
                        viewers: response.view_count(),
                        likes: response.like_count(),
                        start_time: if is_live { None } else { Some(now) },
                        ..Default::default()
                    }
                    .execute(&db.pool)
                    .await?;

                    // sends a notification to other clients
                    let payload = &format!("{},{}", vtuber_id, stream_id);
                    if let Err(err) = db
                        .notify("get_live_chat", &format!("{},{}", vtuber_id, stream_id))
                        .await
                    {
                        tracing::error!(
                            payload = payload.as_str(),
                            "Failed to notify `get_live_chat` channel: {:?}",
                            err
                        );
                    }

                    is_live = true;

                    tracing::info!("sleep {}ms", timeout.as_millis());
                    sleep(timeout).await;

                    Ok(Some(continuation.to_string()))
                }
            }
        };

        let fut = async {
            match update.await {
                Ok(c) => c,
                Err(err) => {
                    Span::current().record("otel.status_code", &"ERROR");
                    tracing::error!("Failed to stream metadata: {:?}", err);
                    None
                }
            }
        };

        let span = tracing::info_span!(
            "Fetch stream metadata",
            service.name = "holostats-stream-metadata",
            span.kind = "consumer",
            stream_id = stream_id,
            otel.status_code = Empty,
        );

        if let Some(continuation) = fut.instrument(span).await {
            next_continuation = Some(continuation);
        } else {
            break;
        }
    }

    println!("[{}]: stopped", &stream_id);

    Ok(())
}
