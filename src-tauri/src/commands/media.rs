use std::sync::{Arc, Mutex};

use tauri::{Result, State};

use crate::{
    media::{start_media_server, MediaServerState, MEDIA_SERVER_STATE},
    system::Settings,
};

fn get_video_url(port: u16) -> String {
    format!("http://localhost:{}/media/1.mp4", port)
}

#[tauri::command]
pub async fn get_video(settings: State<'_, Arc<Mutex<Settings>>>) -> Result<String> {
    let settings = settings.clone();
    let data_dir = settings.lock().unwrap().data_dir.clone().unwrap();

    let state_once = MEDIA_SERVER_STATE.get_or_init(|| Mutex::new(None));

    {
        let state_guard = state_once.lock().unwrap();
        if let Some(ref state) = *state_guard {
            return Ok(get_video_url(state.listening_port));
        }
    }

    let port = start_media_server(&data_dir).await?;
    let mut state_guard = state_once.lock().unwrap();
    *state_guard = Some(Arc::new(MediaServerState {
        listening_port: port,
    }));

    Ok(get_video_url(port))
}
