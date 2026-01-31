use std::sync::Mutex;

use tauri::{Result, State};

use crate::{schema::radiology::Radiology, storage::Storage};

#[tauri::command]
pub async fn insert_radiology(storage: State<'_, Mutex<Storage>>, data: &str) -> Result<i64> {
    let storage = storage.lock().unwrap();
    let radiology: Radiology = serde_json::from_str(data)?;
    let id = storage.insert_radiology(&radiology)?;
    Ok(id)
}
