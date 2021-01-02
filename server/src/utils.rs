use chrono::{Timelike, Utc};
use log::LevelFilter;
use serde::Serialize;
use serde_json::to_string;
use simple_logger::SimpleLogger;
use std::env;
use std::fmt::Debug;
use tracing::dispatcher::DefaultGuard;
use tracing::field::{display, DisplayValue};
use tracing::{Metadata, Subscriber};
use tracing_newrelic::{BlockingReporter, NewRelicLayer, WithEvent};
use tracing_subscriber::layer::{Context, SubscriberExt};
use tracing_subscriber::registry::LookupSpan;
use tracing_subscriber::{Layer, Registry};

pub fn init_logger() {
    SimpleLogger::new()
        .with_level(LevelFilter::Off)
        .with_module_level("newrelic_telemetry", LevelFilter::Debug)
        .init()
        .expect("failed to initilize simple logger");
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

struct TargetFilter(&'static str);

impl<S> Layer<S> for TargetFilter
where
    S: Subscriber + for<'span> LookupSpan<'span>,
{
    fn enabled(&self, metadata: &Metadata<'_>, _: Context<'_, S>) -> bool {
        metadata.target().starts_with(self.0)
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
