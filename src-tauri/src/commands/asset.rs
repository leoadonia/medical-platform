use tauri::Result;

use crate::system::asset;

#[tauri::command]
pub async fn resolve_asset(path: &str) -> Result<String> {
    let asset = asset::read_image_data(path)?;
    Ok(asset)
}
