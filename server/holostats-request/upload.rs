use anyhow::Result;
use chrono::Utc;
use futures::future::FutureExt;
use hmac::{Hmac, Mac, NewMac};
use holostats_config::CONFIG;
use reqwest::{
    header::{AUTHORIZATION, CONTENT_TYPE},
    Body, Response, Url,
};
use sha2::{Digest, Sha256};
use std::str::FromStr;
use tracing::instrument;

use super::RequestHub;

impl RequestHub {
    #[instrument(
        name = "Update file to S3",
        skip(self, data),
        fields(
            filename,
            content_type,
            content_length = data.as_ref().len(),
            http.method = "PUT",
        )
    )]
    pub async fn upload_file<T>(&self, filename: &str, data: T, content_type: &str) -> Result<()>
    where
        T: Into<Body> + AsRef<[u8]>,
    {
        let now = Utc::now();
        let date = now.format("%Y%m%dT%H%M%SZ");
        let today = now.format("%Y%m%d");

        let content_sha256 = Sha256::digest(data.as_ref());
        let content_sha256 = hex::encode(content_sha256);

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
            host = CONFIG.s3.host,
            date = date,
            content_sha256 = content_sha256
        );

        let hashed_canonical_request = Sha256::digest(canonical_req.as_bytes());
        let hashed_canonical_request = hex::encode(hashed_canonical_request);

        // task2
        let scope = format!(
            "{today}/{region}/s3/aws4_request",
            today = today,
            region = CONFIG.s3.region
        );

        // StringToSign = Algorithm + \n + RequestDateTime + \n + CredentialScope + \n + HashedCanonicalRequest
        let string_to_sign = format!(
            "AWS4-HMAC-SHA256\n{date}\n{scope}\n{hashed_canonical_request}",
            date = date,
            scope = scope,
            hashed_canonical_request = hashed_canonical_request
        );

        // task3
        macro_rules! hmac_sha256 {
            ($key:expr, $data:expr) => {{
                let mut mac = Hmac::<Sha256>::new_varkey($key).unwrap();
                mac.update($data);
                mac.finalize().into_bytes()
            }};
        }

        // kSecret = your secret access key
        let k_secret = format!("AWS4{}", CONFIG.s3.access_key);
        let k_secret = k_secret.as_bytes();
        // kDate = HMAC("AWS4" + kSecret, Date)
        let k_date = hmac_sha256!(k_secret, today.to_string().as_bytes());
        // kRegion = HMAC(kDate, Region)
        let k_region = hmac_sha256!(k_date.as_slice(), CONFIG.s3.region.as_bytes());
        // kService = HMAC(kRegion, Service)
        let k_service = hmac_sha256!(k_region.as_slice(), b"s3");
        // kSigning = HMAC(kService, "aws4_request")
        let k_signing = hmac_sha256!(k_service.as_slice(), b"aws4_request");
        // signature = HexEncode(HMAC(derived signing key, string to sign))s
        let signature = hmac_sha256!(k_signing.as_slice(), string_to_sign.as_bytes());
        let signature = hex::encode(signature);

        // task4
        let authorization = format!(
            "AWS4-HMAC-SHA256 Credential={key_id}/{scope}, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature={signature}",
            key_id = CONFIG.s3.key_id,
            scope = scope,
            signature = signature,
        );

        let s3_url = format!(
            "https://{host}/{filename}",
            host = CONFIG.s3.host,
            filename = filename
        );

        let url = Url::from_str(&s3_url)?;

        let _ = self
            .client
            .put(url.clone())
            .header(CONTENT_TYPE, content_type)
            .header("x-amz-date", date.to_string())
            .header("x-amz-content-sha256", content_sha256)
            .header(AUTHORIZATION, authorization)
            .body(data)
            .send()
            .map(|res| res.and_then(Response::error_for_status))
            .await?;

        return Ok(());
    }
}
