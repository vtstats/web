use chrono::{serde::ts_milliseconds, DateTime, Utc};
use serde::Serialize;
use sqlx::Result;
use tracing::instrument;

use super::Database;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PaidMessage {
    amount: String,
    #[serde(with = "ts_milliseconds")]
    time: DateTime<Utc>,
    #[serde(rename = "type")]
    ty: Option<String>,
    color: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MemberMessage {
    #[serde(with = "ts_milliseconds")]
    time: DateTime<Utc>,
    #[serde(rename = "type")]
    ty: Option<String>,
}

impl Database {
    #[instrument(
        name = "insert youtube_live_chat_statistic",
        skip(self, times, message_counts, message_from_member_counts),
        fields(db.table = "youtube_live_chat_statistic"),
    )]
    pub async fn insert_live_chat_statistic(
        &self,
        stream_id: String,
        times: Vec<DateTime<Utc>>,
        message_counts: Vec<i32>,
        message_from_member_counts: Vec<i32>,
    ) -> Result<()> {
        let _res = sqlx::query!(
            r#"
 insert into youtube_live_chat_statistic as t
             (
               stream_id,
               time,
               message_count,
               message_from_member_count
             )
      select $1,
             unnest($2::TIMESTAMPTZ[]),
             unnest($3::INTEGER[]),
             unnest($4::INTEGER[])
 on conflict (stream_id, time) do update
         set (message_count, message_from_member_count)
           = (
               t.message_count + excluded.message_count,
               t.message_from_member_count + excluded.message_from_member_count
              )
            "#,
            stream_id,                   // $1
            &times,                      // $2
            &message_counts,             // $3
            &message_from_member_counts  // $4
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    #[instrument(
        name = "insert live_chat_paid_messages",
        skip(self, types, amounts, author_names, author_channel_ids, times, texts, badges, colors),
        fields(db.table = "youtube_live_chat_paid_messages"),
    )]
    pub async fn insert_live_chat_paid_messages(
        &self,
        stream_id: String,
        types: Vec<String>,
        amounts: Vec<String>,
        author_names: Vec<String>,
        author_channel_ids: Vec<String>,
        times: Vec<DateTime<Utc>>,
        texts: Vec<String>,
        badges: Vec<String>,
        colors: Vec<String>,
    ) -> Result<()> {
        let _res = sqlx::query!(
            r#"
 insert into youtube_live_chat_paid_messages
             (
               stream_id,
               type,
               amount,
               author_name,
               author_channel_id,
               time,
               text,
               badges,
               color
             )
      select $1,
             unnest($2::TEXT[]::paid_message_type[]),
             unnest($3::TEXT[]),
             unnest($4::TEXT[]),
             unnest($5::TEXT[]),
             unnest($6::TIMESTAMPTZ[]),
             unnest($7::TEXT[]),
             unnest($8::TEXT[]),
             unnest($9::TEXT[])
            "#,
            stream_id,           // $1
            &types,              // $2
            &amounts,            // $3
            &author_names,       // $4
            &author_channel_ids, // $5
            &times,              // $6
            &texts,              // $7
            &badges,             // $8
            &colors              // $9
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    #[instrument(
        name = "insert live_chat_member_messages",
        skip(self, types, author_names, author_channel_ids, times, texts, badges),
        fields(db.table = "youtube_live_chat_member_messages"),
    )]
    pub async fn insert_live_chat_member_messages(
        &self,
        stream_id: String,
        types: Vec<String>,
        author_names: Vec<String>,
        author_channel_ids: Vec<String>,
        times: Vec<DateTime<Utc>>,
        texts: Vec<String>,
        badges: Vec<String>,
    ) -> Result<()> {
        let _res = sqlx::query!(
            r#"
 insert into youtube_live_chat_member_messages
             (
               stream_id,
               type,
               author_name,
               author_channel_id,
               time,
               text,
               badges
             )
      select $1,
             unnest($2::TEXT[]::member_message_type[]),
             unnest($3::TEXT[]),
             unnest($4::TEXT[]),
             unnest($5::TIMESTAMPTZ[]),
             unnest($6::TEXT[]),
             unnest($7::TEXT[])
            "#,
            stream_id,           // $1
            &types,              // $2
            &author_names,       // $3
            &author_channel_ids, // $4
            &times,              // $5
            &texts,              // $6
            &badges              // $7
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    #[instrument(
        name = "select live_chat_paid_messages",
        skip(self),
        fields(db.table = "youtube_live_chat_paid_messages"),
    )]
    pub async fn select_paid_messages(&self, stream_id: &str) -> Result<Vec<PaidMessage>> {
        sqlx::query_as!(
            PaidMessage,
            r#"
      select type::TEXT as ty,
             amount,
             color,
             time
        from youtube_live_chat_paid_messages
       where stream_id = $1
            "#,
            stream_id
        )
        .fetch_all(&self.pool)
        .await
    }

    #[instrument(
        name = "select live_chat_member_messages",
        skip(self),
        fields(db.table = "youtube_live_chat_member_messages"),
    )]
    pub async fn select_member_messages(&self, stream_id: &str) -> Result<Vec<MemberMessage>> {
        sqlx::query_as!(
            MemberMessage,
            r#"
      select type::TEXT as ty, time
        from youtube_live_chat_member_messages
       where stream_id = $1
            "#,
            stream_id
        )
        .fetch_all(&self.pool)
        .await
    }
}
