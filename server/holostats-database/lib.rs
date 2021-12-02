pub mod channels;
pub mod notify;
pub mod statistic;
pub mod streams;

use holostats_config::CONFIG;
use sqlx::{PgPool, Result};

#[derive(Clone)]
pub struct Database {
    pub pool: PgPool,
}

impl Database {
    pub async fn new() -> Result<Database> {
        let pool = PgPool::connect(&CONFIG.database.url).await?;

        Ok(Database { pool })
    }
}

pub use sqlx::Error as DatabaseError;
