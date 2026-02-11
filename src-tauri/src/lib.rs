use std::{
    path::PathBuf,
    sync::{Arc, Mutex},
};

use anyhow::Result;
use tauri::{App, Manager};

use crate::{storage::Storage, system::Settings};

mod commands;
mod media;
mod schema;
mod storage;
mod system;

fn create_app_dir_if_absent(app: &App) -> Result<PathBuf> {
    let app_dir = app.path().app_local_data_dir()?;
    if !app_dir.exists() {
        std::fs::create_dir_all(&app_dir)?;
    }

    Ok(app_dir)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut settings = Settings::new();
    let mut storage = Storage::new();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(move |app| {
            let app_dir = create_app_dir_if_absent(app)?;
            settings.load(&app_dir)?;
            storage.init(settings.data_dir.as_ref().unwrap())?;

            // As the Settings will be used in multiple threads (e.g., starting http server),
            // we need to wrap it in an Arc<Mutex<Settings>>.
            let settings = Arc::new(Mutex::new(settings));
            app.manage(settings);

            let storage = Arc::new(Mutex::new(storage));
            app.manage(storage);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::user::add_user,
            commands::user::delete_user,
            commands::user::get_user_session,
            commands::user::get_users,
            commands::user::modify_password,
            commands::patient::get_patients,
            commands::patient::create_patient,
            commands::patient::update_patient,
            commands::patient::get_patient,
            commands::clinical::get_clinical_list,
            commands::clinical::insert_clinical,
            commands::clinical::update_clinical,
            commands::radiology::insert_radiology,
            commands::radiology::update_radiology,
            commands::radiology::select_radiology_list,
            commands::asset::resolve_asset,
            commands::asset::read_pdf,
            commands::questionnaire::add_questionnaire,
            commands::questionnaire::get_questionnaire,
            commands::questionnaire::get_questionnaires,
            commands::settings::get_settings,
            commands::settings::update_settings,
            commands::media::get_video,
            commands::media::get_media_dir,
            commands::media::get_videos,
            commands::media::enable_video,
            commands::article::parse_pdf,
            commands::article::save_article,
            commands::article::get_article_list,
            commands::article::delete_article,
            commands::article::update_article
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
