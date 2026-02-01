use std::path::{Path, PathBuf};

use anyhow::Result;
use rusqlite::Connection;

use crate::schema::{radiology::Radiology, PaginationData};

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

    save_radiology_image(&data_dir, &radiology.x_ray, "x_ray".to_string())?;
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

pub fn update(radiology: &Radiology, data_dir: &str) -> Result<()> {
    let data_dir = Path::new(data_dir)
        .join("images")
        .join(radiology.patient_id.to_string())
        .join(radiology.id.to_string());
    std::fs::create_dir_all(&data_dir)?;

    save_radiology_image(&data_dir, &radiology.x_ray, "x_ray".to_string())?;
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

    Ok(())
}

pub fn select_list(
    conn: &Connection,
    patient_id: i64,
    page: i32,
    limit: i32,
    data_dir: &str,
) -> Result<PaginationData<Radiology>> {
    let total_sql = format!(
        "SELECT COUNT(*) FROM radiology WHERE patient_id = {}",
        patient_id
    );
    let total: i64 = conn.query_row(&total_sql, [], |row| row.get(0))?;

    let offset = (page - 1) * limit;
    let mut stmt = conn.prepare(
        "SELECT id, patient_id, created_at FROM radiology WHERE patient_id = ?1 ORDER BY id DESC LIMIT ?2 OFFSET ?3",
    )?;
    let rows = stmt.query_map((patient_id, limit, offset), |row| {
        Ok(Radiology {
            id: row.get(0)?,
            patient_id: row.get(1)?,
            created_at: row.get(2)?,
            x_ray: String::new(),
            posture_frontend: String::new(),
            posture_backend: String::new(),
            posture_left: String::new(),
            posture_right: String::new(),
        })
    })?;

    let mut data = Vec::new();
    for row in rows {
        let mut radiology = row?;
        let data_dir = Path::new(data_dir)
            .join("images")
            .join(radiology.patient_id.to_string())
            .join(radiology.id.to_string());

        let x_ray = data_dir.join("x_ray");
        if x_ray.exists() {
            radiology.x_ray = x_ray.to_string_lossy().to_string();
        }

        let posture_frontend = data_dir.join("posture_fronted");
        if posture_frontend.exists() {
            radiology.posture_frontend = posture_frontend.to_string_lossy().to_string();
        }

        let posture_backend = data_dir.join("posture_backend");
        if posture_backend.exists() {
            radiology.posture_backend = posture_backend.to_string_lossy().to_string();
        }

        let posture_left = data_dir.join("posture_left");
        if posture_left.exists() {
            radiology.posture_left = posture_left.to_string_lossy().to_string();
        }

        let posture_right = data_dir.join("posture_right");
        if posture_right.exists() {
            radiology.posture_right = posture_right.to_string_lossy().to_string();
        }

        data.push(radiology);
    }

    Ok(PaginationData {
        page,
        limit,
        total: total,
        items: data,
    })
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
