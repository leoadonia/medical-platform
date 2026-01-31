use std::path::{Path, PathBuf};

use anyhow::Result;
use rusqlite::Connection;

use crate::schema::radiology::Radiology;

pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "
        CREATE TABLE IF NOT EXISTS radiology (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER NOT NULL,
            created_at INTEGER NOT NULL DEFAULT 0
        )",
        [],
    )?;
    Ok(())
}

pub fn insert(conn: &Connection, radiology: &Radiology, data_dir: &str) -> Result<i64> {
    let now = chrono::Utc::now().timestamp();

    conn.execute(
        "INSERT INTO radiology (patient_id, created_at) VALUES (?1, ?2)",
        (radiology.patient_id, now),
    )?;

    let id = conn.last_insert_rowid();

    let data_dir = Path::new(data_dir)
        .join("images")
        .join(radiology.patient_id.to_string())
        .join(id.to_string());
    std::fs::create_dir_all(&data_dir)?;

    save_radiology_image(
        &data_dir,
        &radiology.posture_backend,
        "posture_backend".to_string(),
    )?;
    save_radiology_image(
        &data_dir,
        &radiology.posture_frontend,
        "posture_fronted".to_string(),
    )?;
    save_radiology_image(
        &data_dir,
        &radiology.posture_left,
        "posture_left".to_string(),
    )?;
    save_radiology_image(
        &data_dir,
        &radiology.posture_right,
        "posture_right".to_string(),
    )?;

    Ok(id)
}

fn save_radiology_image(data_dir: &PathBuf, image: &str, category: String) -> Result<()> {
    if image.is_empty() {
        return Ok(());
    }

    let source = Path::new(image);
    if !source.exists() {
        return Err(anyhow::anyhow!("image file not found: {:?}", image));
    }

    let dest = data_dir.join(category);
    std::fs::copy(source, &dest)?;

    Ok(())
}
