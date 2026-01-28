use anyhow::Result;
use rusqlite::Connection;

use crate::schema::clinical::Clinical;

pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "
        CREATE TABLE IF NOT EXISTS clinical (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER NOT NULL,
            treatment_course_id INTEGER NOT NULL,
            brace JSON,
            treatment TEXT NOT NULL,
            exercise JSON,
            mobility JSON,
            balance JSON,
            tenderness TEXT,
            percussion TEXT,
            posture JSON,
            cobb INTEGER NOT NULL,
            flexion_atr JSON,
            pain_rate INTEGER NOT NULL DEFAULT 0,
            created_at INTEGER NOT NULL DEFAULT 0,
            updated_at INTEGER NOT NULL DEFAULT 0
        )",
        [],
    )?;
    Ok(())
}

pub fn insert(
    conn: &Connection,
    patient_id: i64,
    treatment_course_id: i64,
    clinical: &Clinical,
) -> Result<i64> {
    let now = chrono::Utc::now().timestamp();

    let exercise = match &clinical.exercise {
        Some(exercise) => serde_json::to_string(exercise)?,
        None => "".to_string(),
    };

    let brace = match &clinical.brace {
        Some(brace) => serde_json::to_string(brace)?,
        None => "".to_string(),
    };

    conn.execute(
        "INSERT INTO clinical (
            patient_id, treatment_course_id, brace, treatment, exercise, mobility, balance, tenderness, percussion, 
            posture, cobb, flexion_atr, pain_rate, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)",
        (
            patient_id,
            treatment_course_id,
            &brace,
            &clinical.treatment,
            &exercise,
            serde_json::to_string(&clinical.mobility)?,
            serde_json::to_string(&clinical.balance)?,
            &clinical.tenderness,
            &clinical.percussion,
            serde_json::to_string(&clinical.posture)?,
            clinical.cobb,
            serde_json::to_string(&clinical.flexion_atr)?,
            clinical.pain_rate,
            now,
            now,
        ),
    )?;

    let id = conn.last_insert_rowid();
    Ok(id)
}

pub fn select(conn: &Connection, treatment_course_id: i64) -> Result<Clinical> {
    let sql = "SELECT * FROM clinical WHERE treatment_course_id = ?1";
    let mut stmt = conn.prepare(sql)?;
    let row = stmt.query_row([treatment_course_id], |row| {
        Ok(Clinical {
            parent_id: row.get(1)?,
            treatment_course_id: row.get(2)?,
            brace: serde_json::from_str(row.get::<_, String>(3)?.as_str()).ok(),
            treatment: row.get(4)?,
            exercise: serde_json::from_str(row.get::<_, String>(5)?.as_str()).ok(),
            mobility: serde_json::from_str(row.get::<_, String>(6)?.as_str()).unwrap(),
            balance: serde_json::from_str(row.get::<_, String>(7)?.as_str()).unwrap(),
            tenderness: row.get(8)?,
            percussion: row.get(9)?,
            posture: serde_json::from_str(row.get::<_, String>(10)?.as_str()).unwrap(),
            cobb: row.get(11)?,
            flexion_atr: serde_json::from_str(row.get::<_, String>(12)?.as_str()).unwrap(),
            pain_rate: row.get(13)?,
        })
    })?;
    Ok(row)
}
