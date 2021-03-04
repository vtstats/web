use chrono::{Timelike, Utc};
use log::{LevelFilter, Log};
use serde::Serialize;
use serde_json::to_string;
use std::env;
use std::fmt::Debug;
use tracing::dispatcher::DefaultGuard;
use tracing::field::{display, DisplayValue};
use tracing::{Metadata, Subscriber};
use tracing_newrelic::{BlockingReporter, NewRelicLayer, WithEvent};
use tracing_subscriber::layer::{Context, SubscriberExt};
use tracing_subscriber::registry::LookupSpan;
use tracing_subscriber::{Layer, Registry};

struct TelemetryLogger;

impl Log for TelemetryLogger {
    fn enabled(&self, metadata: &log::Metadata) -> bool {
        metadata.target().starts_with("newrelic_telemetry")
    }

    fn log(&self, record: &log::Record) {
        if self.enabled(record.metadata()) {
            println!("[NewRelic] {:<5} {}", record.level(), record.args());
        }
    }

    fn flush(&self) {}
}

static LOGGER: TelemetryLogger = TelemetryLogger;

pub fn init_logger() {
    log::set_max_level(LevelFilter::Debug);
    // log::set_logger(&LOGGER).expect("failed to initilize telemetry logger");
}

struct TargetFilter(&'static str);

impl<S> Layer<S> for TargetFilter
where
    S: Subscriber + for<'span> LookupSpan<'span>,
{
    fn enabled(&self, metadata: &Metadata<'_>, _: Context<'_, S>) -> bool {
        metadata.target().starts_with(self.0)
    }
}

pub fn init_tracing(target: &'static str, is_global: bool) -> Option<DefaultGuard> {
    let filter = TargetFilter(target);

    let layer = NewRelicLayer::new(BlockingReporter::new(env!("NEW_RELIC_API_KEY")))
        .with_event(WithEvent::Flatten);

    let subscriber = Registry::default().with(filter).with(layer);

    if is_global {
        tracing::subscriber::set_global_default(subscriber)
            .expect("failed to initilize tracing subscriber");
        None
    } else {
        Some(tracing::subscriber::set_default(subscriber))
    }
}

#[allow(dead_code)]
pub fn json<T: Serialize + Debug>(t: &T) -> DisplayValue<String> {
    display(to_string(t).unwrap_or_else(|_| format!("{:?}", t)))
}

#[allow(dead_code)]
pub fn youtube_api_key() -> &'static str {
    if Utc::now().hour() % 2 == 0 {
        env!("YOUTUBE_API_KEY0")
    } else {
        env!("YOUTUBE_API_KEY1")
    }
}
