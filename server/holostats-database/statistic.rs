use chrono::{serde::ts_milliseconds, DateTime, Utc};
use futures_util::TryStreamExt;
use serde::Serialize;
use sqlx::Result;
use tracing::instrument;

use super::Database;

type UtcTime = DateTime<Utc>;

#[derive(serde::Serialize)]
pub struct Timestamp(#[serde(with = "ts_milliseconds")] DateTime<Utc>);

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Report<T> {
    pub id: String,
    pub kind: String,
    pub rows: Vec<T>,
}

pub type Reports<T> = Vec<Report<T>>;

macro_rules! collect_report {
    ($kind:expr, $reports:expr, $id:expr, $row:expr) => {
        async move {
            let last = $reports.last_mut();
            if let Some(report) = last.filter(|report| report.id == $id) {
                report.rows.push($row);
            } else {
                $reports.push(Report {
                    id: $id.to_string(),
                    kind: $kind.to_string(),
                    rows: Vec::new(),
                })
            }
            Ok($reports)
        }
    };
}

impl Database {
    #[instrument(
        name = "select youtube_channel_subscriber_statistic",
        skip(self),
        fields(db.table = "youtube_channel_subscriber_statistic"),
    )]
    pub async fn youtube_channel_subscriber(
        &self,
        ids: &[String],
        start_at: &Option<UtcTime>,
        end_at: &Option<UtcTime>,
    ) -> Result<Reports<(Timestamp, i32)>> {
        sqlx::query!(
            r#"
      select vtuber_id as id, time, value
        from youtube_channel_subscriber_statistic
       where vtuber_id = any($1)
         and (time >= $2 or $2 is null)
         and (time <= $3 or $3 is null)
    order by vtuber_id
            "#,
            ids,
            *start_at,
            *end_at
        )
        .fetch(&self.pool)
        .try_fold(Vec::<Report<_>>::new(), |mut acc, row| {
            collect_report!(
                "youtube_channel_subscriber",
                acc,
                row.id,
                (Timestamp(row.time), row.value)
            )
        })
        .await
    }

    #[instrument(
        name = "select youtube_channel_view_statistic",
        skip(self),
        fields(db.table = "youtube_channel_view_statistic"),
    )]
    pub async fn youtube_channel_view(
        &self,
        ids: &[String],
        start_at: &Option<UtcTime>,
        end_at: &Option<UtcTime>,
    ) -> Result<Reports<(Timestamp, i32)>> {
        sqlx::query!(
            r#"
      select vtuber_id as id, time, value
        from youtube_channel_view_statistic
       where vtuber_id = any($1)
         and (time >= $2 or $2 is null)
         and (time <= $3 or $3 is null)
    order by vtuber_id
            "#,
            ids,
            *start_at,
            *end_at
        )
        .fetch(&self.pool)
        .try_fold(Vec::<Report<_>>::new(), |mut acc, row| {
            collect_report!(
                "youtube_channel_view",
                acc,
                row.id,
                (Timestamp(row.time), row.value)
            )
        })
        .await
    }

    #[instrument(
        name = "select bilibili_channel_subscriber_statistic",
        skip(self),
        fields(db.table = "bilibili_channel_subscriber_statistic"),
    )]
    pub async fn bilibili_channel_subscriber(
        &self,
        ids: &[String],
        start_at: &Option<UtcTime>,
        end_at: &Option<UtcTime>,
    ) -> Result<Reports<(Timestamp, i32)>> {
        sqlx::query!(
            r#"
      select vtuber_id as id, time, value
        from bilibili_channel_subscriber_statistic
       where vtuber_id = any($1)
         and (time >= $2 or $2 is null)
         and (time <= $3 or $3 is null)
    order by vtuber_id
            "#,
            ids,
            *start_at,
            *end_at
        )
        .fetch(&self.pool)
        .try_fold(Vec::<Report<_>>::new(), |mut acc, row| {
            collect_report!(
                "bilibili_channel_subscriber",
                acc,
                row.id,
                (Timestamp(row.time), row.value)
            )
        })
        .await
    }

    #[instrument(
        name = "select bilibili_channel_view_statistic",
        skip(self),
        fields(db.table = "bilibili_channel_view_statistic"),
    )]
    pub async fn bilibili_channel_view(
        &self,
        ids: &[String],
        start_at: &Option<UtcTime>,
        end_at: &Option<UtcTime>,
    ) -> Result<Reports<(Timestamp, i32)>> {
        sqlx::query!(
            r#"
      select vtuber_id as id, time, value
        from bilibili_channel_view_statistic
       where vtuber_id = any($1)
         and (time >= $2 or $2 is null)
         and (time <= $3 or $3 is null)
    order by vtuber_id
            "#,
            ids,
            *start_at,
            *end_at,
        )
        .fetch(&self.pool)
        .try_fold(Vec::<Report<_>>::new(), |mut acc, row| {
            collect_report!(
                "bilibili_channel_view",
                acc,
                row.id,
                (Timestamp(row.time), row.value)
            )
        })
        .await
    }

    #[instrument(
        name = "Select youtube_stream_viewer_statistic",
        skip(self),
        fields(db.table = "youtube_stream_viewer_statistic"),
    )]
    pub async fn youtube_stream_viewer(
        &self,
        ids: &[String],
        start_at: &Option<UtcTime>,
        end_at: &Option<UtcTime>,
    ) -> Result<Reports<(Timestamp, i32)>> {
        sqlx::query!(
            r#"
      select stream_id as id, time, value
        from youtube_stream_viewer_statistic
       where stream_id = any($1)
         and (time >= $2 or $2 is null)
         and (time <= $3 or $3 is null)
    order by stream_id
            "#,
            ids,
            *start_at,
            *end_at
        )
        .fetch(&self.pool)
        .try_fold(Vec::<Report<_>>::new(), |mut acc, row| {
            collect_report!(
                "youtube_stream_viewer",
                acc,
                row.id,
                (Timestamp(row.time), row.value)
            )
        })
        .await
    }

    #[instrument(
        name = "Select youtube_live_chat_statistic",
        skip(self),
        fields(db.table = "youtube_live_chat_statistic"),
    )]
    pub async fn youtube_live_chat_message(
        &self,
        ids: &[String],
        start_at: &Option<UtcTime>,
        end_at: &Option<UtcTime>,
    ) -> Result<Reports<(Timestamp, i32, i32)>> {
        sqlx::query!(
            r#"
      select stream_id as id, time, message_count, message_from_member_count
        from youtube_live_chat_statistic
       where stream_id = any($1)
         and (time >= $2 or $2 is null)
         and (time <= $3 or $3 is null)
    order by stream_id, time asc
            "#,
            ids,
            *start_at,
            *end_at
        )
        .fetch(&self.pool)
        .try_fold(Vec::<Report<_>>::new(), |mut acc, row| {
            collect_report!(
                "youtube_live_chat",
                acc,
                row.id,
                (
                    Timestamp(row.time),
                    row.message_count,
                    row.message_from_member_count,
                )
            )
        })
        .await
    }
}
