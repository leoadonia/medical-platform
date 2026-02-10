use std::{
    net::SocketAddr,
    path::PathBuf,
    sync::{Arc, Mutex, OnceLock},
};

use anyhow::{Ok, Result};
use axum::Router;
use serde::{Deserialize, Serialize};
use tower_http::services::ServeDir;

use crate::system::Settings;

#[derive(Debug, Serialize, Deserialize)]
pub struct VideoFiles {
    pub enabled: Option<String>,
    pub names: Vec<String>,
}

pub struct MediaServerState {
    pub listening_port: u16,
}

pub static MEDIA_SERVER_STATE: OnceLock<Mutex<Option<Arc<MediaServerState>>>> = OnceLock::new();

pub async fn start_media_server(data_dir: &str) -> Result<u16> {
    let media_dir = PathBuf::from(data_dir).join("media");
    if !media_dir.exists() {
        std::fs::create_dir_all(&media_dir)?;
    }

    let serve_dir = ServeDir::new(media_dir).append_index_html_on_directories(false);
    let app = Router::new().nest_service("/media", serve_dir);

    let addr = SocketAddr::from(([127, 0, 0, 1], 0));
    let listener = tokio::net::TcpListener::bind(addr).await?;

    let listening_port = listener.local_addr()?.port();

    tokio::spawn(async move {
        let server = axum::serve(listener, app.into_make_service());
        tokio::select! {
            _ = server => {
                println!("media server close.");
            }
        }
    });

    Ok(listening_port)
}

pub fn get_video_files(settings: &Settings) -> Result<VideoFiles> {
    let media_dir = PathBuf::from(settings.data_dir.as_ref().unwrap()).join("media");
    if !media_dir.exists() {
        return Ok(VideoFiles {
            enabled: None,
            names: Vec::new(),
        });
    }

    // Get all mp4 files in the media directory
    let mut names = Vec::new();
    for entry in std::fs::read_dir(media_dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.extension().map_or(false, |ext| ext == "mp4") {
            names.push(path.file_name().unwrap().to_string_lossy().to_string());
        }
    }

    Ok(VideoFiles {
        enabled: settings.video.clone(),
        names,
    })
}

pub fn enable_video_file(settings: &mut Settings, video_name: &str) -> Result<()> {
    let media_dir = PathBuf::from(settings.data_dir.as_ref().unwrap()).join("media");
    if !media_dir.exists() {
        return Err(anyhow::anyhow!("Media directory not exists."));
    }

    let video_path = media_dir.join(video_name);
    if !video_path.exists() {
        return Err(anyhow::anyhow!("Video file not exists."));
    }

    settings.update_video(video_name)
}
