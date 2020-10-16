use chrono::{Duration, SecondsFormat, Utc};
use sqlx::PgPool;
use warp::test::request;
use warp::Filter;

use crate::error::Result;
use crate::reject::handle_rejection;
use crate::v3::api;
use crate::v3::streams_report::{Row, Stream, StreamsReport, StreamsReportResponseBody};

use super::utils::{is_invalid_query, is_ok};

#[tokio::test]
async fn invalid_query() {
    let pool = PgPool::new(env!("DATABASE_URL")).await.unwrap();

    let api = api(pool).recover(handle_rejection);

    is_invalid_query(
        request()
            .method("GET")
            .path("/api/v3/streams_report")
            .reply(&api)
            .await,
    );

    is_invalid_query(
        request()
            .method("GET")
            .path("/api/v3/streams_report?foo=bar")
            .reply(&api)
            .await,
    );

    is_invalid_query(
        request()
            .method("GET")
            .path("/api/v3/streams_report?ids=yuudachi")
            .reply(&api)
            .await,
    );

    is_invalid_query(
        request()
            .method("GET")
            .path("/api/v3/streams_report?metrics=yuudachi")
            .reply(&api)
            .await,
    );
}

#[tokio::test]
async fn ok() -> Result<()> {
    let pool = PgPool::new(env!("DATABASE_URL")).await?;

    let api = api(pool.clone()).recover(handle_rejection);

    let today = Utc::today().and_hms(0, 0, 0);

    let _ = sqlx::query!(
        r#"
            insert into youtube_channels (vtuber_id, view_count, updated_at)
                 values ('baz', 1000, $1)
        "#,
        today,
    )
    .execute(&pool)
    .await?;

    let _ = sqlx::query!(
        r#"
            insert into youtube_streams (stream_id, title, vtuber_id, updated_at)
                 values ('foo', 'bar', 'baz', $1)
        "#,
        today,
    )
    .execute(&pool)
    .await?;

    let _ = sqlx::query!(
        r#"
            insert into youtube_stream_viewer_statistic (stream_id, time, value)
                 values ('foo', $1, 100),
                        ('foo', $2, 200),
                        ('foo', $3, 300),
                        ('foo', $4, 400)
        "#,
        today,
        today + Duration::seconds(15),
        today + Duration::seconds(30),
        today + Duration::seconds(45),
    )
    .execute(&pool)
    .await?;

    is_ok(
        request()
            .method("GET")
            .path("/api/v3/streams_report?ids=foo&metrics=youtube_stream_viewer")
            .reply(&api)
            .await,
        &StreamsReportResponseBody {
            streams: vec![Stream {
                stream_id: "foo".into(),
                title: "bar".into(),
                vtuber_id: "baz".into(),
                schedule_time: None,
                start_time: None,
                end_time: None,
                average_viewer_count: Some(250),
                max_viewer_count: Some(400),
                updated_at: today,
            }],
            reports: vec![StreamsReport {
                id: "foo".into(),
                kind: "youtube_stream_viewer".into(),
                rows: vec![
                    Row {
                        time: today,
                        value: 100,
                    },
                    Row {
                        time: today + Duration::seconds(15),
                        value: 200,
                    },
                    Row {
                        time: today + Duration::seconds(30),
                        value: 300,
                    },
                    Row {
                        time: today + Duration::seconds(45),
                        value: 400,
                    },
                ],
            }],
        },
    );

    is_ok(
        request()
            .method("GET")
            .path(&format!(
                "/api/v3/streams_report?ids=foo&metrics=youtube_stream_viewer&startAt={startAt}",
                startAt =
                    (today + Duration::seconds(15)).to_rfc3339_opts(SecondsFormat::Millis, true)
            ))
            .reply(&api)
            .await,
        &StreamsReportResponseBody {
            streams: vec![Stream {
                stream_id: "foo".into(),
                title: "bar".into(),
                vtuber_id: "baz".into(),
                schedule_time: None,
                start_time: None,
                end_time: None,
                average_viewer_count: Some(250),
                max_viewer_count: Some(400),
                updated_at: today,
            }],
            reports: vec![StreamsReport {
                id: "foo".into(),
                kind: "youtube_stream_viewer".into(),
                rows: vec![
                    Row {
                        time: today + Duration::seconds(15),
                        value: 200,
                    },
                    Row {
                        time: today + Duration::seconds(30),
                        value: 300,
                    },
                    Row {
                        time: today + Duration::seconds(45),
                        value: 400,
                    },
                ],
            }],
        },
    );

    is_ok(
        request()
            .method("GET")
            .path(&format!(
                "/api/v3/streams_report?ids=foo&metrics=youtube_stream_viewer&endAt={endAt}",
                endAt =
                    (today + Duration::seconds(30)).to_rfc3339_opts(SecondsFormat::Millis, true)
            ))
            .reply(&api)
            .await,
        &StreamsReportResponseBody {
            streams: vec![Stream {
                stream_id: "foo".into(),
                title: "bar".into(),
                vtuber_id: "baz".into(),
                schedule_time: None,
                start_time: None,
                end_time: None,
                average_viewer_count: Some(250),
                max_viewer_count: Some(400),
                updated_at: today,
            }],
            reports: vec![StreamsReport {
                id: "foo".into(),
                kind: "youtube_stream_viewer".into(),
                rows: vec![
                    Row {
                        time: today,
                        value: 100,
                    },
                    Row {
                        time: today + Duration::seconds(15),
                        value: 200,
                    },
                    Row {
                        time: today + Duration::seconds(30),
                        value: 300,
                    },
                ],
            }],
        },
    );

    is_ok(
        request()
            .method("GET")
            .path(&format!(
                "/api/v3/streams_report?ids=foo&metrics=youtube_stream_viewer&startAt={startAt}&endAt={endAt}",
                startAt = (today + Duration::seconds(15)).to_rfc3339_opts(SecondsFormat::Millis, true),
                endAt = (today + Duration::seconds(30)).to_rfc3339_opts(SecondsFormat::Millis, true)
            ))
            .reply(&api)
            .await,
        &StreamsReportResponseBody {
            streams: vec![Stream {
                stream_id: "foo".into(),
                title: "bar".into(),
                vtuber_id: "baz".into(),
                schedule_time: None,
                start_time: None,
                end_time: None,
                average_viewer_count: Some(250),
                max_viewer_count: Some(400),
                updated_at: today,
            }],
            reports: vec![StreamsReport {
                id: "foo".into(),
                kind: "youtube_stream_viewer".into(),
                rows: vec![
                    Row { time: today + Duration::seconds(15), value: 200},
                    Row { time: today + Duration::seconds(30), value: 300},
                ],
            }],
        },
    );

    sqlx::query!(
        r#"
            delete from youtube_stream_viewer_statistic
                  where stream_id = any(array['foo', 'bar'])
        "#
    )
    .execute(&pool)
    .await?;

    sqlx::query!(
        r#"
            delete from youtube_streams
                  where stream_id = any(array['foo', 'bar'])
        "#
    )
    .execute(&pool)
    .await?;

    sqlx::query!(
        r#"
            delete from youtube_channels
                  where vtuber_id = any(array['foo', 'bar'])
        "#
    )
    .execute(&pool)
    .await?;

    Ok(())
}
