use sqlx::Result;

use super::Database;

impl Database {
    pub async fn notify(&self, chan: impl AsRef<str>, payload: impl AsRef<str>) -> Result<()> {
        sqlx::query!("select pg_notify($1, $2)", chan.as_ref(), payload.as_ref())
            .execute(&self.pool)
            .await?;

        Ok(())
    }
}
