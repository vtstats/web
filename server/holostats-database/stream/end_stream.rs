use chrono::{DateTime, Utc};
use sqlx::{PgPool, Result};
use tracing::{instrument, Instrument};

type UtcTime = DateTime<Utc>;

pub struct EndStreamQuery<'q> {
    pub id: &'q str,
    pub date: UtcTime,
}

impl<'q> Default for EndStreamQuery<'q> {
    fn default() -> Self {
        EndStreamQuery {
            id: "",
            date: Utc::now(),
        }
    }
}

impl<'q> EndStreamQuery<'q> {
    #[instrument(name = "End YouTube stream", skip(self, pool))]
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
        .instrument(crate::otel_span!("SELECT", "youtube_streams"))
        .await?;

        if let Some(record) = record {
            match &*record.status {
                "scheduled" => {
                    let _ = sqlx::query!(
                        r#"DELETE FROM youtube_streams WHERE stream_id = $1"#,
                        self.id, // $1
                    )
                    .execute(pool)
                    .instrument(crate::otel_span!("DELETE", "youtube_streams"))
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
                    .instrument(crate::otel_span!("UPDATE", "youtube_streams"))
                    .await?;
                }
                _ => {}
            }
        }

        Ok(())
    }
}

#[cfg(test)]
#[sqlx::test(fixtures("../../../sql/schema"))]
async fn test(pool: PgPool) -> Result<()> {
    use chrono::NaiveDateTime;

    let sql1 = r#"INSERT INTO youtube_channels (vtuber_id) VALUES ('vtuber1');"#;

    let sql2 = r#"
    INSERT INTO youtube_streams (stream_id, title, vtuber_id, schedule_time, start_time, end_time, status)
         VALUES ('id1', 'title1', 'vtuber1', NULL, NULL, NULL, 'live'),
                ('id2', 'title2', 'vtuber1', NULL, NULL, NULL, 'scheduled'),
                ('id3', 'title3', 'vtuber1', NULL, NULL, NULL, 'ended');
    "#;

    sqlx::query(sql1).execute(&pool).await?;
    sqlx::query(sql2).execute(&pool).await?;

    {
        let dt = UtcTime::from_utc(NaiveDateTime::from_timestamp(9000, 0), Utc);

        EndStreamQuery {
            id: "id1",
            date: dt,
        }
        .execute(&pool)
        .await?;

        let row = sqlx::query!(
            r#"SELECT updated_at, status::TEXT, end_time FROM youtube_streams WHERE stream_id = 'id1'"#
        )
        .fetch_one(&pool)
        .await?;

        assert_eq!(row.status, Some("ended".into()));
        assert_eq!(row.end_time, Some(dt));
        assert_eq!(row.updated_at, dt);
    }

    {
        EndStreamQuery {
            id: "id2",
            ..Default::default()
        }
        .execute(&pool)
        .await?;

        let row = sqlx::query!(
            r#"SELECT updated_at, status::TEXT, end_time FROM youtube_streams WHERE stream_id = 'id2'"#
        )
        .fetch_optional(&pool)
        .await?;

        assert!(row.is_none());
    }

    {
        EndStreamQuery {
            id: "id3",
            ..Default::default()
        }
        .execute(&pool)
        .await?;

        let row = sqlx::query!(
            r#"SELECT status::TEXT, end_time FROM youtube_streams WHERE stream_id = 'id3'"#
        )
        .fetch_one(&pool)
        .await?;

        assert_eq!(row.status, Some("ended".into()));
        assert_eq!(row.end_time, None);
    }

    Ok(())
}
