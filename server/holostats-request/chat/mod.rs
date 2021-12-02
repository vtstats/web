mod response;

pub use response::{Continuation, LiveChatMessage, Response};

use super::RequestHub;
use anyhow::Result;
use futures::TryFutureExt;
use reqwest::Url;
use serde::{Deserialize, Serialize};

use holostats_config::CONFIG;

#[derive(Deserialize, Serialize, Debug)]
struct LiveChatRequest {
    context: LiveChatContext,
    continuation: String,
}

#[derive(Deserialize, Serialize, Debug)]
struct LiveChatContext {
    client: LiveChatContextClient,
}

#[derive(Deserialize, Serialize, Debug)]
struct LiveChatContextClient {
    #[serde(rename = "hl")]
    language: String,
    #[serde(rename = "clientName")]
    name: String,
    #[serde(rename = "clientVersion")]
    version: String,
}

impl RequestHub {
    pub async fn youtube_live_chat(
        &self,
        continuation: String,
    ) -> Result<(Vec<LiveChatMessage>, Option<Continuation>)> {
        let url = Url::parse_with_params(
            "https://www.youtube.com/youtubei/v1/live_chat/get_live_chat",
            &[("key", &CONFIG.youtube.innertube_api_key)],
        )?;

        let res = self
            .client
            .post(url.clone())
            .json(&LiveChatRequest {
                context: LiveChatContext {
                    client: LiveChatContextClient {
                        language: "en".into(),
                        name: CONFIG.youtube.innertube_client_name.clone(),
                        version: CONFIG.youtube.innertube_client_version.clone(),
                    },
                },
                continuation,
            })
            .send()
            .and_then(|res| res.json::<Response>())
            .await?;

        if let Some(contents) = res.continuation_contents {
            Ok((
                contents
                    .live_chat_continuation
                    .actions
                    .into_iter()
                    .filter_map(LiveChatMessage::from_action)
                    .collect(),
                contents
                    .live_chat_continuation
                    .continuations
                    .into_iter()
                    .next(),
            ))
        } else {
            Ok((Vec::new(), None))
        }
    }
}
