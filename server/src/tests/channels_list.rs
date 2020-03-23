use chrono::{Duration, Utc};
use reqwest::Client;
use sqlx::PgPool;
use warp::test::request;
use warp::Filter;

use crate::api_v3::channels_list::{Channel, ChannelsListResponseBody};
use crate::filters::api;
use crate::reject::handle_rejection;

use super::utils::{is_invalid_query, is_ok};

#[tokio::test]
async fn invalid_query() {
    let pool = PgPool::new(env!("DATABASE_URL")).await.unwrap();

    let client = Client::new();

    let api = api(pool, client).recover(handle_rejection);

    let res = request()
        .method("GET")
        .path("/api/v3/youtube_channels")
        .reply(&api)
        .await;

    is_invalid_query(res);

    let res = request()
        .method("GET")
        .path("/api/v3/youtube_channels?foo=bar")
        .reply(&api)
        .await;

    is_invalid_query(res);

    let res = request()
        .method("GET")
        .path("/api/v3/youtube_channels?ids=yuudachi")
        .reply(&api)
        .await;

    is_invalid_query(res);
}

#[tokio::test]
async fn ok() {
    let mut pool = PgPool::new(env!("DATABASE_URL")).await.unwrap();

    let client = Client::new();

    let api = api(pool.clone(), client).recover(handle_rejection);

    let today = Utc::today().and_hms(0, 0, 0);

    let _ = sqlx::query!(
        r#"
insert into youtube_channels (vtuber_id, view_count, updated_at)
     values ('ayame', 1000, $1),
            ('aqua' , 1000, $2)
        "#,
        today,
        today - Duration::days(30)
    )
    .execute(&mut pool)
    .await
    .unwrap();

    let _ = sqlx::query!(
        r#"
insert into youtube_channel_view_statistic (vtuber_id, time, value)
     values ('aqua', $1, 100)
        "#,
        today - Duration::days(2)
    )
    .execute(&mut pool)
    .await
    .unwrap();

    let res = request()
        .method("GET")
        .path("/api/v3/youtube_channels?ids=aqua")
        .reply(&api)
        .await;

    is_ok(
        res,
        &ChannelsListResponseBody {
            updated_at: today,
            channels: vec![Channel {
                vtuber_id: "aqua".into(),
                subscriber_count: 0,
                daily_subscriber_count: 0,
                weekly_subscriber_count: 0,
                monthly_subscriber_count: 0,
                view_count: 1000,
                daily_view_count: 900,
                weekly_view_count: 1000,
                monthly_view_count: 1000,
                updated_at: today - Duration::days(30),
            }],
        },
    );

    let _ = sqlx::query!(
        r#"
insert into youtube_channel_view_statistic (vtuber_id, time, value)
     values ('ayame', $1, 100),
            ('ayame', $2, 400),
            ('ayame', $3, 800)
        "#,
        today - Duration::days(32),
        today - Duration::days(8),
        today - Duration::days(2)
    )
    .execute(&mut pool)
    .await
    .unwrap();

    let res = request()
        .method("GET")
        .path("/api/v3/youtube_channels?ids=ayame")
        .reply(&api)
        .await;

    is_ok(
        res,
        &ChannelsListResponseBody {
            updated_at: today,
            channels: vec![Channel {
                vtuber_id: "ayame".into(),
                subscriber_count: 0,
                daily_subscriber_count: 0,
                weekly_subscriber_count: 0,
                monthly_subscriber_count: 0,
                view_count: 1000,
                daily_view_count: 200,
                weekly_view_count: 600,
                monthly_view_count: 900,
                updated_at: today,
            }],
        },
    );
}
