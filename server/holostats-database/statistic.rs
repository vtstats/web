use chrono::{serde::ts_milliseconds, DateTime, Utc};
use serde::Serialize;
use sqlx::Result;
use tracing::instrument;

use super::Database;

type UtcTime = DateTime<Utc>;

pub struct Statistic {
    pub id: String,
    pub time: UtcTime,
    pub value: i32,
}

#[derive(serde::Serialize)]
pub struct Timestamp(#[serde(with = "ts_milliseconds")] UtcTime);

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Report {
    pub id: String,
    pub kind: String,
    pub rows: Vec<(Timestamp, i32)>,
}

fn generate_report(rows: Vec<Statistic>, kind: &str) -> Vec<Report> {
    let mut reports = Vec::<Report>::new();

    for row in rows {
        let last = reports.last_mut();
        if let Some(report) = last.filter(|report| report.id == row.id) {
            report.rows.push((Timestamp(row.time), row.value));
        } else {
            reports.push(Report {
                id: row.id.to_string(),
                kind: kind.to_string(),
                rows: Vec::new(),
            })
        }
    }

    reports
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
    ) -> Result<Vec<Report>> {
        sqlx::query_as!(
            Statistic,
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
        .fetch_all(&self.pool)
        .await
        .map(|rows| generate_report(rows, "youtube_channel_subscriber"))
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
    ) -> Result<Vec<Report>> {
        sqlx::query_as!(
            Statistic,
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
        .fetch_all(&self.pool)
        .await
        .map(|rows| generate_report(rows, "youtube_channel_view"))
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
    ) -> Result<Vec<Report>> {
        sqlx::query_as!(
            Statistic,
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
        .fetch_all(&self.pool)
        .await
        .map(|rows| generate_report(rows, "bilibili_channel_subscriber"))
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
    ) -> Result<Vec<Report>> {
        sqlx::query_as!(
            Statistic,
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
        .fetch_all(&self.pool)
        .await
        .map(|rows| generate_report(rows, "bilibili_channel_view"))
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
    ) -> Result<Vec<Report>> {
        sqlx::query_as!(
            Statistic,
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
        .fetch_all(&self.pool)
        .await
        .map(|rows| generate_report(rows, "youtube_stream_viewer"))
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
    ) -> Result<Vec<Report>> {
        sqlx::query_as!(
            Statistic,
            r#"
      select stream_id as id, time, message_count as value
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
        .fetch_all(&self.pool)
        .await
        .map(|rows| generate_report(rows, "youtube_live_chat_message"))
    }

    #[instrument(
        name = "Select youtube_live_chat_statistic",
        skip(self),
        fields(db.table = "youtube_live_chat_statistic"),
    )]
    pub async fn youtube_live_chat_message_from_member(
        &self,
        ids: &[String],
        start_at: &Option<UtcTime>,
        end_at: &Option<UtcTime>,
    ) -> Result<Vec<Report>> {
        sqlx::query_as!(
            Statistic,
            r#"
      select stream_id as id, time, message_from_member_count as value
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
        .fetch_all(&self.pool)
        .await
        .map(|rows| generate_report(rows, "youtube_live_chat_message_from_member"))
    }
}
