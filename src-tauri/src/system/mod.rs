use std::{
    fs,
    path::{Path, PathBuf},
};

use anyhow::{anyhow, Result};
use serde::{Deserialize, Serialize};

const SETTINGS_FILE_NAME: &str = "settings.json";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Settings {
    // The base directory for the application's data files, which is determined by tauri.
    pub app_dir: Option<String>,

    // The data directory for the application, default is `$app_dir`.
    pub data_dir: Option<String>,
}

impl Settings {
    pub fn new() -> Self {
        Self {
            app_dir: None,
            data_dir: None,
        }
    }

    pub fn load(&mut self, app_dir: &PathBuf) -> Result<()> {
        let settings_file = app_dir.join(SETTINGS_FILE_NAME);
        if !settings_file.exists() {
            let abs_path = fs::canonicalize(app_dir)?;
            let app_path = abs_path.to_string_lossy();
            self.app_dir = Some(app_path.to_string());
            self.data_dir = Some(app_path.to_string());

            return Ok(());
        }

        let data = std::fs::read_to_string(settings_file)?;
        *self = serde_json::from_str(&data)?;

        Ok(())
    }

    pub fn update(&mut self, data: &str) -> Result<()> {
        let settings: Settings = serde_json::from_str(data)?;

        if let Some(data_dir) = &settings.data_dir {
            let data_path = Path::new(data_dir.as_str());
            if !data_path.exists() {
                std::fs::create_dir_all(data_path)
                    .map_err(|e| anyhow::anyhow!("Failed to create data dir: {:?}", e))?;
            }

            *self = settings;

            let app_dir = self.app_dir.as_ref().unwrap();
            let settings_file = Path::new(app_dir).join(SETTINGS_FILE_NAME);
            std::fs::write(settings_file, serde_json::to_string_pretty(self)?)?;
            Ok(())
        } else {
            Err(anyhow!("Invalid settings, no data_dir."))
        }
    }
}
