use once_cell::sync::Lazy;
use serde::Deserialize;
use std::io::{Error, ErrorKind, Result};
use std::{env, fs, path::Path};

#[derive(Deserialize)]
pub struct Config {
    pub server: ServerConfig,
    pub database: DatabaseConfig,
    pub youtube: YouTubeConfig,
    pub bilibili: BilibiliConfig,
    pub s3: S3Config,
    #[serde(default)]
    pub newrelic: NewRelicConfig,
    pub vtubers: Vec<VTuber>,
}

#[derive(Deserialize)]
pub struct ServerConfig {
    pub address: String,
    pub hostname: String,
}

#[derive(Deserialize)]
pub struct DatabaseConfig {
    pub url: String,
}

#[derive(Deserialize)]
pub struct YouTubeConfig {
    pub api_keys: Vec<String>,
    pub pubsub_path: String,
}

#[derive(Deserialize)]
pub struct BilibiliConfig {
    pub cookie: String,
}

#[derive(Deserialize)]
pub struct S3Config {
    pub host: String,
    pub key_id: String,
    pub access_key: String,
    pub region: String,
    pub public_url: String,
}

#[derive(Deserialize, Default)]
pub struct NewRelicConfig {
    pub api_key: Option<String>,
}

#[derive(Deserialize)]
pub struct VTuber {
    pub id: String,
    pub youtube: Option<String>,
    pub bilibili: Option<String>,
}

impl Config {
    pub fn find_by_youtube_channel_id(&self, channel_id: &str) -> Option<&VTuber> {
        self.vtubers
            .iter()
            .find(|vtb| vtb.youtube.as_ref().map(|id| id.as_str()) == Some(channel_id))
    }

    pub fn find_by_bilibili_channel_id(&self, channel_id: &str) -> Option<&VTuber> {
        self.vtubers
            .iter()
            .find(|vtb| vtb.bilibili.as_ref().map(|id| id.as_str()) == Some(channel_id))
    }
}

pub static CONFIG: Lazy<Config> = Lazy::new(|| {
    let config = find_config(&env::current_dir().unwrap()).unwrap();

    toml::from_str(&config).unwrap()
});

fn find_config(directory: &Path) -> Result<String> {
    let path = directory.join("holostats.toml");

    match fs::metadata(&path) {
        Ok(metadata) => {
            if metadata.is_file() {
                let file = fs::read_to_string(path)?;

                return Ok(file);
            }
        }
        Err(error) => {
            if error.kind() != ErrorKind::NotFound {
                return Err(error);
            }
        }
    }

    if let Some(parent) = directory.parent() {
        find_config(parent)
    } else {
        Err(Error::new(ErrorKind::NotFound, "parent not found"))
    }
}
