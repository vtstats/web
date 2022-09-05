use reqwest::{Client, RequestBuilder, Response, Result, Version};
use tracing::{
    field::{debug, display, Empty},
    Instrument, Span,
};

pub async fn send(client: &Client, req: RequestBuilder) -> Result<Response> {
    let req = req.build()?;

    let url = req.url();

    let span = tracing::info_span!(
        "HTTP",
        span.kind = "client",
        name = format!("HTTP {}", req.method()),
        otel.status_code = "OK",
        //// request
        http.method = req.method().as_str(),
        http.flavor = match req.version() {
            Version::HTTP_10 => Some("1.0"),
            Version::HTTP_11 => Some("1.1"),
            Version::HTTP_2 => Some("2.0"),
            Version::HTTP_3 => Some("3.0"),
            _ => None,
        },
        http.url = url.as_str(),
        // TODO: url.path() doesn't include query string
        http.target = url.path(),
        http.request_content_length = req.body().and_then(|b| b.as_bytes()).map(|b| b.len()),
        net.peer.name = url.domain(),
        ///// response
        http.status_code = Empty,
        // TODO: or `http.response_content_length_uncompressed` ?
        http.response_content_length = Empty,
        net.sock.peer.addr = Empty,
        //// error
        error.message = Empty,
        error.cause_chain = Empty,
    );

    async move {
        let res = client.execute(req).await?;

        Span::current()
            .record("http.status_code", res.status().as_u16())
            .record("http.response_content_length", res.content_length())
            .record(
                "net.sock.peer.addr",
                res.remote_addr().map(|addr| addr.to_string()),
            );

        let result = res.error_for_status();

        // TODO: use `inspect_err` once stable
        if let Err(err) = &result {
            Span::current()
                .record("otel.status_code", "ERROR")
                .record("error.message", display(err))
                .record("error.cause_chain", debug(err));
        }

        result
    }
    .instrument(span)
    .await
}
