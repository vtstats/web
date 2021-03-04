use chrono::Utc;
use futures::future::{FutureExt, TryFutureExt};
use hmac::{Hmac, Mac, NewMac};
use reqwest::{
    header::{AUTHORIZATION, CONTENT_TYPE},
    Body, Client, Response, Url,
};
use sha2::{Digest, Sha256};
use std::str::FromStr;
use tracing::instrument;

use crate::error::Result;

#[instrument(
    name = "Update file to S3",
    skip(client, data),
    fields(
        filename,
        content_type,
        content_length = data.as_ref().len(),
        http.method = "PUT",
    )
)]
pub async fn upload_file<T>(
    filename: &str,
    data: T,
    content_type: &str,
    client: &Client,
) -> Result<()>
where
    T: Into<Body> + AsRef<[u8]>,
{
    let now = Utc::now();
    let date = now.format("%Y%m%dT%H%M%SZ");
    let today = now.format("%Y%m%d");

    let scope = format!("{today}/ap-northeast-1/s3/aws4_request", today = today);

    let content_sha256 = Sha256::digest(data.as_ref());

    // task1
    let canonical_req = format!(
        r#"PUT
/{filename}

host:{host}
x-amz-content-sha256:{content_sha256}
x-amz-date:{date}

host;x-amz-content-sha256;x-amz-date
{content_sha256}"#,
        filename = filename,
        host = env!("S3_HOST"),
        date = date,
        content_sha256 = hex::encode(content_sha256)
    );

    let hashed_canonical_request = Sha256::digest(canonical_req.as_bytes());

    // task2
    let string_to_sign = format!(
        "AWS4-HMAC-SHA256\n{date}\n{scope}\n{hashed_canonical_request}",
        date = date,
        scope = scope,
        hashed_canonical_request = hex::encode(hashed_canonical_request)
    );

    // task3
    let signature = {
        macro_rules! hmac_sha256 {
            ($key:expr, $data:expr) => {{
                let mut mac = Hmac::<Sha256>::new_varkey($key).unwrap();
                mac.update($data);
                mac.finalize().into_bytes()
            }};
        }

        let secret = concat!("AWS4", env!("S3_ACCESS_KEY")).as_bytes();
        let k_date = hmac_sha256!(secret, today.to_string().as_bytes());
        let k_region = hmac_sha256!(k_date.as_slice(), b"ap-northeast-1");
        let k_service = hmac_sha256!(k_region.as_slice(), b"s3");
        let k_signing = hmac_sha256!(k_service.as_slice(), b"aws4_request");
        hmac_sha256!(k_signing.as_slice(), string_to_sign.as_bytes())
    };

    // task4
    let authorization = format!(
        "AWS4-HMAC-SHA256 Credential={access_key}/{scope}, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature={signature}",
        access_key = env!("S3_KEY_ID"),
        scope = scope,
        signature =  hex::encode(signature),
    );

    let url = Url::from_str(concat!("https://", env!("S3_HOST")))?.join(&filename)?;

    let _ = client
        .put(url.clone())
        .header(CONTENT_TYPE, content_type)
        .header("x-amz-date", date.to_string())
        .header("x-amz-content-sha256", hex::encode(content_sha256))
        .header(AUTHORIZATION, authorization)
        .body(data)
        .send()
        .map(|res| res.and_then(Response::error_for_status))
        .map_err(|err| (url, err))
        .await?;

    return Ok(());
}
