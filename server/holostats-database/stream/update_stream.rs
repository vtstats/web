use chrono::{DateTime, NaiveDateTime, Utc};
use serde::Serialize;
use sqlx::{PgPool, Result};
use tracing::instrument;

type UtcTime = DateTime<Utc>;

#[derive(Debug, sqlx::Type, Serialize, PartialEq, Eq)]
#[sqlx(type_name = "stream_status", rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
pub enum StreamStatus {
    Scheduled,
    Live,
    Ended,
}

pub struct UpdateYouTubeStreamQuery<'q> {
    pub id: &'q str,
    pub title: Option<&'q str>,
    pub status: Option<StreamStatus>,
    pub date: UtcTime,
    pub schedule_time: Option<UtcTime>,
    pub start_time: Option<UtcTime>,
    pub end_time: Option<UtcTime>,
    pub viewers: Option<i32>,
    pub likes: Option<i32>,
}

impl<'q> Default for UpdateYouTubeStreamQuery<'q> {
    fn default() -> Self {
        UpdateYouTubeStreamQuery {
            id: "",
            title: None,
            status: None,
            date: Utc::now(),
            schedule_time: None,
            start_time: None,
            end_time: None,
            viewers: None,
            likes: None,
        }
    }
}

impl<'q> UpdateYouTubeStreamQuery<'q> {
    #[instrument(
        name = "Update youtube streams",
        skip(self, pool),
        fields(db.table = "youtube_streams")
    )]
    pub async fn execute(self, pool: &PgPool) -> Result<()> {
        let mut tx = pool.begin().await?;

        let _ = sqlx::query!(
            r#"
     UPDATE youtube_streams
        SET title          = COALESCE($1, title),
            updated_at     = COALESCE($2, updated_at),
            status         = COALESCE($3, status),
            schedule_time  = COALESCE($4, schedule_time),
            start_time     = COALESCE($5, start_time),
            end_time       = COALESCE($6, end_time),
            max_like_count = GREATEST($7, max_like_count)
      WHERE stream_id      = $8
            "#,
            self.title,         // $1
            self.date,          // $2
            self.status: _,     // $3
            self.schedule_time, // $4
            self.start_time,    // $5
            self.end_time,      // $6
            self.likes,         // $7
            self.id,            // $7
        )
        .execute(&mut tx)
        .await?;

        if let Some(viewers) = self.viewers {
            // TODO: deprecating `update_youtube_streams_viewer_count` trigger

            let time = {
                let mut timestamp = self.date.timestamp();
                timestamp -= timestamp % 15;
                let dt = NaiveDateTime::from_timestamp(timestamp, 0);
                DateTime::<Utc>::from_utc(dt, Utc)
            };

            let _ = sqlx::query!(
                r#"
    INSERT INTO youtube_stream_viewer_statistic (stream_id, time, value)
         VALUES ($1, $2, $3)
    ON CONFLICT (stream_id, time) DO UPDATE
            SET value = GREATEST($3, excluded.value)
                "#,
                self.id, // $1
                time,    // $2
                viewers, // $3
            )
            .execute(&mut tx)
            .await?;
        }

        tx.commit().await?;

        Ok(())
    }
}

// TODO: unit test with `sqlx::test`
