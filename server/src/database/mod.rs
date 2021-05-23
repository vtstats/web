#![allow(dead_code)]

pub mod channels;
pub mod statistic;
pub mod streams;

use sqlx::{PgPool, Result};

use crate::config::CONFIG;

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
