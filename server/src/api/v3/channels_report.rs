use chrono::{DateTime, Utc};
use serde::{
    ser::{SerializeTuple, Serializer},
    Serialize,
};
use sqlx::PgPool;
use warp::{reply::Json, Rejection};

use crate::config::CONFIG;
use crate::error::Error;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChannelsReportRequestQuery {
    ids: String,
    metrics: String,
    start_at: Option<DateTime<Utc>>,
    end_at: Option<DateTime<Utc>>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ChannelsReportResponseBody {
    channels: Vec<Channel>,
    reports: Vec<ChannelsReport>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ChannelsReport {
    id: String,
    kind: String,
    rows: Vec<Row>,
}

pub struct Row {
    pub time: DateTime<Utc>,
    pub value: i32,
}

// serializing row as a tuple, it helps reducing response size
impl Serialize for Row {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut tuple = serializer.serialize_tuple(2)?;
        tuple.serialize_element(&self.time)?;
        tuple.serialize_element(&self.value)?;
        tuple.end()
    }
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Channel {
    platform: String,
    vtuber_id: String,
    subscriber_count: i32,
    daily_subscriber_count: i32,
    weekly_subscriber_count: i32,
    monthly_subscriber_count: i32,
    view_count: i32,
    daily_view_count: i32,
    weekly_view_count: i32,
    monthly_view_count: i32,
    updated_at: DateTime<Utc>,
}

pub async fn channels_report(
    query: ChannelsReportRequestQuery,
    pool: PgPool,
) -> Result<Json, Rejection> {
    tracing::info!(
        name = "GET /api/v3/channels_report",
        ids = &query.ids.as_str(),
        metrics = &query.metrics.as_str(),
    );

    if let Some(start_at) = query.start_at {
        tracing::info!(?start_at);
    }

    if let Some(end_at) = query.end_at {
        tracing::info!(?end_at);
    }

    let mut channels = vec![];
    let mut reports = vec![];

    for id in query.ids.split(',') {
        let vtb = match CONFIG.vtubers.iter().find(|v| v.id == id) {
            Some(vtb) => vtb,
            _ => continue,
        };

        if vtb.youtube.is_some() {
            let channel = sqlx::query_as!(
                Channel,
                r#"select *, 'youtube' as "platform!" from youtube_channels where vtuber_id = $1"#,
                id
            )
            .fetch_one(&pool)
            .await
            .map_err(Error::Database)?;

            channels.push(channel);
        }

        if vtb.bilibili.is_some() {
            let channel = sqlx::query_as!(
                Channel,
                r#"select *, 'bilibili' as "platform!" from bilibili_channels where vtuber_id = $1"#,
                id
            )
            .fetch_one(&pool)
            .await
            .map_err(Error::Database)?;

            channels.push(channel);
        }

        for metric in query.metrics.split(',') {
            match metric {
                "youtube_channel_subscriber" => reports.push(
                    youtube_channel_subscriber(id.to_string(), query.start_at, query.end_at, &pool)
                        .await?,
                ),
                "youtube_channel_view" => reports.push(
                    youtube_channel_view(id.to_string(), query.start_at, query.end_at, &pool)
                        .await?,
                ),
                "bilibili_channel_subscriber" => reports.push(
                    bilibili_channel_subscriber(
                        id.to_string(),
                        query.start_at,
                        query.end_at,
                        &pool,
                    )
                    .await?,
                ),
                "bilibili_channel_view" => reports.push(
                    bilibili_channel_view(id.to_string(), query.start_at, query.end_at, &pool)
                        .await?,
                ),
                _ => (),
            }
        }
    }

    Ok(warp::reply::json(&ChannelsReportResponseBody {
        channels,
        reports,
    }))
}

async fn youtube_channel_subscriber(
    id: String,
    start_at: Option<DateTime<Utc>>,
    end_at: Option<DateTime<Utc>>,
    pool: &PgPool,
) -> Result<ChannelsReport, Rejection> {
    let rows = sqlx::query_as!(
        Row,
        r#"
            select time, value
              from youtube_channel_subscriber_statistic
             where vtuber_id = $1
               and (time >= $2 or $2 is null)
               and (time <= $3 or $3 is null)
        "#,
        id,
        start_at,
        end_at
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)?;

    Ok(ChannelsReport {
        id,
        kind: String::from("youtube_channel_subscriber"),
        rows,
    })
}

async fn youtube_channel_view(
    id: String,
    start_at: Option<DateTime<Utc>>,
    end_at: Option<DateTime<Utc>>,
    pool: &PgPool,
) -> Result<ChannelsReport, Rejection> {
    let rows = sqlx::query_as!(
        Row,
        r#"
            select time, value
              from youtube_channel_view_statistic
             where vtuber_id = $1
               and (time >= $2 or $2 is null)
               and (time <= $3 or $3 is null)
        "#,
        id,
        start_at,
        end_at
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)?;

    Ok(ChannelsReport {
        id,
        kind: String::from("youtube_channel_view"),
        rows,
    })
}

async fn bilibili_channel_subscriber(
    id: String,
    start_at: Option<DateTime<Utc>>,
    end_at: Option<DateTime<Utc>>,
    pool: &PgPool,
) -> Result<ChannelsReport, Rejection> {
    let rows = sqlx::query_as!(
        Row,
        r#"
            select time, value
              from bilibili_channel_subscriber_statistic
             where vtuber_id = $1
               and (time >= $2 or $2 is null)
               and (time <= $3 or $3 is null)
        "#,
        id,
        start_at,
        end_at
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)?;

    Ok(ChannelsReport {
        id,
        kind: String::from("bilibili_channel_subscriber"),
        rows,
    })
}

async fn bilibili_channel_view(
    id: String,
    start_at: Option<DateTime<Utc>>,
    end_at: Option<DateTime<Utc>>,
    pool: &PgPool,
) -> Result<ChannelsReport, Rejection> {
    let rows = sqlx::query_as!(
        Row,
        r#"
            select time, value
              from bilibili_channel_view_statistic
             where vtuber_id = $1
               and (time >= $2 or $2 is null)
               and (time <= $3 or $3 is null)
        "#,
        id,
        start_at,
        end_at
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)?;

    Ok(ChannelsReport {
        id,
        kind: String::from("bilibili_channel_view"),
        rows,
    })
}
