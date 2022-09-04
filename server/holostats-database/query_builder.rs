use chrono::{DateTime, Utc};
use sqlx::{Postgres, QueryBuilder};

use super::streams::OrderBy;

type UtcTime = DateTime<Utc>;

pub struct YouTubeStreamListQueryBuilder<'qb> {
    pub ids: &'qb [String],
    pub status: &'qb [String],
    pub order_by: OrderBy,
    pub start_at: Option<&'qb UtcTime>,
    pub end_at: Option<&'qb UtcTime>,
    pub keyword: Option<&'qb str>,
    pub limit: usize,
}

impl<'qb> Default for YouTubeStreamListQueryBuilder<'qb> {
    fn default() -> Self {
        YouTubeStreamListQueryBuilder {
            ids: &[],
            status: &[],
            order_by: OrderBy::StartTimeAsc,
            end_at: None,
            start_at: None,
            keyword: None,
            limit: 24,
        }
    }
}

impl<'qb> YouTubeStreamListQueryBuilder<'qb> {
    pub fn to_builder(self) -> QueryBuilder<'qb, Postgres> {
        let mut qb = QueryBuilder::<Postgres>::new(
            "\
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
              FROM youtube_streams\
                  ",
        );

        {
            qb.push(" WHERE vtuber_id = ANY(");
            qb.push_bind(self.ids);
            qb.push(")");
        }

        if !self.status.is_empty() {
            qb.push(" AND status::TEXT = ANY(");
            qb.push_bind(self.status);
            qb.push(") ");
        }

        if let Some(start_at) = self.start_at {
            qb.push(format_args!(
                " AND {} > ",
                match self.order_by {
                    OrderBy::ScheduleTimeAsc | OrderBy::ScheduleTimeDesc => "schedule_time",
                    OrderBy::EndTimeAsc | OrderBy::EndTimeDesc => "end_time",
                    OrderBy::StartTimeAsc | OrderBy::StartTimeDesc => "start_time",
                }
            ));
            qb.push_bind(start_at);
        }

        if let Some(end_at) = self.end_at {
            qb.push(format_args!(
                " AND {} < ",
                match self.order_by {
                    OrderBy::ScheduleTimeAsc | OrderBy::ScheduleTimeDesc => "schedule_time",
                    OrderBy::EndTimeAsc | OrderBy::EndTimeDesc => "end_time",
                    OrderBy::StartTimeAsc | OrderBy::StartTimeDesc => "start_time",
                }
            ));
            qb.push_bind(end_at);
        }

        qb.push(format_args!(
            " ORDER BY {}",
            match self.order_by {
                OrderBy::StartTimeAsc => "start_time ASC",
                OrderBy::EndTimeAsc => "end_time ASC",
                OrderBy::ScheduleTimeAsc => "schedule_time ASC",
                OrderBy::StartTimeDesc => "start_time DESC",
                OrderBy::EndTimeDesc => "end_time DESC",
                OrderBy::ScheduleTimeDesc => "schedule_time DESC",
            }
        ));

        qb.push(format_args!(" LIMIT {}", self.limit));

        qb
    }
}

#[test]
fn test() {
    assert_eq!(
        YouTubeStreamListQueryBuilder {
            ids: &["poi".into()],
            order_by: OrderBy::StartTimeAsc,
            ..Default::default()
        }
        .to_builder()
        .sql(),
        "SELECT stream_id, title, vtuber_id, thumbnail_url, schedule_time, start_time, end_time, average_viewer_count, max_viewer_count, max_like_count, updated_at, status \
        FROM youtube_streams \
        WHERE vtuber_id = ANY($1) \
        ORDER BY start_time ASC \
        LIMIT 24"
    );

    assert_eq!(
        YouTubeStreamListQueryBuilder {
            ids: &["poi".into()],
            order_by: OrderBy::EndTimeAsc,
            start_at: Some(&Utc::now()),
            ..Default::default()
        }
        .to_builder()
        .sql(),
        "SELECT stream_id, title, vtuber_id, thumbnail_url, schedule_time, start_time, end_time, average_viewer_count, max_viewer_count, max_like_count, updated_at, status \
        FROM youtube_streams \
        WHERE vtuber_id = ANY($1) \
        AND end_time > $2 \
        ORDER BY end_time ASC \
        LIMIT 24"
    );

    assert_eq!(
        YouTubeStreamListQueryBuilder {
            ids: &["poi".into()],
            order_by: OrderBy::ScheduleTimeDesc,
            start_at: Some(&Utc::now()),
            end_at: Some(&Utc::now()),
            limit: 2434,
            ..Default::default()
        }
        .to_builder()
        .sql(),
        "SELECT stream_id, title, vtuber_id, thumbnail_url, schedule_time, start_time, end_time, average_viewer_count, max_viewer_count, max_like_count, updated_at, status \
        FROM youtube_streams \
        WHERE vtuber_id = ANY($1) \
        AND schedule_time > $2 \
        AND schedule_time < $3 \
        ORDER BY schedule_time DESC \
        LIMIT 2434"
    );
}
