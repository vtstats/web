mod proto;
mod request;
mod response;

use anyhow;
use chrono::Utc;
use futures::TryFutureExt;
use holostats_config::CONFIG;
use reqwest::Url;

use crate::metadata::request::Client;

use self::proto::get_continuation;
use self::request::{Context, Request};
use self::response::Response;

use super::RequestHub;

impl RequestHub {
    pub async fn updated_metadata(&self, video_id: &str) -> anyhow::Result<Response> {
        let now = Utc::now().timestamp();

        let continuation = get_continuation(video_id, now)?;

        self.updated_metadata_with_continuation(&continuation).await
    }

    pub async fn updated_metadata_with_continuation(
        &self,
        continuation: &str,
    ) -> anyhow::Result<Response> {
        let url = Url::parse_with_params(
            "https://www.youtube.com/youtubei/v1/updated_metadata",
            &[
                ("prettyPrint", "false"),
                ("key", &CONFIG.youtube.innertube_api_key),
            ],
        )?;

        let json = self
            .client
            .post(url)
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

        Ok(json)
    }
}
