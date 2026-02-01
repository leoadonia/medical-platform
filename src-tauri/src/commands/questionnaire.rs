use std::sync::Mutex;

use tauri::{Result, State};

use crate::{
    schema::{
        questionnaire::{QuestionAnswer, Questionnaire},
        PaginationData,
    },
    storage::Storage,
};

#[tauri::command(rename_all = "snake_case")]
pub async fn add_questionnaire(
    storage: State<'_, Mutex<Storage>>,
    patient_id: i64,
    answers: &str,
) -> Result<()> {
    let mut storage = storage.lock().unwrap();
    let answers: Vec<QuestionAnswer> = serde_json::from_str(answers)?;
    storage.add_questionnaire(patient_id, &answers)?;
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub async fn get_questionnaire(
    storage: State<'_, Mutex<Storage>>,
    id: i64,
) -> Result<Vec<QuestionAnswer>> {
    let storage = storage.lock().unwrap();
    let questionnaire = storage.get_questionnaire(id)?;
    Ok(questionnaire)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn get_questionnaires(
    storage: State<'_, Mutex<Storage>>,
    patient_id: i64,
    page: i32,
    limit: i32,
) -> Result<PaginationData<Questionnaire>> {
    let storage = storage.lock().unwrap();
    let questionnaire = storage.select_questionnaire_list(patient_id, page, limit)?;
    Ok(questionnaire)
}
