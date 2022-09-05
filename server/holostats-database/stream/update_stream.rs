use chrono::{DateTime, NaiveDateTime, Utc};
use sqlx::{PgPool, Result};
use tracing::{instrument, Instrument};

type UtcTime = DateTime<Utc>;

use super::StreamStatus;

pub struct UpdateYouTubeStreamQuery<'q> {
    pub stream_id: &'q str,
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
            stream_id: "",
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
    #[instrument(name = "Update youtube streams", skip(self, pool))]
    pub async fn execute(self, pool: &PgPool) -> Result<()> {
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
            self.stream_id,     // $8
        )
        .execute(pool)
        .instrument(crate::otel_span!("UPDATE", "youtube_streams"))
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
            SET value = GREATEST($3, youtube_stream_viewer_statistic.value)
                "#,
                self.stream_id, // $1
                time,           // $2
                viewers,        // $3
            )
            .execute(pool)
            .instrument(crate::otel_span!(
                "INSERT",
                "youtube_stream_viewer_statistic"
            ))
            .await?;
        }

        Ok(())
    }
}

// TODO: unit test with `sqlx::test`

#[cfg(test)]
#[sqlx::test(fixtures("../../../sql/schema"))]
async fn test(pool: PgPool) -> Result<()> {
    use chrono::NaiveDateTime;

    let sql1 = r#"INSERT INTO youtube_channels (vtuber_id) VALUES ('vtuber1');"#;

    let sql2 = r#"
    INSERT INTO youtube_streams (stream_id, title, vtuber_id, schedule_time, start_time, end_time, status)
         VALUES ('id1', 'title1', 'vtuber1', to_timestamp(3000), NULL, NULL, 'ended');
    "#;

    sqlx::query(sql1).execute(&pool).await?;
    sqlx::query(sql2).execute(&pool).await?;

    {
        let dt = UtcTime::from_utc(NaiveDateTime::from_timestamp(3000, 0), Utc);

        UpdateYouTubeStreamQuery {
            stream_id: "id1",
            title: Some("title2"),
            status: Some(StreamStatus::Live),
            start_time: Some(dt),
            ..Default::default()
        }
        .execute(&pool)
        .await?;

        let row = sqlx::query!(
            r#"SELECT title, status::TEXT, schedule_time, start_time, end_time FROM youtube_streams WHERE vtuber_id = 'vtuber1'"#
        )
        .fetch_one(&pool)
        .await?;

        assert_eq!(row.title, "title2");
        assert_eq!(row.status, Some("live".into()));
        assert_eq!(row.start_time, Some(dt));
        assert_eq!(row.end_time, None);
        assert_eq!(row.schedule_time, Some(dt));
    }

    {
        UpdateYouTubeStreamQuery {
            stream_id: "id1",
            likes: Some(200),
            ..Default::default()
        }
        .execute(&pool)
        .await?;

        UpdateYouTubeStreamQuery {
            stream_id: "id1",
            likes: Some(100),
            ..Default::default()
        }
        .execute(&pool)
        .await?;

        let row = sqlx::query!(
            r#"SELECT max_like_count FROM youtube_streams WHERE vtuber_id = 'vtuber1'"#
        )
        .fetch_one(&pool)
        .await?;

        assert_eq!(row.max_like_count, Some(200));
    }

    {
        let rows = sqlx::query!(
            r#"SELECT value, time FROM youtube_stream_viewer_statistic WHERE stream_id = 'id1'"#
        )
        .fetch_all(&pool)
        .await?;

        assert_eq!(rows.len(), 0);

        UpdateYouTubeStreamQuery {
            stream_id: "id1",
            date: UtcTime::from_utc(NaiveDateTime::from_timestamp(5, 0), Utc),
            viewers: Some(5000),
            ..Default::default()
        }
        .execute(&pool)
        .await?;

        UpdateYouTubeStreamQuery {
            stream_id: "id1",
            date: UtcTime::from_utc(NaiveDateTime::from_timestamp(10, 0), Utc),
            viewers: Some(2000),
            ..Default::default()
        }
        .execute(&pool)
        .await?;

        UpdateYouTubeStreamQuery {
            stream_id: "id1",
            date: UtcTime::from_utc(NaiveDateTime::from_timestamp(20, 0), Utc),
            viewers: Some(1000),
            ..Default::default()
        }
        .execute(&pool)
        .await?;

        let rows = sqlx::query!(
            r#"SELECT value, time FROM youtube_stream_viewer_statistic WHERE stream_id = 'id1' ORDER BY time ASC"#
        )
        .fetch_all(&pool)
        .await?;

        assert_eq!(rows.len(), 2);
        assert_eq!(rows[0].value, 5000);
        assert_eq!(rows[0].time.timestamp(), 0);
        assert_eq!(rows[1].value, 1000);
        assert_eq!(rows[1].time.timestamp(), 15);
    }

    Ok(())
}
