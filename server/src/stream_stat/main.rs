#[path = "../error.rs"]
mod error;
#[path = "../requests/mod.rs"]
mod requests;
#[path = "../trace.rs"]
mod trace;
#[path = "../vtubers.rs"]
mod vtubers;

use chrono::Utc;
use reqwest::Client;
use sqlx::PgPool;
use std::env;
use tracing_appender::rolling::Rotation;

use crate::error::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let _guard = trace::init("stream_stat=debug", Rotation::DAILY);

    let span = tracing::info_span!("stream_stat");

    let client = Client::new();

    let pool = PgPool::connect(&env::var("DATABASE_URL").unwrap()).await?;

    let rows = sqlx::query!(
        r#"
            select stream_id
              from youtube_streams
             where end_time IS NULL
               and (
                     start_time is not null or (
                       schedule_time > now() - interval '6 hours'
                       and schedule_time < now() + interval '5 minutes'
                     )
                   )
        "#
    )
    .fetch_all(&pool)
    .await?;

    if rows.is_empty() {
        tracing::debug!(parent: &span, "noop");

        return Ok(());
    }

    let ids = rows
        .iter()
        .map(|row| row.stream_id.as_str())
        .collect::<Vec<_>>();

    tracing::debug!(parent: &span, len = ids.len(), ids = ?ids);

    let streams = requests::youtube_streams(&client, &ids).await?;

    tracing::debug!(parent: &span, len = streams.len(), streams = ?streams);

    let now = Utc::now();

    for id in ids
        .iter()
        .filter(|&id| !streams.iter().any(|stream| &stream.id == id))
    {
        tracing::debug!(parent: &span, id, "missing stream");

        let _ = sqlx::query!(
            r#"
                update youtube_streams
                   set end_time = $1
                 where stream_id = $2
            "#,
            now,
            id,
        )
        .execute(&pool)
        .await?;
    }

    for stream in &streams {
        let _ = sqlx::query!(
            r#"
                update youtube_streams
                   set (updated_at, status, schedule_time, start_time, end_time)
                     = ($1, $2::text::stream_status, $3, $4, $5)
                 where stream_id = $6
            "#,
            now,
            stream.status.as_str(),
            stream.schedule_time,
            stream.start_time,
            stream.end_time,
            stream.id,
        )
        .execute(&pool)
        .await?;

        if let Some(viewers) = stream.viewers {
            let _ = sqlx::query!(
                r#"
                    insert into youtube_stream_viewer_statistic (stream_id, time, value)
                         values ($1, $2, $3)
                "#,
                stream.id,
                now,
                viewers,
            )
            .execute(&pool)
            .await?;
        }
    }

    Ok(())
}
