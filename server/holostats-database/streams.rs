use sqlx::Result;

use tracing::instrument;

use super::Database;

impl Database {
    pub async fn stream_ids(&self) -> Result<Vec<String>> {
        sqlx::query!(r#"select stream_id from youtube_streams"#)
            .map(|row| row.stream_id)
            .fetch_all(&self.pool)
            .await
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
}
