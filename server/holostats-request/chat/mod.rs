mod proto;
mod request;
mod response;

use self::proto::get_continuation;
use self::request::{Client, Context, Request};
pub use self::response::{Continuation, LiveChatMessage, Response};

use super::RequestHub;
use anyhow::Result;
use futures::TryFutureExt;
use reqwest::Url;

use holostats_config::CONFIG;

impl RequestHub {
    pub async fn youtube_live_chat(
        &self,
        channel_id: &str,
        stream_id: &str,
    ) -> Result<(Vec<LiveChatMessage>, Option<Continuation>)> {
        let continuation = get_continuation(channel_id, stream_id)?;

        self.youtube_live_chat_with_continuation(continuation).await
    }

    pub async fn youtube_live_chat_with_continuation(
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
            .json(&Request {
                context: Context {
                    client: Client {
                        language: "en",
                        client_name: &CONFIG.youtube.innertube_client_name,
                        client_version: &CONFIG.youtube.innertube_client_version,
                    },
                },
                continuation: &continuation,
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
