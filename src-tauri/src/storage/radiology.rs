use std::path::{Path, PathBuf};

use anyhow::Result;
use rusqlite::Connection;

use crate::{
    media::bucket::Bucket,
    schema::{radiology::Radiology, PaginationData},
};

enum RadiologyFileName {
    XRay,
    PostureBackend,
    PostureFrontend,
    PostureLeft,
    PostureRight,
}

impl RadiologyFileName {
    fn name(&self) -> &str {
        match self {
            Self::XRay => "x_ray",
            Self::PostureBackend => "posture_backend",
            Self::PostureFrontend => "posture_fronted",
            Self::PostureLeft => "posture_left",
            Self::PostureRight => "posture_right",
        }
    }
}

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

    let bucket = Bucket::new(data_dir);
    let data_dir = bucket.create_radiology_bucket()?;

    let data_dir = data_dir
        .join(radiology.patient_id.to_string())
        .join(id.to_string());
    std::fs::create_dir_all(&data_dir)?;

    save_radiology_image(&data_dir, &radiology.x_ray, RadiologyFileName::XRay.name())?;
    save_radiology_image(
        &data_dir,
        &radiology.posture_backend,
        RadiologyFileName::PostureBackend.name(),
    )?;
    save_radiology_image(
        &data_dir,
        &radiology.posture_frontend,
        RadiologyFileName::PostureFrontend.name(),
    )?;
    save_radiology_image(
        &data_dir,
        &radiology.posture_left,
        RadiologyFileName::PostureLeft.name(),
    )?;
    save_radiology_image(
        &data_dir,
        &radiology.posture_right,
        RadiologyFileName::PostureRight.name(),
    )?;

    Ok(id)
}

pub fn update(radiology: &Radiology, data_dir: &str) -> Result<()> {
    let bucket = Bucket::new(data_dir);
    let data_dir = bucket.radiology_bucket();
    let data_dir = data_dir
        .join(radiology.patient_id.to_string())
        .join(radiology.id.to_string());

    save_radiology_image(&data_dir, &radiology.x_ray, RadiologyFileName::XRay.name())?;
    save_radiology_image(
        &data_dir,
        &radiology.posture_backend,
        RadiologyFileName::PostureBackend.name(),
    )?;
    save_radiology_image(
        &data_dir,
        &radiology.posture_frontend,
        RadiologyFileName::PostureFrontend.name(),
    )?;
    save_radiology_image(
        &data_dir,
        &radiology.posture_left,
        RadiologyFileName::PostureLeft.name(),
    )?;
    save_radiology_image(
        &data_dir,
        &radiology.posture_right,
        RadiologyFileName::PostureRight.name(),
    )?;

    Ok(())
}

fn build_radiology_uri(http_port: u16, patient_id: i64, id: i64, category: &str) -> String {
    format!(
        "http://localhost:{}/radiology/{}/{}/{}",
        http_port, patient_id, id, category
    )
}

pub fn select_list(
    conn: &Connection,
    patient_id: i64,
    page: i32,
    limit: i32,
    data_dir: &str,
    http_port: u16,
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

    let bucket = Bucket::new(data_dir);
    let radiology_bucket = bucket.radiology_bucket();

    let mut data = Vec::new();
    for row in rows {
        let mut radiology = row?;
        let data_dir = radiology_bucket
            .join(radiology.patient_id.to_string())
            .join(radiology.id.to_string());

        let x_ray = data_dir.join(RadiologyFileName::XRay.name());
        if x_ray.exists() {
            radiology.x_ray = build_radiology_uri(
                http_port,
                radiology.patient_id,
                radiology.id,
                RadiologyFileName::XRay.name(),
            );
        }

        let posture_frontend = data_dir.join(RadiologyFileName::PostureFrontend.name());
        if posture_frontend.exists() {
            radiology.posture_frontend = build_radiology_uri(
                http_port,
                radiology.patient_id,
                radiology.id,
                RadiologyFileName::PostureFrontend.name(),
            );
        }

        let posture_backend = data_dir.join(RadiologyFileName::PostureBackend.name());
        if posture_backend.exists() {
            radiology.posture_backend = build_radiology_uri(
                http_port,
                radiology.patient_id,
                radiology.id,
                RadiologyFileName::PostureBackend.name(),
            );
        }

        let posture_left = data_dir.join(RadiologyFileName::PostureLeft.name());
        if posture_left.exists() {
            radiology.posture_left = build_radiology_uri(
                http_port,
                radiology.patient_id,
                radiology.id,
                RadiologyFileName::PostureLeft.name(),
            );
        }

        let posture_right = data_dir.join(RadiologyFileName::PostureRight.name());
        if posture_right.exists() {
            radiology.posture_right = build_radiology_uri(
                http_port,
                radiology.patient_id,
                radiology.id,
                RadiologyFileName::PostureRight.name(),
            );
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

fn save_radiology_image(data_dir: &PathBuf, image: &str, category: &str) -> Result<()> {
    if image.is_empty() {
        return Ok(());
    }

    if image.starts_with("http://") {
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
