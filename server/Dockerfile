FROM lukemathwalker/cargo-chef:latest AS chef
WORKDIR app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
ENV SQLX_OFFLINE true
RUN cargo build --release

# api
FROM gcr.io/distroless/cc AS api
WORKDIR app
COPY --from=builder /app/target/release/api /
CMD ["./api"]

# channel_stat
FROM gcr.io/distroless/cc AS channel_stat
WORKDIR app
COPY --from=builder /app/target/release/channel_stat /
CMD ["./channel_stat"]

# live_chat
FROM gcr.io/distroless/cc AS live_chat
WORKDIR app
COPY --from=builder /app/target/release/live_chat /
CMD ["./live_chat"]

# rss_refresh
FROM gcr.io/distroless/cc AS rss_refresh
WORKDIR app
COPY --from=builder /app/target/release/rss_refresh /
CMD ["./rss_refresh"]

# stream_metadata
FROM gcr.io/distroless/cc AS stream_metadata
WORKDIR app
COPY --from=builder /app/target/release/stream_metadata /
CMD ["./stream_metadata"]

# subscribe
FROM gcr.io/distroless/cc AS subscribe
WORKDIR app
COPY --from=builder /app/target/release/subscribe /
CMD ["./subscribe"]
