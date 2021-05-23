use chrono::serde::ts_milliseconds;
use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::Result;
use tracing::instrument;

use super::Database;

type UtcTime = DateTime<Utc>;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Channel {
    pub kind: String,
    pub vtuber_id: String,
    pub subscriber_count: i32,
    pub daily_subscriber_count: i32,
    pub weekly_subscriber_count: i32,
    pub monthly_subscriber_count: i32,
    pub view_count: i32,
    pub daily_view_count: i32,
    pub weekly_view_count: i32,
    pub monthly_view_count: i32,
    #[serde(with = "ts_milliseconds")]
    pub updated_at: UtcTime,
}

impl Database {
    #[instrument(
        name = "Select from youtube_channels",
        skip(self, ids),
        fields(db.table = "youtube_channels")
    )]
    pub async fn youtube_channels(&self, ids: &[String]) -> Result<Vec<Channel>> {
        sqlx::query_as!(
            Channel,
            r#"
    select 'youtube' as "kind!",
           vtuber_id,
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
     where vtuber_id = any($1)
            "#,
            &ids
        )
        .fetch_all(&self.pool)
        .await
    }

    #[instrument(
        name = "Get last updated time of youtube_channels",
        skip(self),
        fields(db.table = "youtube_channels")
    )]
    pub async fn youtube_channel_last_updated(&self) -> Result<Option<UtcTime>> {
        sqlx::query!("select max(updated_at) from youtube_channels")
            .fetch_one(&self.pool)
            .await
            .map(|row| row.max)
    }

    #[instrument(
        name = "Select from bilibili_channels",
        skip(self, ids),
        fields(db.table = "bilibili_channels")
    )]
    pub async fn bilibili_channels(&self, ids: &[String]) -> Result<Vec<Channel>> {
        sqlx::query_as!(
            Channel,
            r#"
    select 'bilibili' as "kind!",
           vtuber_id,
           subscriber_count,
           daily_subscriber_count,
           weekly_subscriber_count,
           monthly_subscriber_count,
           view_count,
           daily_view_count,
           weekly_view_count,
           monthly_view_count,
           updated_at
      from bilibili_channels
     where vtuber_id = any($1)
            "#,
            &ids
        )
        .fetch_all(&self.pool)
        .await
    }

    #[instrument(
        name = "Get last updated time of bilibili_channels",
        skip(self),
        fields(db.table = "bilibili_channels")
    )]
    pub async fn bilibili_channel_last_updated(&self) -> Result<Option<UtcTime>> {
        sqlx::query!("select max(updated_at) from bilibili_channels")
            .fetch_one(&self.pool)
            .await
            .map(|row| row.max)
    }

    pub async fn update_bilibili_channel_statistic(
        &self,
        vtuber_id: &str,
        datetime: UtcTime,
        view_count: i32,
        subscriber_count: i32,
    ) -> Result<()> {
        let mut tx = self.pool.begin().await?;

        let _ = sqlx::query!(
            r#"
    update bilibili_channels
       set (subscriber_count, view_count, updated_at)
         = ($1, $2, $3)
     where vtuber_id = $4
            "#,
            subscriber_count,
            view_count,
            datetime,
            vtuber_id,
        )
        .execute(&mut tx)
        .await?;

        let _ = sqlx::query!(
            r#"
    insert into bilibili_channel_subscriber_statistic (vtuber_id, time, value)
         values ($1, $2, $3)
            "#,
            vtuber_id,
            datetime,
            subscriber_count,
        )
        .execute(&mut tx)
        .await?;

        let _ = sqlx::query!(
            r#"
    insert into bilibili_channel_view_statistic (vtuber_id, time, value)
         values ($1, $2, $3)
            "#,
            vtuber_id,
            datetime,
            view_count,
        )
        .execute(&mut tx)
        .await?;

        tx.commit().await?;

        Ok(())
    }

    pub async fn update_youtube_channel_statistic(
        &self,
        vtuber_id: &str,
        datetime: UtcTime,
        view_count: i32,
        subscriber_count: i32,
    ) -> Result<()> {
        let mut tx = self.pool.begin().await?;

        let _ = sqlx::query!(
            r#"
    update youtube_channels
       set (subscriber_count, view_count, updated_at)
         = ($1, $2, $3)
     where vtuber_id = $4
            "#,
            subscriber_count,
            view_count,
            datetime,
            vtuber_id,
        )
        .execute(&mut tx)
        .await?;

        let _ = sqlx::query!(
            r#"
    insert into youtube_channel_subscriber_statistic (vtuber_id, time, value)
         values ($1, $2, $3)
            "#,
            vtuber_id,
            datetime,
            subscriber_count,
        )
        .execute(&mut tx)
        .await?;

        let _ = sqlx::query!(
            r#"
    insert into youtube_channel_view_statistic (vtuber_id, time, value)
         values ($1, $2, $3)
            "#,
            vtuber_id,
            datetime,
            view_count,
        )
        .execute(&mut tx)
        .await?;

        tx.commit().await?;

        Ok(())
    }
}
