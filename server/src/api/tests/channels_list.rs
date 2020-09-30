use chrono::{Duration, Utc};
use reqwest::Client;
use sqlx::PgPool;
use warp::test::request;
use warp::Filter;

use crate::error::Result;
use crate::reject::handle_rejection;
use crate::v3::api;
use crate::v3::channels_list::{Channel, ChannelsListResponseBody};

use super::utils::{is_invalid_query, is_ok};

#[tokio::test]
async fn invalid_query() {
    let pool = PgPool::new(env!("DATABASE_URL")).await.unwrap();

    let client = Client::new();

    let api = api(pool, client).recover(handle_rejection);

    is_invalid_query(
        request()
            .method("GET")
            .path("/api/v3/youtube_channels")
            .reply(&api)
            .await,
    );

    is_invalid_query(
        request()
            .method("GET")
            .path("/api/v3/youtube_channels?foo=bar")
            .reply(&api)
            .await,
    );
}

#[tokio::test]
async fn ok() -> Result<()> {
    let pool = PgPool::new(env!("DATABASE_URL")).await?;

    let client = Client::new();

    let api = api(pool.clone(), client).recover(handle_rejection);

    let today = Utc::today().and_hms(0, 0, 0);

    let _ = sqlx::query!(
        r#"
            insert into youtube_channels (vtuber_id, view_count, updated_at)
                 values ('foo', 1000, $1),
                        ('bar', 1000, $2)
        "#,
        today,
        today - Duration::days(30)
    )
    .execute(&pool)
    .await?;

    let _ = sqlx::query!(
        r#"
            insert into youtube_channel_view_statistic (vtuber_id, time, value)
                 values ('foo', $1, 100),
                        ('foo', $2, 400),
                        ('foo', $3, 800),
                        ('bar', $3, 100)
        "#,
        today - Duration::days(32),
        today - Duration::days(8),
        today - Duration::days(2)
    )
    .execute(&pool)
    .await?;

    is_ok(
        request()
            .method("GET")
            .path("/api/v3/youtube_channels?ids=bar")
            .reply(&api)
            .await,
        &ChannelsListResponseBody {
            updated_at: Some(today),
            channels: vec![Channel {
                vtuber_id: "bar".into(),
                subscriber_count: 0,
                daily_subscriber_count: 0,
                weekly_subscriber_count: 0,
                monthly_subscriber_count: 0,
                view_count: 1000,
                daily_view_count: 1000 - 100,
                weekly_view_count: 1000,
                monthly_view_count: 1000,
                updated_at: today - Duration::days(30),
            }],
        },
    );

    is_ok(
        request()
            .method("GET")
            .path("/api/v3/youtube_channels?ids=foo")
            .reply(&api)
            .await,
        &ChannelsListResponseBody {
            updated_at: Some(today),
            channels: vec![Channel {
                vtuber_id: "foo".into(),
                subscriber_count: 0,
                daily_subscriber_count: 0,
                weekly_subscriber_count: 0,
                monthly_subscriber_count: 0,
                view_count: 1000,
                daily_view_count: 1000 - 800,
                weekly_view_count: 1000 - 400,
                monthly_view_count: 1000 - 100,
                updated_at: today,
            }],
        },
    );

    is_ok(
        request()
            .method("GET")
            .path("/api/v3/youtube_channels?ids=foo,bar")
            .reply(&api)
            .await,
        &ChannelsListResponseBody {
            updated_at: Some(today),
            channels: vec![
                Channel {
                    vtuber_id: "foo".into(),
                    subscriber_count: 0,
                    daily_subscriber_count: 0,
                    weekly_subscriber_count: 0,
                    monthly_subscriber_count: 0,
                    view_count: 1000,
                    daily_view_count: 1000 - 800,
                    weekly_view_count: 1000 - 400,
                    monthly_view_count: 1000 - 100,
                    updated_at: today,
                },
                Channel {
                    vtuber_id: "bar".into(),
                    subscriber_count: 0,
                    daily_subscriber_count: 0,
                    weekly_subscriber_count: 0,
                    monthly_subscriber_count: 0,
                    view_count: 1000,
                    daily_view_count: 1000 - 100,
                    weekly_view_count: 1000,
                    monthly_view_count: 1000,
                    updated_at: today - Duration::days(30),
                },
            ],
        },
    );

    sqlx::query!(
        r#"
            delete from youtube_channel_view_statistic
                  where vtuber_id = any(array['foo', 'bar'])
        "#,
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
