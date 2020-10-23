use chrono::{
    serde::{ts_milliseconds, ts_milliseconds_option},
    DateTime, Utc,
};
use serde::{ser::Serializer, Serialize};
use serde_with::{rust::StringWithSeparator, CommaSeparator};
use sqlx::PgPool;
use std::str::FromStr;
use warp::Rejection;

use crate::error::Error;
use crate::vtubers::VTUBERS;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChannelsReportRequestQuery {
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    ids: Vec<String>,
    #[serde(with = "StringWithSeparator::<CommaSeparator>")]
    metrics: Vec<Metrics>,
    #[serde(default, with = "ts_milliseconds_option")]
    start_at: Option<DateTime<Utc>>,
    #[serde(default, with = "ts_milliseconds_option")]
    end_at: Option<DateTime<Utc>>,
}

pub enum Metrics {
    YoutubeChannelSubscriber,
    YoutubeChannelView,
    BilibiliChannelSubscriber,
    BilibiliChannelView,
}

impl FromStr for Metrics {
    type Err = &'static str;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "youtube_channel_subscriber" => Ok(Metrics::YoutubeChannelSubscriber),
            "youtube_channel_view" => Ok(Metrics::YoutubeChannelView),
            "bilibili_channel_subscriber" => Ok(Metrics::BilibiliChannelSubscriber),
            "bilibili_channel_view" => Ok(Metrics::BilibiliChannelView),
            _ => Err("unknown metrics"),
        }
    }
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
        #[derive(serde::Serialize)]
        struct RowHelper(#[serde(with = "ts_milliseconds")] DateTime<Utc>, i32);

        RowHelper(self.time, self.value).serialize(serializer)
    }
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Channel {
    kind: String,
    vtuber_id: String,
    subscriber_count: i32,
    daily_subscriber_count: i32,
    weekly_subscriber_count: i32,
    monthly_subscriber_count: i32,
    view_count: i32,
    daily_view_count: i32,
    weekly_view_count: i32,
    monthly_view_count: i32,
    #[serde(with = "ts_milliseconds")]
    updated_at: DateTime<Utc>,
}

pub async fn channels_report(
    query: ChannelsReportRequestQuery,
    pool: PgPool,
) -> Result<impl warp::Reply, Rejection> {
    let mut channels = Vec::with_capacity(query.ids.len());
    let mut reports = Vec::with_capacity(query.ids.len() * query.metrics.len());

    for id in query.ids {
        let vtb = match VTUBERS.iter().find(|v| v.id == id) {
            Some(vtb) => vtb,
            _ => continue,
        };

        if vtb.youtube.is_some() {
            let channel = sqlx::query_as!(
                Channel,
                r#"select *, 'youtube' as kind from youtube_channels where vtuber_id = $1"#,
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
                r#"select *, 'bilibili' as kind from bilibili_channels where vtuber_id = $1"#,
                id
            )
            .fetch_one(&pool)
            .await
            .map_err(Error::Database)?;

            channels.push(channel);
        }

        for metric in &query.metrics {
            reports.push(match metric {
                Metrics::YoutubeChannelSubscriber => {
                    youtube_channel_subscriber(id.to_string(), query.start_at, query.end_at, &pool)
                        .await?
                }
                Metrics::YoutubeChannelView => {
                    youtube_channel_view(id.to_string(), query.start_at, query.end_at, &pool)
                        .await?
                }
                Metrics::BilibiliChannelSubscriber => {
                    bilibili_channel_subscriber(id.to_string(), query.start_at, query.end_at, &pool)
                        .await?
                }
                Metrics::BilibiliChannelView => {
                    bilibili_channel_view(id.to_string(), query.start_at, query.end_at, &pool)
                        .await?
                }
            });
        }
    }

    let etag = &channels
        .iter()
        .map(|c| c.updated_at)
        .max()
        .map(|t| t.timestamp())
        .unwrap_or_default()
        .to_string();

    Ok(warp::reply::with_header(
        warp::reply::json(&ChannelsReportResponseBody { channels, reports }),
        "etag",
        etag,
    ))
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
