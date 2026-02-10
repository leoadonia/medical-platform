use std::{
    path::Path,
    sync::{Arc, Mutex},
};

use tauri::{Result, State};

use crate::{
    media::{
        enable_video_file, get_video_files, start_media_server, MediaServerState, VideoFiles,
        MEDIA_SERVER_STATE,
    },
    system::Settings,
};

fn get_video_url(port: u16, video: &str) -> String {
    format!("http://localhost:{}/media/{}", port, video)
}

#[tauri::command]
pub async fn get_video(settings: State<'_, Arc<Mutex<Settings>>>) -> Result<String> {
    let settings = settings.clone();
    let data_dir = settings.lock().unwrap().data_dir.clone().unwrap();

    let video = settings.lock().unwrap().video.clone();
    if video.is_none() {
        return Ok("".to_string());
    }

    let state_once = MEDIA_SERVER_STATE.get_or_init(|| Mutex::new(None));

    {
        let state_guard = state_once.lock().unwrap();
        if let Some(ref state) = *state_guard {
            return Ok(get_video_url(
                state.listening_port,
                video.as_deref().unwrap(),
            ));
        }
    }

    let port = start_media_server(&data_dir).await?;
    let mut state_guard = state_once.lock().unwrap();
    *state_guard = Some(Arc::new(MediaServerState {
        listening_port: port,
    }));

    Ok(get_video_url(port, video.as_deref().unwrap()))
}

#[tauri::command]
pub async fn get_media_dir(settings: State<'_, Arc<Mutex<Settings>>>) -> Result<String> {
    let settings = settings.clone();
    let data_dir = settings.lock().unwrap().data_dir.clone().unwrap();

    let media_dir = Path::new(data_dir.as_str()).join("media");
    if !media_dir.exists() {
        std::fs::create_dir_all(&media_dir)?;
    }

    Ok(media_dir.into_os_string().into_string().unwrap())
}

#[tauri::command]
pub async fn get_videos(settings: State<'_, Arc<Mutex<Settings>>>) -> Result<VideoFiles> {
    let settings = settings.clone();
    let settings = settings.lock().unwrap();
    let video_files = get_video_files(&settings)?;
    Ok(video_files)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn enable_video(
    settings: State<'_, Arc<Mutex<Settings>>>,
    video_name: &str,
) -> Result<()> {
    let settings = settings.clone();
    let mut settings = settings.lock().unwrap();
    enable_video_file(&mut settings, video_name)?;
    Ok(())
}
