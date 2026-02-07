use std::{
    net::SocketAddr,
    path::PathBuf,
    sync::{Arc, Mutex, OnceLock},
};

use anyhow::{Ok, Result};
use axum::Router;
use tower_http::services::ServeDir;

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
