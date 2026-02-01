use std::sync::Mutex;

use tauri::{Result, State};

use crate::{
    schema::{clinical::Clinical, PaginationData},
    storage::Storage,
};

#[tauri::command(rename_all = "snake_case")]
pub async fn get_clinical_list(
    storage: State<'_, Mutex<Storage>>,
    patient_id: i64,
    page: i32,
    limit: i32,
) -> Result<PaginationData<Clinical>> {
    let storage = storage.lock().unwrap();
    let items = storage.select_clinical_list(patient_id, page, limit)?;
    Ok(items)
}

#[tauri::command]
pub async fn insert_clinical(storage: State<'_, Mutex<Storage>>, data: &str) -> Result<i64> {
    let storage = storage.lock().unwrap();
    let clinical: Clinical = serde_json::from_str(data)?;
    let id = storage.insert_clinical(&clinical)?;
    Ok(id)
}

#[tauri::command]
pub async fn update_clinical(storage: State<'_, Mutex<Storage>>, data: &str) -> Result<()> {
    let storage = storage.lock().unwrap();
    let clinical: Clinical = serde_json::from_str(data)?;
    storage.update_clinical(&clinical)?;
    Ok(())
}
