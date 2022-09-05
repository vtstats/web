use chrono::{DateTime, Utc};
use sqlx::{PgPool, Postgres, QueryBuilder, Result};
use tracing::Instrument;

use chrono::serde::{ts_milliseconds, ts_milliseconds_option};
use serde::Serialize;
use serde_with::skip_serializing_none;

type UtcTime = DateTime<Utc>;

#[skip_serializing_none]
#[derive(Debug, Serialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Stream {
    pub stream_id: String,
    pub title: String,
    pub vtuber_id: String,
    pub thumbnail_url: Option<String>,
    #[serde(with = "ts_milliseconds_option")]
    pub schedule_time: Option<UtcTime>,
    #[serde(with = "ts_milliseconds_option")]
    pub start_time: Option<UtcTime>,
    #[serde(with = "ts_milliseconds_option")]
    pub end_time: Option<UtcTime>,
    pub average_viewer_count: Option<i32>,
    pub max_viewer_count: Option<i32>,
    pub max_like_count: Option<i32>,
    #[serde(with = "ts_milliseconds")]
    pub updated_at: UtcTime,
    pub status: StreamStatus,
}

#[derive(Debug, sqlx::Type, Serialize, PartialEq, Eq)]
#[sqlx(type_name = "stream_status", rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
pub enum StreamStatus {
    Scheduled,
    Live,
    Ended,
}

#[derive(Debug)]
pub enum Column {
    StartTime,
    EndTime,
    ScheduleTime,
}

impl Column {
    #[inline]
    pub fn as_str(&self) -> &'static str {
        match self {
            Column::ScheduleTime => "schedule_time",
            Column::EndTime => "end_time",
            Column::StartTime => "start_time",
        }
    }
}

#[derive(Debug)]
pub enum Ordering {
    Asc,
    Desc,
}

impl Ordering {
    #[inline]
    pub fn as_str(&self) -> &'static str {
        match self {
            Ordering::Asc => "ASC",
            Ordering::Desc => "DESC",
        }
    }
}

pub struct ListYouTubeStreamsQuery<'q> {
    pub ids: &'q [String],
    pub status: &'q [String],
    pub order_by: Option<(Column, Ordering)>,
    pub start_at: Option<(Column, &'q UtcTime)>,
    pub end_at: Option<(Column, &'q UtcTime)>,
    pub keyword: Option<&'q str>,
    pub limit: Option<usize>,
}

impl<'q> Default for ListYouTubeStreamsQuery<'q> {
    fn default() -> Self {
        ListYouTubeStreamsQuery {
            ids: &[],
            status: &[],
            order_by: None,
            end_at: None,
            start_at: None,
            keyword: None,
            limit: Some(24),
        }
    }
}

impl<'q> ListYouTubeStreamsQuery<'q> {
    pub async fn execute(self, pool: &PgPool) -> Result<Vec<Stream>> {
        self.into_query_builder()
            .build_query_as::<Stream>()
            .fetch_all(pool)
            .instrument(crate::otel_span!("SELECT", "youtube_streams"))
            .await
    }

    pub fn into_query_builder(self) -> QueryBuilder<'q, Postgres> {
        let init = "\
       SELECT stream_id, \
              title, \
              vtuber_id, \
              thumbnail_url, \
              schedule_time, \
              start_time, \
              end_time, \
              average_viewer_count, \
              max_viewer_count, \
              max_like_count, \
              updated_at, \
              status \
         FROM youtube_streams";

        let mut qb = QueryBuilder::<Postgres>::new(init);

        let mut word = " WHERE ";

        if !self.ids.is_empty() {
            qb.push(word);
            word = " AND ";
            qb.push("vtuber_id = ANY(");
            qb.push_bind(self.ids);
            qb.push(")");
        }

        if !self.status.is_empty() {
            qb.push(word);
            word = " AND ";
            qb.push("status::TEXT = ANY(");
            qb.push_bind(self.status);
            qb.push(")");
        }

        if let Some((column, start_at)) = self.start_at {
            qb.push(word);
            word = " AND ";
            qb.push(format_args!("{} > ", column.as_str()));
            qb.push_bind(start_at);
        }

        if let Some((column, end_at)) = self.end_at {
            qb.push(word);
            qb.push(format_args!("{} < ", column.as_str()));
            qb.push_bind(end_at);
        }

        if let Some((column, ordering)) = self.order_by {
            qb.push(format_args!(
                " ORDER BY {} {}",
                column.as_str(),
                ordering.as_str()
            ));
        }

        if let Some(limit) = self.limit {
            qb.push(format_args!(" LIMIT {}", limit));
        }

        qb
    }
}

