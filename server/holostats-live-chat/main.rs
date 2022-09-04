use anyhow::Result;
use chrono::NaiveDateTime;
use chrono::{DateTime, Utc};
use holostats_config::CONFIG;
use holostats_database::Database;
use holostats_request::{Continuation, LiveChatMessage, RequestHub};
use std::collections::HashSet;
use std::sync::{Arc, Mutex};
use tokio::time::sleep;
use tracing::{field::Empty, Instrument, Span};

#[tokio::main]
async fn main() -> Result<()> {
    holostats_tracing::init("live_chat", true);

    let hub = RequestHub::new();
    let db = Database::new().await?;

    let mut listener = Database::listener().await?;

    listener.listen("get_live_chat").await?;

    let seen = Arc::new(Mutex::new(HashSet::<String>::new()));

    loop {
        let notification = listener.recv().await?;

        let payload = notification.payload();

        if let Some((vtb_id, stream_id)) = payload.split_once(',') {
            {
                let mut seen = seen.lock().unwrap();

                if seen.contains(stream_id) {
                    continue;
                } else {
                    seen.insert(stream_id.into());
                }
            }

            let db = db.clone();
            let hub = hub.clone();
            let vtb_id = vtb_id.to_owned();
            let stream_id = stream_id.to_owned();

            let seen = seen.clone();

            tokio::spawn(async move {
                if let Err(err) = get_live_chat(db, hub, vtb_id.clone(), stream_id.clone()).await {
                    eprintln!("[{:>15}/{}]: err {}", vtb_id, stream_id, err);
                }

                seen.lock().unwrap().remove(&stream_id);
            });
        } else {
            eprintln!("Wrong notification payload: {}", payload);
        }
    }
}

fn parse_timestamp(s: String, trunc: bool) -> Option<DateTime<Utc>> {
    s.get(0..(s.len() - 6))
        .and_then(|t| t.parse().ok())
        .map(|t: i64| if trunc { t - (t % 15) } else { t })
        .map(|t| NaiveDateTime::from_timestamp(t, 0))
        .map(|d| DateTime::<Utc>::from_utc(d, Utc))
}

async fn get_live_chat(
    db: Database,
    hub: RequestHub,
    vtb_id: String,
    stream_id: String,
) -> Result<()> {
    let channel_id = match CONFIG.find_by_id(&vtb_id).and_then(|v| v.youtube.as_ref()) {
        Some(id) => id,
        None => {
            println!("unkown vtb_id: {}", vtb_id);
            return Ok(());
        }
    };

    println!("[{:>15}/{}]: started", vtb_id, stream_id);

    let mut continuation: Option<String> = None;

    loop {
        let fetch = async {
            let (msgs, cont) = match continuation {
                Some(c) => hub.youtube_live_chat_with_continuation(c).await,
                None => hub.youtube_live_chat(channel_id, &stream_id).await,
            }?;

            let msgs_len = msgs.len();

            let mut paid_types = vec![];
            let mut paid_author_names = vec![];
            let mut paid_author_channel_ids = vec![];
            let mut paid_times = vec![];
            let mut paid_texts = vec![];
            let mut paid_badges = vec![];
            let mut paid_amounts = vec![];
            let mut paid_colors = vec![];

            let mut mem_types = vec![];
            let mut mem_author_names = vec![];
            let mut mem_author_channel_ids = vec![];
            let mut mem_times = vec![];
            let mut mem_texts = vec![];
            let mut mem_badges = vec![];

            let mut times = vec![];
            let mut msg_cnt = vec![];
            let mut member_msg_cnt = vec![];

            for msg in msgs {
                match msg {
                    LiveChatMessage::Text {
                        timestamp, badges, ..
                    } => {
                        let from_member = badges
                            .iter()
                            .any(|badge| badge.contains("Member") || badge.contains("member"));

                        if let Some(dt) = parse_timestamp(timestamp, true) {
                            if let Some(idx) = times.iter().position(|d| d == &dt) {
                                msg_cnt[idx] += 1;
                                if from_member {
                                    member_msg_cnt[idx] += 1;
                                }
                            } else {
                                times.push(dt);
                                msg_cnt.push(1);
                                member_msg_cnt.push(if from_member { 1 } else { 0 });
                            }
                        }
                    }
                    LiveChatMessage::Member {
                        ty,
                        author_name,
                        author_channel_id,
                        timestamp,
                        text,
                        badges,
                    } => {
                        if let Some(dt) = parse_timestamp(timestamp, false) {
                            mem_types.push(ty.as_str());
                            mem_author_names.push(author_name);
                            mem_author_channel_ids.push(author_channel_id);
                            mem_times.push(dt);
                            mem_texts.push(text);
                            mem_badges.push(badges.join(","));
                        }
                    }
                    LiveChatMessage::Paid {
                        ty,
                        author_name,
                        author_channel_id,
                        timestamp,
                        amount,
                        badges,
                        text,
                        color,
                    } => {
                        if let Some(date) = parse_timestamp(timestamp, false) {
                            paid_types.push(ty.as_str());
                            paid_author_names.push(author_name);
                            paid_author_channel_ids.push(author_channel_id);
                            paid_times.push(date);
                            paid_texts.push(text);
                            paid_amounts.push(amount);
                            paid_badges.push(badges.join(","));
                            paid_colors.push(color);
                        }
                    }
                }
            }

            let mem_msgs_len = mem_types.len();
            let paid_msgs_len = paid_types.len();

            db.insert_live_chat_statistic(stream_id.clone(), times, msg_cnt, member_msg_cnt)
                .await?;

            db.insert_live_chat_member_messages(
                stream_id.clone(),
                mem_types,
                mem_author_names,
                mem_author_channel_ids,
                mem_times,
                mem_texts,
                mem_badges,
            )
            .await?;

            db.insert_live_chat_paid_messages(
                stream_id.clone(),
                paid_types,
                paid_amounts,
                paid_author_names,
                paid_author_channel_ids,
                paid_times,
                paid_texts,
                paid_badges,
                paid_colors,
            )
            .await?;

            tracing::info!(
                vtuber_id = vtb_id.as_str(),
                stream_id = stream_id.as_str(),
                "YouTube Stream {}, live_chat={}, member_live_chat={}, paid_live_chat={}",
                stream_id,
                msgs_len,
                mem_msgs_len,
                paid_msgs_len
            );

            Result::<Option<Continuation>>::Ok(cont)
        };

        let fut = async {
            match fetch.await {
                Ok(cont) => {
                    if let Some(timeout) = cont.as_ref().and_then(|c| c.get_timeout()) {
                        tracing::info!("sleep {}ms", timeout.as_millis());
                        sleep(timeout).await;
                    }

                    cont.and_then(|c| c.get_next_continuation())
                }
                Err(err) => {
                    Span::current().record("otel.status_code", &"ERROR");
                    tracing::error!("Failed to fetch live chat data: {:?}", err);
                    None
                }
            }
        };

        let span = tracing::info_span!(
            "Fetch live chat data",
            service.name = "holostats-live-chat",
            span.kind = "consumer",
            vtb_id = vtb_id.as_str(),
            stream_id = stream_id.as_str(),
            otel.status_code = Empty,
        );

        if let Some(next_continuation) = fut.instrument(span).await {
            continuation = Some(next_continuation);
        } else {
            break;
        }
    }

    println!("[{:>15}/{}]: stopped", vtb_id, stream_id);

    Ok(())
}
