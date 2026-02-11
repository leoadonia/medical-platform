use std::sync::{Arc, Mutex};

use tauri::{Result, State};

use crate::{
    media::start_media_server_once,
    schema::{radiology::Radiology, PaginationData},
    storage::Storage,
};

#[tauri::command]
pub async fn insert_radiology(storage: State<'_, Arc<Mutex<Storage>>>, data: &str) -> Result<i64> {
    let storage = storage.lock().unwrap();
    let radiology: Radiology = serde_json::from_str(data)?;
    let id = storage.insert_radiology(&radiology)?;
    Ok(id)
}

#[tauri::command]
pub async fn update_radiology(storage: State<'_, Arc<Mutex<Storage>>>, data: &str) -> Result<()> {
    let storage = storage.lock().unwrap();
    let radiology: Radiology = serde_json::from_str(data)?;
    storage.update_radiology(&radiology)?;
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub async fn select_radiology_list(
    storage: State<'_, Arc<Mutex<Storage>>>,
    patient_id: i64,
    page: i32,
    limit: i32,
) -> Result<PaginationData<Radiology>> {
    let storage = storage.clone();

    let data_dir = storage.lock().unwrap().data_dir.clone().unwrap();
    let port = start_media_server_once(&data_dir).await?;

    let items = storage
        .lock()
        .unwrap()
        .select_radiology_list(patient_id, page, limit, port)?;
    Ok(items)
}
