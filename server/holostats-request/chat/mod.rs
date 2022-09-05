mod proto;
mod request;
mod response;

use anyhow::Result;
use holostats_config::CONFIG;
use reqwest::Url;

use self::proto::get_continuation;
use self::request::{Client, Context, Request};
pub use self::response::{Continuation, LiveChatMessage, Response};

use super::RequestHub;

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
            &[
                ("prettyPrint", "false"),
                ("key", &CONFIG.youtube.innertube_api_key),
            ],
        )?;

        let req = (&self.client).post(url).json(&Request {
            context: Context {
                client: Client {
                    language: "en",
                    client_name: &CONFIG.youtube.innertube_client_name,
                    client_version: &CONFIG.youtube.innertube_client_version,
                },
            },
            continuation: &continuation,
        });

        let res = crate::otel::send(&self.client, req).await?;

        let json: Response = res.json().await?;

        if let Some(contents) = json.continuation_contents {
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
