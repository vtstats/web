use chrono::{DateTime, Duration, Utc};
use futures_util::TryStreamExt;
use sqlx::{PgPool, Result};
use std::cmp::{max, min};
use tracing::Instrument;

type UtcTime = DateTime<Utc>;

pub struct StreamTimesQuery<'q> {
    pub vtuber_id: &'q str,
    pub start_at: UtcTime,
}

impl<'q> Default for StreamTimesQuery<'q> {
    fn default() -> Self {
        StreamTimesQuery {
            vtuber_id: "",
            start_at: Utc::now() - Duration::weeks(44),
        }
    }
}

impl<'q> StreamTimesQuery<'q> {
    pub async fn execute(self, pool: &PgPool) -> Result<Vec<(i64, i64)>> {
        sqlx::query!(
            r#"
     SELECT start_time AS "start!", end_time AS "end!"
       FROM youtube_streams
      WHERE vtuber_id = $1
        AND start_time > $2
        AND end_time IS NOT NULL
   ORDER BY start_time DESC
            "#,
            self.vtuber_id, // $1
            self.start_at,  // $2
        )
        .fetch(pool)
        .try_fold(Vec::<(i64, i64)>::new(), |mut acc, row| async move {
            let start = row.start.timestamp();
            let end = row.end.timestamp();
            let one_hour: i64 = 60 * 60;

            let mut time = end - (end % one_hour);

            while (start - time) < one_hour {
                let duration = min(time + one_hour, end) - max(start, time);

                match acc.last_mut() {
                    Some(last) if last.0 == time => {
                        last.1 += duration;
                    }
                    _ => acc.push((time, duration)),
                }

                time -= one_hour;
            }

            Ok(acc)
        })
        .instrument(crate::otel_span!("SELECT", "youtube_streams"))
        .await
    }
}

#[cfg(test)]
#[sqlx::test(fixtures("../../../sql/schema"))]
async fn test(pool: PgPool) -> Result<()> {
    use chrono::NaiveDateTime;

    let sql1 = r#"INSERT INTO youtube_channels (vtuber_id) VALUES ('vtuber1');"#;

    let sql2 = r#"
    INSERT INTO youtube_streams (stream_id, title, vtuber_id, schedule_time, start_time, end_time, status)
         VALUES ('id1', 'title1', 'vtuber1', NULL, to_timestamp(1800), to_timestamp(8000), 'ended'),
                ('id2', 'title2', 'vtuber1', NULL, to_timestamp(10000), to_timestamp(12000), 'ended'),
                ('id3', 'title3', 'vtuber1', NULL, to_timestamp(15000), to_timestamp(17000), 'ended');
    "#;

    sqlx::query(sql1).execute(&pool).await?;
    sqlx::query(sql2).execute(&pool).await?;

    let big_bang = DateTime::<Utc>::from_utc(NaiveDateTime::from_timestamp(0, 0), Utc);

    {
        let times = StreamTimesQuery {
            vtuber_id: "vtuber0",
            start_at: big_bang,
        }
        .execute(&pool)
        .await?;

        assert!(times.is_empty());
    }

    {
        let times = StreamTimesQuery {
            vtuber_id: "vtuber1",
            start_at: big_bang,
        }
        .execute(&pool)
        .await?;

        assert_eq!(
            times,
            vec![
                (14400, 2000),
                (10800, 1200),
                (7200, 1600),
                (3600, 3600),
                (0, 1800),
            ]
        );
    }

    Ok(())
}
