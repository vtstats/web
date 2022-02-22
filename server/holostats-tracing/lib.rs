use log::Log;
use tracing::{dispatcher::DefaultGuard, Metadata, Subscriber};
use tracing_subscriber::{
    filter::LevelFilter,
    fmt,
    fmt::format::FmtSpan,
    layer::{Context, SubscriberExt},
    registry,
    registry::LookupSpan,
    Layer,
};

use holostats_config::CONFIG;

// logger
struct TelemetryLogger;

impl Log for TelemetryLogger {
    fn enabled(&self, metadata: &log::Metadata) -> bool {
        metadata.target().starts_with("tracing_newrelic")
    }

    fn log(&self, record: &log::Record) {
        if self.enabled(record.metadata()) {
            println!("[NewRelic] {}", record.args());
        }
    }

    fn flush(&self) {}
}

static LOGGER: TelemetryLogger = TelemetryLogger;

// target filter
struct TargetFilter(&'static str);

impl<S> Layer<S> for TargetFilter
where
    S: Subscriber + for<'span> LookupSpan<'span>,
{
    fn enabled(&self, metadata: &Metadata<'_>, _: Context<'_, S>) -> bool {
        let target = metadata.target();
        target.starts_with(self.0) || target.starts_with("holostats")
    }
}

pub fn init(target: &'static str, is_global: bool) -> Option<DefaultGuard> {
    // initilize logger
    log::set_max_level(log::LevelFilter::Info);
    log::set_logger(&LOGGER).expect("failed to initilize telemetry logger");

    match &CONFIG.newrelic.api_key {
        Some(api_key) => {
            let subscriber = registry()
                .with(
                    fmt::layer()
                        .with_target(false)
                        .with_span_events(FmtSpan::CLOSE)
                        .with_filter(LevelFilter::INFO),
                )
                .with(tracing_newrelic::layer(api_key.as_str()))
                .with(TargetFilter(target));

            if is_global {
                tracing::subscriber::set_global_default(subscriber)
                    .expect("failed to initilize tracing subscriber");
                None
            } else {
                Some(tracing::subscriber::set_default(subscriber))
            }
        }

        None => {
            println!("NewRelic API key not found");

            let subscriber = registry()
                .with(
                    fmt::layer()
                        .with_target(false)
                        .with_span_events(FmtSpan::CLOSE),
                )
                .with(TargetFilter(target));

            if is_global {
                tracing::subscriber::set_global_default(subscriber)
                    .expect("failed to initilize tracing subscriber");
                None
            } else {
                Some(tracing::subscriber::set_default(subscriber))
            }
        }
    }
}
