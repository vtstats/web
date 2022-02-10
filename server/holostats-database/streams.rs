use chrono::{
    serde::{ts_milliseconds, ts_milliseconds_option},
    DateTime, Utc,
};
use serde::Serialize;
use serde_with::skip_serializing_none;
use sqlx::Result;
use std::cmp::{max, min};
use tracing::instrument;

use super::Database;

type UtcTime = DateTime<Utc>;

#[skip_serializing_none]
#[derive(Debug, Serialize)]
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

impl OrderBy {
    fn as_str(&self) -> &'static str {
        match self {
            OrderBy::StartTimeAsc => "start_time:asc",
            OrderBy::EndTimeAsc => "end_time:asc",
            OrderBy::ScheduleTimeAsc => "schedule_time:asc",
            OrderBy::StartTimeDesc => "start_time:desc",
            OrderBy::EndTimeDesc => "end_time:desc",
            OrderBy::ScheduleTimeDesc => "schedule_time:desc",
        }
    }
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
        sqlx::query_as!(
            Stream,
            r#"
      select stream_id,
             title,
             vtuber_id,
             thumbnail_url,
             schedule_time,
             start_time,
             end_time,
             average_viewer_count,
             max_viewer_count,
             max_like_count,
             updated_at,
             status as "status: _"
        from youtube_streams
       where vtuber_id = any($1)
         and status::text = any($5)
         and (
               -- start_at
               case $4
                 when 'schedule_time:asc'  then schedule_time > $2
                 when 'schedule_time:desc' then schedule_time > $2
                 when 'end_time:asc'       then end_time      > $2
                 when 'end_time:desc'      then end_time      > $2
                 when 'start_time:asc'     then start_time    > $2
                 when 'start_time:desc'    then start_time    > $2
               end
               or $2 is null
             )
         and (
               -- end_at
               case $4
                 when 'schedule_time:asc'  then schedule_time < $3
                 when 'schedule_time:desc' then schedule_time < $3
                 when 'end_time:asc'       then end_time      < $3
                 when 'end_time:desc'      then end_time      < $3
                 when 'start_time:asc'     then start_time    < $3
                 when 'start_time:desc'    then start_time    < $3
               end
               or $3 is null
             )
    order by case $4
               when 'start_time:asc'     then start_time
               when 'end_time:asc'       then end_time
               when 'schedule_time:asc'  then schedule_time
               else null
             end asc,
             case $4
               when 'start_time:desc'    then start_time
               when 'end_time:desc'      then end_time
               when 'schedule_time:desc' then schedule_time
               else null
             end desc
       limit 24
            "#,
            ids,
            *start_at,
            *end_at,
            order_by.as_str(),
            status,
        )
        .fetch_all(&self.pool)
        .await
    }

    #[instrument(
        name = "Select youtube streams",
        skip(self),
        fields(db.table = "youtube_streams"),
    )]
    pub async fn youtube_streams_by_ids(&self, ids: &[String]) -> Result<Vec<Stream>> {
        sqlx::query_as!(
            Stream,
            r#"
    select stream_id,
           title,
           vtuber_id,
           thumbnail_url,
           schedule_time,
           start_time,
           end_time,
           average_viewer_count,
           max_viewer_count,
           max_like_count,
           updated_at,
           status as "status: _"
      from youtube_streams
     where stream_id = any($1)
            "#,
            ids
        )
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
            id,
            vtuber_id,
            title,
            status: _,
            thumbnail_url,
            schedule_time,
            start_time,
            end_time,
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
            stream_id,
            vtuber_id,
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
        name = "Get youtube ongoing streams",
        skip(self),
        fields(db.table = "youtube_streams")
    )]
    pub async fn youtube_ongoing_streams(&self) -> Result<Vec<String>> {
        sqlx::query!(
            r#"
    select stream_id
      from youtube_streams
     where end_time IS NULL
       and (
             start_time is not null or (
               schedule_time > now() - interval '6 hours'
               and schedule_time < now() + interval '5 minutes'
             )
           )
            "#
        )
        .map(|row| row.stream_id)
        .fetch_all(&self.pool)
        .await
    }

    #[instrument(
        name = "Terminate offline YouTube streams",
        skip(self),
        fields(db.table = "youtube_streams"),
    )]
    pub async fn terminate_stream(&self, ids: &[String], now: DateTime<Utc>) -> Result<()> {
        let streams = self.youtube_streams_by_ids(ids).await?;

        {
            let ids = streams
                .iter()
                .filter(|stream| stream.status == StreamStatus::Scheduled)
                .map(|stream| stream.stream_id.clone())
                .collect::<Vec<_>>();

            let _ = sqlx::query!(
                r#"delete from youtube_streams where stream_id = any($1)"#,
                &ids, // $1
            )
            .execute(&self.pool)
            .await?;
        }

        {
            let ids = streams
                .iter()
                .filter(|stream| stream.status == StreamStatus::Live)
                .map(|stream| stream.stream_id.clone())
                .collect::<Vec<_>>();

            let _ = sqlx::query!(
                r#"
         update youtube_streams
            set (end_time, updated_at, status)
              = ($1, $1, 'ended'::stream_status)
          where stream_id = any($2)
                "#,
                now,  // $1
                &ids, // $2
            )
            .execute(&self.pool)
            .await?;
        }

        Ok(())
    }

    pub async fn update_youtube_stream_statistic(
        &self,
        id: String,
        title: String,
        datetime: UtcTime,
        status: StreamStatus,
        schedule_time: Option<UtcTime>,
        start_time: Option<UtcTime>,
        end_time: Option<UtcTime>,
        viewers: Option<i32>,
        likes: Option<i32>,
    ) -> Result<()> {
        let mut tx = self.pool.begin().await?;

        let _ = sqlx::query!(
            r#"
    update youtube_streams
       set (
             title,
             updated_at,
             status,
             schedule_time,
             start_time,
             end_time,
             max_like_count
           )
         = (
             $1,
             $2,
             $3,
             $4,
             $5,
             $6,
             greatest(youtube_streams.max_like_count, $7)
           )
     where stream_id = $8
            "#,
            title,         // $1
            datetime,      // $2
            status: _,     // $3
            schedule_time, // $4
            start_time,    // $5
            end_time,      // $6
            likes,         // $7
            id,            // $8
        )
        .execute(&mut tx)
        .await?;

        if let Some(likes) = likes {
            let _ = sqlx::query!(
                r#"
    insert into youtube_stream_like_statistic (stream_id, time, value)
         values ($1, $2, $3)
                "#,
                id,       // $1
                datetime, // $2
                likes,    // $3
            )
            .execute(&mut tx)
            .await?;
        }

        if let Some(viewers) = viewers {
            let _ = sqlx::query!(
                r#"
    insert into youtube_stream_viewer_statistic (stream_id, time, value)
         values ($1, $2, $3)
                "#,
                id,       // $1
                datetime, // $2
                viewers,  // $3
            )
            .execute(&mut tx)
            .await?;
        }

        tx.commit().await?;

        Ok(())
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
            video_ids
        )
        .map(|row| row.id)
        .fetch_all(&self.pool)
        .await?;

        tracing::info!(video_ids = ?ids);

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
            vtuber_id
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
