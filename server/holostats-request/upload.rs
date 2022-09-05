use anyhow::Result;
use chrono::Utc;
use hmac::{Hmac, Mac};
use holostats_config::CONFIG;
use reqwest::{
    header::{AUTHORIZATION, CONTENT_TYPE},
    Body,
};
use sha2::{Digest, Sha256};

use super::RequestHub;

impl RequestHub {
    pub async fn upload_file<T>(
        &self,
        filename: &str,
        data: T,
        content_type: &str,
    ) -> Result<String>
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
/{bucket}/{filename}

host:{host}
x-amz-content-sha256:{content_sha256}
x-amz-date:{date}

host;x-amz-content-sha256;x-amz-date
{content_sha256}"#,
            bucket = CONFIG.s3.bucket,
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
                let mut mac =
                    Hmac::<Sha256>::new_from_slice($key).expect("HMAC can take key of any size");
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
        // signature = HexEncode(HMAC(derived signing key, string to sign))
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
            "https://{host}/{bucket}/{filename}",
            bucket = CONFIG.s3.bucket,
            host = CONFIG.s3.host,
            filename = filename
        );

        let req = (&self.client)
            .put(s3_url)
            .header(CONTENT_TYPE, content_type)
            .header("x-amz-date", date.to_string())
            .header("x-amz-content-sha256", content_sha256)
            .header(AUTHORIZATION, authorization)
            .body(data);

        let _res = crate::otel::send(&self.client, req).await?;

        Ok(format!("{}/{}", CONFIG.s3.public_url, filename))
    }
}
