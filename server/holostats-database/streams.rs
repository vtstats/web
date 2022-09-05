use chrono::{
    serde::{ts_milliseconds, ts_milliseconds_option},
    DateTime, Utc,
};
use serde::Serialize;
use serde_with::skip_serializing_none;
use sqlx::Result;
use std::cmp::{max, min};
use tracing::instrument;

use crate::query_builder::YouTubeStreamListQueryBuilder;

use super::Database;

type UtcTime = DateTime<Utc>;

#[skip_serializing_none]
#[derive(Debug, Serialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Stream {
    pub stream_id: String,
    pub title: String,
    pub vtuber_id: String,
    pub thumbnail_url: Option<String>,
    #[serde(with = "ts_milliseconds_option")]
    pub schedule_time: Option<UtcTime>,
    #[serde(with = "ts_milliseconds_option")]
    pub start_time: Option<UtcTime>,
    #[serde(with = "ts_milliseconds_option")]
    pub end_time: Option<UtcTime>,
    pub average_viewer_count: Option<i32>,
    pub max_viewer_count: Option<i32>,
    pub max_like_count: Option<i32>,
    #[serde(with = "ts_milliseconds")]
    pub updated_at: UtcTime,
    pub status: StreamStatus,
}

#[derive(Debug, sqlx::Type, Serialize, PartialEq, Eq)]
#[sqlx(type_name = "stream_status", rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
pub enum StreamStatus {
    Scheduled,
    Live,
    Ended,
}

#[derive(Debug)]
pub enum OrderBy {
    StartTimeAsc,
    EndTimeAsc,
    ScheduleTimeAsc,
    StartTimeDesc,
    EndTimeDesc,
    ScheduleTimeDesc,
}

impl Database {
    pub async fn stream_ids(&self) -> Result<Vec<String>> {
        sqlx::query!(r#"select stream_id from youtube_streams"#)
            .map(|row| row.stream_id)
            .fetch_all(&self.pool)
            .await
    }

    #[instrument(
        name = "Select youtube streams",
        skip(self),
        fields(db.table = "youtube_streams"),
    )]
    pub async fn youtube_streams(
        &self,
        ids: &[String],
        status: &[String],
        order_by: OrderBy,
        start_at: &Option<UtcTime>,
        end_at: &Option<UtcTime>,
    ) -> Result<Vec<Stream>> {
        YouTubeStreamListQueryBuilder {
            ids,
            status,
            order_by,
            start_at: start_at.as_ref(),
            end_at: end_at.as_ref(),
            keyword: None,
            limit: 24,
        }
        .to_builder()
        .build_query_as::<Stream>()
        .fetch_all(&self.pool)
        .await
    }

    #[instrument(
        name = "Upsert youtube stream",
        skip(self),
        fields(db.table = "youtube_streams")
    )]
    pub async fn upsert_youtube_stream(
        &self,
        id: String,
        vtuber_id: &str,
        title: String,
        status: StreamStatus,
        thumbnail_url: Option<String>,
        schedule_time: Option<UtcTime>,
        start_time: Option<UtcTime>,
        end_time: Option<UtcTime>,
    ) -> Result<()> {
        let _ = sqlx::query!(
            r#"
    insert into youtube_streams (stream_id, vtuber_id, title, status, thumbnail_url, schedule_time, start_time, end_time)
         values ($1, $2, $3, $4, $5, $6, $7, $8)
    on conflict (stream_id) do update
            set (title, status, thumbnail_url, schedule_time, start_time, end_time)
              = ($3, $4, coalesce($5, youtube_streams.thumbnail_url), $6, $7, $8)
            "#,
            id,            // $1
            vtuber_id,     // $2
            title,         // $3
            status: _,     // $4
            thumbnail_url, // $5
            schedule_time, // $6
            start_time,    // $7
            end_time,      // $8
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    #[instrument(
        name = "Delete schedule stream",
        skip(self),
        fields(db.table = "youtube_streams")
    )]
    pub async fn delete_schedule_stream(&self, stream_id: &str, vtuber_id: &str) -> Result<()> {
        let _ = sqlx::query!(
            r#"
    delete from youtube_streams
          where stream_id = $1
            and vtuber_id = $2
            and status = 'scheduled'::stream_status
            "#,
            stream_id, // $1
            vtuber_id, // $2
        )
        .execute(&self.pool)
        .await;
        Ok(())
    }

    #[instrument(
        name = "Get last updated time of youtube_streams",
        skip(self),
        fields(db.table = "youtube_streams")
    )]
    pub async fn youtube_stream_last_updated(&self) -> Result<Option<UtcTime>> {
        sqlx::query!("select max(updated_at) from youtube_streams")
            .fetch_one(&self.pool)
            .await
            .map(|row| row.max)
    }

    #[instrument(
        name = "Find missing video ids",
        skip(self, video_ids),
        fields(db.table = "youtube_streams")
    )]
    pub async fn find_missing_video_id(&self, video_ids: &[String]) -> Result<Vec<String>> {
        let ids = sqlx::query!(
            r#"
    select id as "id!"
      from unnest($1::text[]) as id
     where not exists
           (
             select stream_id
             from youtube_streams
             where stream_id = id
           )
            "#,
            video_ids, // $1
        )
        .map(|row| row.id)
        .fetch_all(&self.pool)
        .await?;

        tracing::debug!("video_ids={:?}", video_ids);

        Ok(ids)
    }

    #[instrument(
        name = "Get stream times",
        skip(self),
        fields(db.table = "youtube_streams")
    )]
    pub async fn stream_times(&self, vtuber_id: &str) -> Result<Vec<(i64, i64)>> {
        let streams = sqlx::query!(
            r#"
    select start_time as "start!", end_time as "end!"
      from youtube_streams
     where vtuber_id = $1
       and start_time > (now() - '44 weeks'::interval)
       and end_time is not null
  order by start_time desc
            "#,
            vtuber_id, // $1
        )
        .fetch_all(&self.pool)
        .await?;

        let one_hour: i64 = 60 * 60;

        Ok(streams
            .iter()
            .fold(Vec::<(i64, i64)>::new(), |mut acc, rec| {
                let start = rec.start.timestamp();
                let end = rec.end.timestamp();

                let mut t = start - (start % one_hour);

                while t < end {
                    let duration = min(t + one_hour, end) - max(start, t);

                    match acc.last_mut() {
                        Some(last) if last.0 == t => last.1 += duration,
                        _ => acc.push((t, duration)),
                    }

                    t += one_hour;
                }

                acc
            }))
    }
}
