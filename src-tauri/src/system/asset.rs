use anyhow::Result;
use base64::{engine::general_purpose, Engine};

pub fn read_image_data(path: &str) -> Result<String> {
    let bytes = std::fs::read(path)?;
    let asset = general_purpose::STANDARD.encode(&bytes);
    Ok(format!("data:image/*;base64,{}", asset))
}
