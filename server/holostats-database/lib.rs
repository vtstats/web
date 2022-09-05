pub mod channels;
pub mod live_chat;
mod macros;
pub mod notify;
pub mod statistic;
pub mod stream;
pub mod streams;

use holostats_config::CONFIG;
use sqlx::{postgres::PgListener, PgPool, Result};

#[derive(Clone)]
pub struct Database {
    pub pool: PgPool,
}

impl Database {
    pub async fn new() -> Result<Database> {
        let pool = PgPool::connect(&CONFIG.database.url).await?;

        Ok(Database { pool })
    }

    pub async fn listener() -> Result<PgListener> {
        PgListener::connect(&CONFIG.database.url).await
    }
}

pub use sqlx::Error as DatabaseError;
