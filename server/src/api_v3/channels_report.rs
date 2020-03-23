use chrono::{DateTime, Utc};
use sqlx::PgPool;
use warp::{reply::Json, Rejection};

use crate::error::Error;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChannelsReportRequestQuery {
    ids: String,
    metrics: String,
    #[serde(default = "crate::utils::epoch_date_time")]
    start_at: DateTime<Utc>,
    #[serde(default = "Utc::now")]
    end_at: DateTime<Utc>,
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
    rows: Vec<(DateTime<Utc>, i32)>,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Channel {
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
    mut pool: PgPool,
) -> Result<Json, Rejection> {
    let mut channels = vec![];
    let mut reports = vec![];

    for id in query.ids.split(',') {
        let channel = sqlx::query_as!(
            Channel,
            r#"
select vtuber_id,
       subscriber_count,
       daily_subscriber_count,
       weekly_subscriber_count,
       monthly_subscriber_count,
       view_count,
       daily_view_count,
       weekly_view_count,
       monthly_view_count,
       updated_at
  from youtube_channels
 where vtuber_id = $1
            "#,
            id.to_string()
        )
        .fetch_optional(&mut pool)
        .await
        .map_err(Error::Database)
        .map_err(warp::reject::custom)?;

        if let Some(channel) = channel {
            channels.push(channel);

            for metric in query.metrics.split(',') {
                match metric {
                    "youtube_channel_subscriber" => reports.push(
                        youtube_channel_subscriber(
                            id.to_string(),
                            query.start_at,
                            query.end_at,
                            &mut pool,
                        )
                        .await?,
                    ),
                    "youtube_channel_view" => reports.push(
                        youtube_channel_view(
                            id.to_string(),
                            query.start_at,
                            query.end_at,
                            &mut pool,
                        )
                        .await?,
                    ),
                    "bilibili_channel_subscriber" => reports.push(
                        bilibili_channel_subscriber(
                            id.to_string(),
                            query.start_at,
                            query.end_at,
                            &mut pool,
                        )
                        .await?,
                    ),
                    "bilibili_channel_view" => reports.push(
                        bilibili_channel_view(
                            id.to_string(),
                            query.start_at,
                            query.end_at,
                            &mut pool,
                        )
                        .await?,
                    ),
                    _ => (),
                }
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
    start_at: DateTime<Utc>,
    end_at: DateTime<Utc>,
    pool: &mut PgPool,
) -> Result<ChannelsReport, Rejection> {
    let rows = sqlx::query!(
        r#"
select time, value
  from youtube_channel_subscriber_statistic
 where vtuber_id = $1
   and time > $2
   and time < $3
        "#,
        id,
        start_at,
        end_at
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)
    .map_err(warp::reject::custom)?;

    Ok(ChannelsReport {
        id,
        kind: String::from("youtube_channel_subscriber"),
        rows: rows
            .into_iter()
            .map(|r| (r.time, r.value))
            .collect::<Vec<_>>(),
    })
}

async fn youtube_channel_view(
    id: String,
    start_at: DateTime<Utc>,
    end_at: DateTime<Utc>,
    pool: &mut PgPool,
) -> Result<ChannelsReport, Rejection> {
    let rows = sqlx::query!(
        r#"
select time, value
  from youtube_channel_view_statistic
 where vtuber_id = $1
   and time > $2
   and time < $3
        "#,
        id,
        start_at,
        end_at
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)
    .map_err(warp::reject::custom)?;

    Ok(ChannelsReport {
        id,
        kind: String::from("youtube_channel_view"),
        rows: rows
            .into_iter()
            .map(|r| (r.time, r.value))
            .collect::<Vec<_>>(),
    })
}

async fn bilibili_channel_subscriber(
    id: String,
    start_at: DateTime<Utc>,
    end_at: DateTime<Utc>,
    pool: &mut PgPool,
) -> Result<ChannelsReport, Rejection> {
    let rows = sqlx::query!(
        r#"
select time, value
  from bilibili_channel_subscriber_statistic
 where vtuber_id = $1
   and time > $2
   and time < $3
        "#,
        id,
        start_at,
        end_at
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)
    .map_err(warp::reject::custom)?;

    Ok(ChannelsReport {
        id,
        kind: String::from("bilibili_channel_subscriber"),
        rows: rows
            .into_iter()
            .map(|r| (r.time, r.value))
            .collect::<Vec<_>>(),
    })
}

async fn bilibili_channel_view(
    id: String,
    start_at: DateTime<Utc>,
    end_at: DateTime<Utc>,
    pool: &mut PgPool,
) -> Result<ChannelsReport, Rejection> {
    let rows = sqlx::query!(
        r#"
select time, value
  from bilibili_channel_view_statistic
 where vtuber_id = $1
   and time > $2
   and time < $3
        "#,
        id,
        start_at,
        end_at
    )
    .fetch_all(pool)
    .await
    .map_err(Error::Database)
    .map_err(warp::reject::custom)?;

    Ok(ChannelsReport {
        id,
        kind: String::from("bilibili_channel_view"),
        rows: rows
            .into_iter()
            .map(|r| (r.time, r.value))
            .collect::<Vec<_>>(),
    })
}
