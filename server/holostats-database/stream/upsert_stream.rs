use chrono::{DateTime, Utc};
use sqlx::{PgPool, Result};
use tracing::{instrument, Instrument};

use super::StreamStatus;

type UtcTime = DateTime<Utc>;

pub struct UpsertYouTubeStreamQuery<'q> {
    pub stream_id: &'q str,
    pub vtuber_id: &'q str,
    pub title: &'q str,
    pub status: StreamStatus,

    pub thumbnail_url: Option<String>,
    pub schedule_time: Option<UtcTime>,
    pub start_time: Option<UtcTime>,
    pub end_time: Option<UtcTime>,
}

impl<'q> Default for UpsertYouTubeStreamQuery<'q> {
    fn default() -> Self {
        UpsertYouTubeStreamQuery {
            stream_id: "",
            vtuber_id: "",
            title: "",
            status: StreamStatus::Scheduled,
            thumbnail_url: None,
            schedule_time: None,
            start_time: None,
            end_time: None,
        }
    }
}

impl<'q> UpsertYouTubeStreamQuery<'q> {
    #[instrument(name = "Upsert youtube streams", skip(self, pool))]
    pub async fn execute(self, pool: &PgPool) -> Result<()> {
        let _ = sqlx::query!(
            r#"
INSERT INTO youtube_streams AS t (stream_id, vtuber_id, title, status, thumbnail_url, schedule_time, start_time, end_time)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (stream_id) DO UPDATE
        SET title          = COALESCE($3, t.title),
            status         = COALESCE($4, t.status),
            thumbnail_url  = COALESCE($5, t.thumbnail_url),
            schedule_time  = COALESCE($6, t.schedule_time),
            start_time     = COALESCE($7, t.start_time),
            end_time       = COALESCE($8, t.end_time)
            "#,
            self.stream_id,     // $1
            self.vtuber_id,     // $2
            self.title,         // $3
            self.status: _,     // $4
            self.thumbnail_url, // $5
            self.schedule_time, // $6
            self.start_time,    // $7
            self.end_time,      // $8
        )
        .execute(pool)
        .instrument(crate::otel_span!("INSERT", "youtube_streams"))
        .await?;

        Ok(())
    }
}

#[cfg(test)]
#[sqlx::test(fixtures("../../../sql/schema"))]
async fn test(pool: PgPool) -> Result<()> {
    use chrono::NaiveDateTime;

    let sql1 = r#"INSERT INTO youtube_channels (vtuber_id) VALUES ('vtuber1');"#;

    sqlx::query(sql1).execute(&pool).await?;

    {
        let rows = sqlx::query!(r#"SELECT title FROM youtube_streams WHERE vtuber_id = 'vtuber1'"#)
            .fetch_all(&pool)
            .await?;

        assert_eq!(rows.len(), 0);

        UpsertYouTubeStreamQuery {
            stream_id: "id1",
            vtuber_id: "vtuber1",
            title: "title1",
            status: StreamStatus::Live,
            thumbnail_url: Some("http://bing.com".into()),
            start_time: Some(UtcTime::from_utc(
                NaiveDateTime::from_timestamp(3000, 0),
                Utc,
            )),
            ..Default::default()
        }
        .execute(&pool)
        .await?;

        let rows = sqlx::query!(r#"SELECT title FROM youtube_streams WHERE vtuber_id = 'vtuber1'"#)
            .fetch_all(&pool)
            .await?;

        assert_eq!(rows.len(), 1);
        assert_eq!(rows[0].title, "title1");
    }

    {
        UpsertYouTubeStreamQuery {
            stream_id: "id1",
            status: StreamStatus::Ended,
            title: "title2",
            thumbnail_url: Some("https://google.com".into()),
            ..Default::default()
        }
        .execute(&pool)
        .await?;

        let rows = sqlx::query!(
            r#"SELECT title, status::TEXT, start_time, thumbnail_url FROM youtube_streams WHERE vtuber_id = 'vtuber1'"#
        )
        .fetch_all(&pool)
        .await?;

        assert_eq!(rows.len(), 1);
        assert_eq!(rows[0].thumbnail_url, Some("https://google.com".into()));
        assert_eq!(rows[0].status, Some("ended".to_string()));
        assert_eq!(rows[0].title, "title2");
        assert_eq!(
            rows[0].start_time,
            Some(UtcTime::from_utc(
                NaiveDateTime::from_timestamp(3000, 0),
                Utc
            ))
        );
    }

    {
        let dt = UtcTime::from_utc(NaiveDateTime::from_timestamp(3000, 0), Utc);

        UpsertYouTubeStreamQuery {
            stream_id: "id1",

            start_time: Some(dt),
            ..Default::default()
        }
        .execute(&pool)
        .await?;

        let rows =
            sqlx::query!(r#"SELECT start_time FROM youtube_streams WHERE vtuber_id = 'vtuber1'"#)
                .fetch_all(&pool)
                .await?;

        assert_eq!(rows.len(), 1);
        assert_eq!(rows[0].start_time, Some(dt));
    }

    Ok(())
}
