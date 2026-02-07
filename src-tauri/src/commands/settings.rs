use std::sync::{Arc, Mutex};

use tauri::{Result, State};

use crate::system::Settings;

#[tauri::command]
pub async fn get_settings(settings: State<'_, Arc<Mutex<Settings>>>) -> Result<Settings> {
    let settings = settings.lock().unwrap();
    Ok(settings.clone())
}

#[tauri::command]
pub async fn update_settings(settings: State<'_, Arc<Mutex<Settings>>>, data: &str) -> Result<()> {
    let mut settings = settings.lock().unwrap();
    settings.update(data)?;
    Ok(())
}
