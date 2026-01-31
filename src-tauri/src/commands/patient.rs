use std::sync::Mutex;

use tauri::{Result, State};

use crate::{
    schema::{patient::Patient, PaginationData, PatientSearchRequest},
    storage::Storage,
};

#[tauri::command]
pub async fn create_patient(storage: State<'_, Mutex<Storage>>, data: &str) -> Result<i64> {
    println!("create_patient: {:?}", data);

    let storage = storage.lock().unwrap();
    let req: Patient = serde_json::from_str(data)?;
    let id = storage.create_patient(&req)?;
    Ok(id)
}

#[tauri::command]
pub async fn update_patient(storage: State<'_, Mutex<Storage>>, data: &str) -> Result<()> {
    let storage = storage.lock().unwrap();
    let patient: Patient = serde_json::from_str(data)?;
    storage.update_patient(&patient)?;
    Ok(())
}

#[tauri::command]
pub async fn get_patients(
    storage: State<'_, Mutex<Storage>>,
    data: &str,
    page: i32,
    limit: i32,
) -> Result<PaginationData<Patient>> {
    let storage = storage.lock().unwrap();
    let req: PatientSearchRequest = serde_json::from_str(data)?;
    let patients = storage.get_patients(&req, page, limit)?;
    Ok(patients)
}
