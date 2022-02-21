use tracing::Span;

#[derive(serde::Deserialize)]
pub struct VerifyIntentRequestQuery {
    #[serde(rename = "hub.challenge")]
    challenge: String,
}

pub fn verify_intent(query: VerifyIntentRequestQuery) -> String {
    Span::current().record("name", &"GET /api/pubsub");

    tracing::debug!("challenge={}", query.challenge);

    query.challenge
}