#[cfg(test)]
#[sqlx::test(fixtures("../../../sql/schema"))]
async fn test(pool: PgPool) -> Result<()> {
    use chrono::NaiveDateTime;

    assert_eq!(
        ListYouTubeStreamsQuery {
            ids: &["poi".into()],
            order_by: Some((Column::StartTime, Ordering::Asc)),
            ..Default::default()
        }
        .into_query_builder()
        .sql(),
        "SELECT stream_id, title, vtuber_id, thumbnail_url, schedule_time, start_time, end_time, average_viewer_count, max_viewer_count, max_like_count, updated_at, status \
        FROM youtube_streams \
        WHERE vtuber_id = ANY($1) \
        ORDER BY start_time ASC \
        LIMIT 24"
    );

    assert_eq!(
        ListYouTubeStreamsQuery {
            ids: &["poi".into()],
            order_by: Some((Column::StartTime, Ordering::Asc)),
            ..Default::default()
        }
        .into_query_builder()
        .sql(),
        "SELECT stream_id, title, vtuber_id, thumbnail_url, schedule_time, start_time, end_time, average_viewer_count, max_viewer_count, max_like_count, updated_at, status \
        FROM youtube_streams \
        WHERE vtuber_id = ANY($1) \
        ORDER BY start_time ASC \
        LIMIT 24"
    );

    assert_eq!(
        ListYouTubeStreamsQuery {
            ids: &["poi".into()],
            order_by: Some((Column::EndTime, Ordering::Asc)),
            start_at: Some((Column::EndTime, &Utc::now())),
            ..Default::default()
        }
        .into_query_builder()
        .sql(),
        "SELECT stream_id, title, vtuber_id, thumbnail_url, schedule_time, start_time, end_time, average_viewer_count, max_viewer_count, max_like_count, updated_at, status \
        FROM youtube_streams \
        WHERE vtuber_id = ANY($1) \
        AND end_time > $2 \
        ORDER BY end_time ASC \
        LIMIT 24"
    );

    assert_eq!(
        ListYouTubeStreamsQuery {
            ids: &["poi".into()],
            order_by: Some((Column::ScheduleTime, Ordering::Desc)),
            start_at: Some((Column::ScheduleTime, &Utc::now())),
            end_at: Some((Column::ScheduleTime, &Utc::now())),
            limit: Some(2434),
            ..Default::default()
        }
        .into_query_builder()
        .sql(),
        "SELECT stream_id, title, vtuber_id, thumbnail_url, schedule_time, start_time, end_time, average_viewer_count, max_viewer_count, max_like_count, updated_at, status \
        FROM youtube_streams \
        WHERE vtuber_id = ANY($1) \
        AND schedule_time > $2 \
        AND schedule_time < $3 \
        ORDER BY schedule_time DESC \
        LIMIT 2434"
    );

    assert_eq!(
        ListYouTubeStreamsQuery {
            ids: &["poi".into()],
            limit: None,
            ..Default::default()
        }
        .into_query_builder()
        .sql(),
        "SELECT stream_id, title, vtuber_id, thumbnail_url, schedule_time, start_time, end_time, average_viewer_count, max_viewer_count, max_like_count, updated_at, status \
        FROM youtube_streams \
        WHERE vtuber_id = ANY($1)"
    );

    let sql1 = r#"INSERT INTO youtube_channels (vtuber_id) VALUES ('vtuber1'), ('vtuber2');"#;

    let sql2 = r#"
    INSERT INTO youtube_streams (stream_id, title, vtuber_id, schedule_time, start_time, end_time, status)
         VALUES ('id1', 'title1', 'vtuber1', to_timestamp(200), to_timestamp(1800), to_timestamp(8000), 'live'),
                ('id2', 'title2', 'vtuber2', to_timestamp(0), to_timestamp(10000), to_timestamp(12000), 'live'),
                ('id3', 'title3', 'vtuber2', to_timestamp(10000), to_timestamp(15000), to_timestamp(17000), 'ended');
    "#;

    sqlx::query(sql1).execute(&pool).await?;
    sqlx::query(sql2).execute(&pool).await?;

    assert_eq!(
        ListYouTubeStreamsQuery {
            ids: &["vtuber2".into()],
            ..Default::default()
        }
        .execute(&pool)
        .await?
        .len(),
        2
    );

    assert_eq!(
        ListYouTubeStreamsQuery {
            limit: Some(2),
            ..Default::default()
        }
        .execute(&pool)
        .await?
        .len(),
        2
    );

    assert_eq!(
        ListYouTubeStreamsQuery {
            status: &["live".into()],
            ..Default::default()
        }
        .execute(&pool)
        .await?
        .len(),
        2
    );

    assert_eq!(
        ListYouTubeStreamsQuery {
            status: &["live".into()],
            ..Default::default()
        }
        .execute(&pool)
        .await?
        .len(),
        2
    );

    assert_eq!(
        ListYouTubeStreamsQuery {
            start_at: Some((
                Column::StartTime,
                &UtcTime::from_utc(NaiveDateTime::from_timestamp(9000, 0), Utc)
            )),
            ..Default::default()
        }
        .execute(&pool)
        .await?
        .len(),
        2
    );

    assert_eq!(
        ListYouTubeStreamsQuery {
            end_at: Some((
                Column::EndTime,
                &UtcTime::from_utc(NaiveDateTime::from_timestamp(15000, 0), Utc)
            )),
            ..Default::default()
        }
        .execute(&pool)
        .await?
        .len(),
        2
    );

    assert_eq!(
        ListYouTubeStreamsQuery {
            order_by: Some((Column::ScheduleTime, Ordering::Asc)),
            ..Default::default()
        }
        .execute(&pool)
        .await?[0]
            .stream_id,
        "id2"
    );

    Ok(())
}
