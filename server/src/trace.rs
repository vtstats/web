use std::env;
use tracing_appender::non_blocking::WorkerGuard;
use tracing_appender::rolling::{RollingFileAppender, Rotation};
use tracing_subscriber::fmt::format::FmtSpan;

pub fn init(default_filter: &'static str, rotation: Rotation) -> WorkerGuard {
    let filter = env::var("RUST_LOG").unwrap_or_else(|_| default_filter.into());

    let log_directory = env::var("LOG_DIR").unwrap();

    let file_appender = RollingFileAppender::new(rotation, log_directory, "log");

    let (non_blocking, guard) = tracing_appender::non_blocking(file_appender);

    tracing_subscriber::fmt()
        .with_env_filter(filter)
        .with_writer(non_blocking)
        .with_span_events(FmtSpan::CLOSE)
        .init();

    guard
}
