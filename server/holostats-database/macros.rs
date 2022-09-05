#[macro_export]
// https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/database.md
macro_rules! otel_span {
    ($operation:expr, $table:expr) => {
        crate::otel_span!($operation, $table, "holostats")
    };

    ($operation:expr, $table:expr, $database:expr) => {
        tracing::info_span!(
            concat!($operation, " ", $database, ".", $table),
            span.kind = "client",
            db.name = $database,
            db.system = "postgresql",
            db.operation = $operation,
            db.sql.table = $table
        )
    };
}
