use chrono::{DateTime, Utc};
use sqlx::{PgPool, Result};
use tracing::instrument;

type UtcTime = DateTime<Utc>;

pub struct EndStreamQuery<'q> {
    pub id: &'q str,
    pub date: UtcTime,
}

impl<'q> EndStreamQuery<'q> {
    #[instrument(
        name = "End YouTube stream",
        skip(self, pool),
        fields(db.table = "youtube_streams"),
    )]
    pub async fn execute(&self, pool: &PgPool) -> Result<()> {
        let record = sqlx::query!(
            r#"
     SELECT status::TEXT as "status!" 
       FROM youtube_streams
      WHERE stream_id = $1
            "#,
            self.id
        )
        .fetch_optional(pool)
        .await?;

        if let Some(record) = record {
            match &*record.status {
                "scheduled" => {
                    let _ = sqlx::query!(
                        r#"DELETE FROM youtube_streams WHERE stream_id = $1"#,
                        self.id, // $1
                    )
                    .execute(pool)
                    .await?;
                }
                "live" => {
                    let _ = sqlx::query!(
                        r#"
                 UPDATE youtube_streams
                    SET end_time   = $1,
                        updated_at = $1,
                        status     = 'ended'::stream_status
                  WHERE stream_id  = $2
                        "#,
                        self.date, // $1
                        self.id,   // $2
                    )
                    .execute(pool)
                    .await?;
                }
                _ => {}
            }
        }

        Ok(())
    }
}

// TODO: unit test with `sqlx::test`
