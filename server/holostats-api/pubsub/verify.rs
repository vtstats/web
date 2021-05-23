#[derive(serde::Deserialize)]
pub struct VerifyIntentRequestQuery {
    #[serde(rename = "hub.challenge")]
    challenge: String,
}

pub fn verify_intent(query: VerifyIntentRequestQuery) -> String {
    tracing::info!(
        name = "GET /api/pubsub/:pubsub",
        challenge = &query.challenge.as_str()
    );

    query.challenge
}
