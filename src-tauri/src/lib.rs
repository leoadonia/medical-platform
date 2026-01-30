use std::{path::PathBuf, sync::Mutex};

use anyhow::Result;
use tauri::{App, Manager};

use crate::{storage::Storage, system::Settings};

mod commands;
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
        .plugin(tauri_plugin_dialog::init())
        .setup(move |app| {
            let app_dir = create_app_dir_if_absent(app)?;
            settings.load(&app_dir)?;
            storage.init(settings.data_dir.as_ref().unwrap())?;

            let settings = Mutex::new(settings);
            app.manage(settings);

            let storage = Mutex::new(storage);
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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
