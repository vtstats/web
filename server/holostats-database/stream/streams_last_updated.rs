use chrono::{DateTime, Utc};
use sqlx::{PgPool, Result};
use tracing::Instrument;

type UtcTime = DateTime<Utc>;

pub struct YouTubeStreamsLastUpdated {}

impl YouTubeStreamsLastUpdated {
    pub async fn execute(self, pool: &PgPool) -> Result<Option<UtcTime>> {
        sqlx::query!("SELECT MAX(updated_at) from youtube_streams")
            .fetch_one(pool)
            .instrument(crate::otel_span!("SELECT", "youtube_streams"))
            .await
            .map(|row| row.max)
    }
}

#[cfg(test)]
#[sqlx::test(fixtures("../../../sql/schema"))]
async fn test(pool: PgPool) -> Result<()> {
    use chrono::NaiveDateTime;

    assert_eq!(YouTubeStreamsLastUpdated {}.execute(&pool).await?, None);

    let sql1 = r#"INSERT INTO youtube_channels (vtuber_id) VALUES ('vtuber1');"#;

    let sql2 = r#"
    INSERT INTO youtube_streams (stream_id, title, vtuber_id, schedule_time, start_time, end_time, updated_at, status)
         VALUES ('id1', 'title1', 'vtuber1', NULL, NULL, NULL, to_timestamp(1000), 'ended'),
                ('id2', 'title2', 'vtuber1', NULL, NULL, NULL, to_timestamp(3000), 'ended'),
                ('id3', 'title3', 'vtuber1', NULL, NULL, NULL, to_timestamp(2000), 'ended');
    "#;

    sqlx::query(sql1).execute(&pool).await?;
    sqlx::query(sql2).execute(&pool).await?;

    assert_eq!(
        YouTubeStreamsLastUpdated {}.execute(&pool).await?,
        Some(UtcTime::from_utc(
            NaiveDateTime::from_timestamp(3000, 0),
            Utc
        ))
    );

    Ok(())
}
