use anyhow::Result;
use rusqlite::Connection;

use crate::{
    schema::{clinical::Clinical, PaginationData},
    storage::patient,
};

pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "
        CREATE TABLE IF NOT EXISTS clinical (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER NOT NULL,
            brace JSON,
            treatment TEXT NOT NULL,
            exercise JSON,
            mobility JSON,
            balance JSON,
            tenderness TEXT,
            percussion TEXT,
            posture JSON,
            cobb JSON NOT NULL,
            flexion_atr JSON,
            pain_rate INTEGER NOT NULL DEFAULT 0,
            extremity JSON,
            risser INTEGER NOT NULL DEFAULT 0,
            created_at INTEGER NOT NULL DEFAULT 0,
            updated_at INTEGER NOT NULL DEFAULT 0
        )",
        [],
    )?;
    Ok(())
}

pub fn insert(conn: &Connection, clinical: &Clinical) -> Result<i64> {
    let now = chrono::Utc::now().timestamp();

    let exercise = match &clinical.exercise {
        Some(exercise) => serde_json::to_string(exercise)?,
        None => "".to_string(),
    };

    let brace = match &clinical.brace {
        Some(brace) => serde_json::to_string(brace)?,
        None => "".to_string(),
    };

    println!("insert clinical: {:?}", clinical);

    conn.execute(
        "INSERT INTO clinical (
            patient_id, brace, treatment, exercise, mobility, balance, tenderness, percussion, 
            posture, cobb, flexion_atr, pain_rate, extremity, risser, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)",
        (
            clinical.patient_id,
            &brace,
            &clinical.treatment,
            &exercise,
            serde_json::to_string(&clinical.mobility)?,
            serde_json::to_string(&clinical.balance)?,
            &clinical.tenderness,
            &clinical.percussion,
            serde_json::to_string(&clinical.posture)?,
            serde_json::to_string(&clinical.cobb)?,
            serde_json::to_string(&clinical.flexion_atr)?,
            clinical.pain_rate,
            serde_json::to_string(&clinical.extremity)?,
            clinical.risser,
            now,
            now,
        ),
    )?;

    let id = conn.last_insert_rowid();

    patient::update_state(conn, clinical.patient_id, clinical)?;

    Ok(id)
}

pub fn update(conn: &Connection, clinical: &Clinical) -> Result<()> {
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
        "UPDATE clinical SET 
            brace = ?1, treatment = ?2, exercise = ?3, mobility = ?4, balance = ?5, tenderness = ?6, percussion = ?7, 
            posture = ?8, cobb = ?9, flexion_atr = ?10, pain_rate = ?11, extremity = ?12, risser = ?13, updated_at = ?14
        WHERE id = ?15",
        (
            &brace,
            &clinical.treatment,
            &exercise,
            serde_json::to_string(&clinical.mobility)?,
            serde_json::to_string(&clinical.balance)?,
            &clinical.tenderness,
            &clinical.percussion,
            serde_json::to_string(&clinical.posture)?,
            serde_json::to_string(&clinical.cobb)?,
            serde_json::to_string(&clinical.flexion_atr)?,
            clinical.pain_rate,
            serde_json::to_string(&clinical.extremity)?,
            clinical.risser,
            now,
            clinical.id))?;

    Ok(())
}

pub fn get_list(
    conn: &Connection,
    patient_id: i64,
    page: i32,
    limit: i32,
) -> Result<PaginationData<Clinical>> {
    let total_sql = format!(
        "SELECT COUNT(*) FROM clinical where patient_id = {}",
        patient_id
    );
    let total: i64 = conn.query_row(&total_sql, [], |row| row.get(0))?;

    let mut sql = format!(
        "SELECT * FROM clinical where patient_id = {} ORDER BY id DESC",
        patient_id
    );
    sql.push_str(&format!(" LIMIT {} OFFSET {}", limit, (page - 1) * limit));

    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map([], |row| {
        Ok(Clinical {
            id: row.get(0)?,
            patient_id: row.get(1)?,
            brace: serde_json::from_str(row.get::<_, String>(2)?.as_str()).ok(),
            treatment: row.get(3)?,
            exercise: serde_json::from_str(row.get::<_, String>(4)?.as_str()).ok(),
            mobility: serde_json::from_str(row.get::<_, String>(5)?.as_str()).unwrap(),
            balance: serde_json::from_str(row.get::<_, String>(6)?.as_str()).unwrap(),
            tenderness: row.get(7)?,
            percussion: row.get(8)?,
            posture: serde_json::from_str(row.get::<_, String>(9)?.as_str()).unwrap(),
            cobb: serde_json::from_str(row.get::<_, String>(10)?.as_str()).unwrap(),
            flexion_atr: serde_json::from_str(row.get::<_, String>(11)?.as_str()).unwrap(),
            pain_rate: row.get(12)?,
            extremity: serde_json::from_str(row.get::<_, String>(13)?.as_str()).unwrap(),
            risser: row.get(14)?,
            created_at: row.get(15)?,
        })
    })?;

    let items: Vec<Clinical> = rows.collect::<Result<_, _>>()?;
    Ok(PaginationData {
        total,
        items,
        page,
        limit,
    })
}
