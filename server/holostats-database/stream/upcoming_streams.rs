use sqlx::{PgPool, Result};
use tracing::{instrument, Instrument};

pub struct GetUpcomingStreamsQuery;

#[derive(Debug, PartialEq, Eq)]
pub struct UpcomingStream {
    pub stream_id: String,
    pub vtuber_id: String,
}

impl GetUpcomingStreamsQuery {
    #[instrument(name = "Get youtube upcoming streams", skip(self, pool))]
    pub async fn execute(self, pool: &PgPool) -> Result<Vec<UpcomingStream>> {
        sqlx::query_as!(
            UpcomingStream,
            r#"
     SELECT stream_id, vtuber_id
       FROM youtube_streams
      WHERE end_time IS NULL
        AND (
              start_time IS NOT NULL OR (
                schedule_time > NOW() - INTERVAL '6 hours'
                and schedule_time < NOW() + INTERVAL '5 minutes'
              )
            )
            "#
        )
        .fetch_all(pool)
        .instrument(crate::otel_span!("SELECT", "youtube_streams"))
        .await
    }
}

#[cfg(test)]
#[sqlx::test(fixtures("../../../sql/schema"))]
async fn test(pool: PgPool) -> Result<()> {
    let sql1 = r#"
    INSERT INTO youtube_channels (vtuber_id)
         VALUES ('vtuber1'), ('vtuber2'), ('vtuber3'),
                ('vtuber4'), ('vtuber5'), ('vtuber6');
    "#;

    let sql2 = r#"
    INSERT INTO youtube_streams (stream_id, title, vtuber_id, schedule_time, start_time, end_time, status)
         VALUES ('id1', 'title1', 'vtuber1', NULL, NOW() - INTERVAL '30m', NULL, 'live'),
                ('id2', 'title2', 'vtuber2', NULL, NULL, NOW() - INTERVAL '30m', 'live'),
                ('id3', 'title3', 'vtuber3', NOW() + INTERVAL '4m', NULL, NULL, 'live'),
                ('id4', 'title4', 'vtuber4', NOW() + INTERVAL '6m', NULL, NULL, 'live'),
                ('id5', 'title5', 'vtuber5', NOW() - INTERVAL '5h', NULL, NULL, 'live'),
                ('id6', 'title6', 'vtuber6', NOW() - INTERVAL '7h', NULL, NULL, 'live');
    "#;

    sqlx::query(sql1).execute(&pool).await?;
    sqlx::query(sql2).execute(&pool).await?;

    let streams = GetUpcomingStreamsQuery.execute(&pool).await?;

    assert_eq!(
        streams,
        vec![
            UpcomingStream {
                stream_id: "id1".into(),
                vtuber_id: "vtuber1".into()
            },
            UpcomingStream {
                stream_id: "id3".into(),
                vtuber_id: "vtuber3".into()
            },
            UpcomingStream {
                stream_id: "id5".into(),
                vtuber_id: "vtuber5".into()
            },
        ]
    );

    Ok(())
}
