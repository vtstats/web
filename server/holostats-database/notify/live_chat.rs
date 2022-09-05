use sqlx::PgPool;
use tracing::Instrument;

pub struct GetLiveChatNotify<'n> {
    pub vtuber_id: &'n str,
    pub stream_id: &'n str,
}

impl<'n> GetLiveChatNotify<'n> {
    pub async fn execute(self, pool: &PgPool) {
        let payload = format!("{},{}", self.vtuber_id, self.stream_id);

        if let Err(err) = sqlx::query!("SELECT pg_notify('get_live_chat', $1)", &payload)
            .execute(pool)
            .instrument(crate::otel_span!("SELECT", "pg_notify"))
            .await
        {
            tracing::error!(
                payload = payload.as_str(),
                "Failed to notify `get_live_chat` channel: {:?}",
                err
            );
        }
    }
}

// TODO: unit-testing
