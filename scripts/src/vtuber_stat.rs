mod consts;
mod types;
mod utils;

use chrono::{Timelike, Utc};
use futures::future::{try_join, try_join_all};
use isahc::HttpClient;
use std::str::FromStr;

use crate::consts::VTUBERS;
use crate::types::{Result, Values};
use crate::utils::{
    bilibili_stat, patch_values, vtuber_stats_at, vtuber_stats_timestamps, youtube_channels, Auth,
};

#[tokio::main]
async fn main() -> Result<()> {
    let client = HttpClient::builder().build()?;

    let auth = Auth::new(&client).await?;

    let now = Utc::now();
    let now_timestamp = now.timestamp();

    let channels_id = VTUBERS
        .iter()
        .map(|v| v.youtube)
        .collect::<Vec<_>>()
        .join(",");

    let bilibili_stats =
        try_join_all(VTUBERS.iter().map(|v| bilibili_stat(&client, v.bilibili))).await?;

    let (youtube_stats, timestamps) = try_join(
        if now.hour() % 2 == 0 {
            youtube_channels(&client, &channels_id, env!("YOUTUBE_API_KEY0"))
        } else {
            youtube_channels(&client, &channels_id, env!("YOUTUBE_API_KEY1"))
        },
        vtuber_stats_timestamps(&client, &auth.id_token),
    )
    .await?;

    let mut values = Values::default();

    let one_day_ago = timestamps
        .into_iter()
        .find(|&t| t >= now_timestamp - 24 * 60 * 60)
        .unwrap();

    let one_day_ago_stats = try_join_all(
        VTUBERS
            .iter()
            .map(|v| vtuber_stats_at(&client, &auth.id_token, v.name, one_day_ago)),
    )
    .await?;

    for ((vtuber, &(bilibili_subs, bilibili_views)), one_day_ago) in VTUBERS
        .iter()
        .zip(bilibili_stats.iter())
        .zip(one_day_ago_stats.iter())
    {
        let youtube = youtube_stats
            .iter()
            .find(|c| c.id == vtuber.youtube)
            .unwrap();

        let youtube_views = i32::from_str(&youtube.statistics.view_count)?;
        let youtube_subs = i32::from_str(&youtube.statistics.subscriber_count)?;

        values.insert(
            format!("/vtuberStats/{}/{}/{}", vtuber.name, now_timestamp, 0),
            youtube_subs,
        );
        values.insert(
            format!("/vtuberStats/{}/{}/{}", vtuber.name, now_timestamp, 1),
            youtube_views,
        );
        values.insert(
            format!("/vtuberStats/{}/{}/{}", vtuber.name, now_timestamp, 2),
            bilibili_subs,
        );
        values.insert(
            format!("/vtuberStats/{}/{}/{}", vtuber.name, now_timestamp, 3),
            bilibili_views,
        );

        values.insert(
            format!("/vtubers/{}/bilibiliStats/subs", vtuber.name),
            bilibili_subs,
        );
        values.insert(
            format!("/vtubers/{}/bilibiliStats/views", vtuber.name),
            bilibili_views,
        );
        values.insert(
            format!("/vtubers/{}/youtubeStats/subs", vtuber.name),
            youtube_subs,
        );
        values.insert(
            format!("/vtubers/{}/youtubeStats/views", vtuber.name),
            youtube_views,
        );

        values.insert(
            format!("/vtubers/{}/youtubeStats/dailySubs", vtuber.name),
            youtube_subs - one_day_ago[0],
        );
        values.insert(
            format!("/vtubers/{}/youtubeStats/dailyViews", vtuber.name),
            youtube_views - one_day_ago[1],
        );
        values.insert(
            format!("/vtubers/{}/bilibiliStats/dailySubs", vtuber.name),
            bilibili_subs - one_day_ago[2],
        );
        values.insert(
            format!("/vtubers/{}/bilibiliStats/dailyViews", vtuber.name),
            bilibili_views - one_day_ago[3],
        );
    }

    values.insert("/updatedAt/vtuberStat", now);

    patch_values(&client, &auth.id_token, values).await?;

    Ok(())
}
