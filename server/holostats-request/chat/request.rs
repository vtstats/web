use serde::Serialize;

#[derive(Serialize)]
pub struct Request<'r> {
    pub context: Context<'r>,
    pub continuation: &'r str,
}

#[derive(Serialize)]
pub struct Context<'r> {
    pub client: Client<'r>,
}

#[derive(Serialize)]
pub struct Client<'r> {
    #[serde(rename = "hl")]
    pub language: &'r str,
    #[serde(rename = "clientName")]
    pub client_name: &'r str,
    #[serde(rename = "clientVersion")]
    pub client_version: &'r str,
}
