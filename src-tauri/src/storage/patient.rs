use anyhow::Result;
use rusqlite::{
    params_from_iter,
    types::{FromSql, FromSqlError, ValueRef},
    Connection, ToSql,
};

use crate::schema::{
    clinical::Clinical,
    patient::{Patient, PatientState},
    PaginationData, PatientSearchRequest,
};

impl ToSql for PatientState {
    fn to_sql(&self) -> rusqlite::Result<rusqlite::types::ToSqlOutput<'_>> {
        let n = match self {
            Self::Init => 0,
            Self::StableMild => 1,
            Self::StableModerate => 2,
            Self::StableSerious => 3,
            Self::ProgressiveMild => 4,
            Self::ProgressiveModerate => 5,
            Self::ProgressiveSerious => 6,
            Self::MatureMild => 7,
            Self::MatureModerate => 8,
            Self::MatureSerious => 9,
        };
        Ok(rusqlite::types::ToSqlOutput::from(n))
    }
}

impl FromSql for PatientState {
    fn column_result(value: ValueRef<'_>) -> Result<PatientState, FromSqlError> {
        let n = value.as_i64()?;
        match n {
            0 => Ok(Self::Init),
            1 => Ok(Self::StableMild),
            2 => Ok(Self::StableModerate),
            3 => Ok(Self::StableSerious),
            4 => Ok(Self::ProgressiveMild),
            5 => Ok(Self::ProgressiveModerate),
            6 => Ok(Self::ProgressiveSerious),
            7 => Ok(Self::MatureMild),
            8 => Ok(Self::MatureModerate),
            9 => Ok(Self::MatureSerious),
            _ => Err(FromSqlError::InvalidType),
        }
    }
}

pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS patient (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            registration_number TEXT NOT NULL UNIQUE DEFAULT '',
            name TEXT NOT NULL,
            gender TEXT NOT NULL,
            menarche INTEGER DEFAULT 0,
            birthday INTEGER NOT NULL,
            school TEXT NOT NULL,
            grade TEXT NOT NULL,
            weight REAL NOT NULL,
            height REAL NOT NULL,
            contact TEXT NOT NULL,
            state INTEGER NOT NULL DEFAULT 0,
            created_at INTEGER NOT NULL DEFAULT 0,
            updated_at INTEGER NOT NULL DEFAULT 0
        )",
        [],
    )?;

    Ok(())
}

pub fn insert(conn: &Connection, patient: &Patient) -> Result<i64> {
    let now = chrono::Utc::now().timestamp();

    conn.execute(
        "INSERT INTO patient (
            registration_number, name, gender, menarche, birthday, school, grade, 
            weight, height, contact, state, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
        (
            &patient.registration_number,
            &patient.name,
            &patient.gender,
            &patient.menarche,
            &patient.birthday,
            &patient.school,
            &patient.grade,
            patient.weight,
            patient.height,
            &patient.contact,
            &patient.state,
            now,
            now,
        ),
    )?;

    let id = conn.last_insert_rowid();
    Ok(id)
}

pub fn update(conn: &Connection, patient: &Patient) -> Result<()> {
    let now = chrono::Utc::now().timestamp();

    conn.execute(
        "UPDATE patient SET 
            registration_number = ?1, name = ?2, gender = ?3, menarche = ?4, birthday = ?5, school = ?6, grade = ?7, 
            weight = ?8, height = ?9, contact = ?10, state = ?11, updated_at = ?12
        WHERE id = ?13",
        (
            &patient.registration_number,
            &patient.name,
            &patient.gender,
            &patient.menarche,
            &patient.birthday,
            &patient.school,
            &patient.grade,
            patient.weight,
            patient.height,
            &patient.contact,
            &patient.state,
            now,
            patient.id,
        ),
    )?;

    Ok(())
}

pub fn get_list(
    conn: &Connection,
    request: &PatientSearchRequest,
    page: i32,
    limit: i32,
) -> Result<PaginationData<Patient>> {
    let mut conditions = Vec::new();
    let mut inputs = Vec::new();

    if let Some(name) = &request.name {
        conditions.push(format!("name = ?{}", inputs.len() + 1));
        inputs.push(name);
    }

    if let Some(registration_number) = &request.registration_number {
        conditions.push(format!("registration_number = ?{}", inputs.len() + 1));
        inputs.push(registration_number);
    }

    if let Some(contact) = &request.contact {
        conditions.push(format!("contact = ?{}", inputs.len() + 1));
        inputs.push(contact);
    }

    let where_clause = if conditions.is_empty() {
        String::new()
    } else {
        format!(" WHERE {}", conditions.join(" AND "))
    };

    let total_sql = format!("SELECT COUNT(*) FROM patient {}", where_clause);
    let total: i64 = conn.query_row(&total_sql, params_from_iter(inputs.clone()), |row| {
        row.get(0)
    })?;

    let mut sql = format!("SELECT * FROM patient {} ORDER BY id DESC", where_clause);
    sql.push_str(&format!(" LIMIT {} OFFSET {}", limit, (page - 1) * limit));

    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map(params_from_iter(inputs), |row| {
        Ok(Patient {
            id: row.get(0)?,
            registration_number: row.get(1)?,
            name: row.get(2)?,
            gender: row.get(3)?,
            menarche: row.get(4)?,
            birthday: row.get(5)?,
            school: row.get(6)?,
            grade: row.get(7)?,
            weight: row.get(8)?,
            height: row.get(9)?,
            contact: row.get(10)?,
            state: row.get(11)?,
            created_at: row.get(12)?,
        })
    })?;

    let items: Vec<Patient> = rows.collect::<Result<_, _>>()?;
    Ok(PaginationData {
        total,
        items,
        page,
        limit,
    })
}

// Update the patient status once the latest clinical has been updated.
pub fn update_state(conn: &Connection, id: i64, clinical: &Clinical) -> Result<()> {
    let state = PatientState::from_clinical(clinical.risser, clinical.cobb.cobb);
    if state == PatientState::Init {
        return Ok(());
    }

    let now = chrono::Utc::now().timestamp();
    conn.execute(
        "UPDATE patient SET state = ?1, updated_at = ?2 WHERE id = ?3",
        (&state, now, id),
    )?;

    Ok(())
}
