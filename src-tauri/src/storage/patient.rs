use anyhow::Result;
use rusqlite::{params_from_iter, Connection};

use crate::{
    schema::{
        patient::{Patient, TreatmentCourse, TreatmentCourseBody},
        PaginationData, PatientSearchRequest,
    },
    storage::clinical,
};

pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS patient (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            registration_number TEXT NOT NULL,
            name TEXT NOT NULL,
            gender TEXT NOT NULL,
            menarche INTEGER DEFAULT 0,
            birthday INTEGER NOT NULL,
            school TEXT NOT NULL,
            grade TEXT NOT NULL,
            weight REAL NOT NULL,
            height REAL NOT NULL,
            contact TEXT NOT NULL,
            created_at INTEGER NOT NULL DEFAULT 0,
            updated_at INTEGER NOT NULL DEFAULT 0
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS treatment_course (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER NOT NULL,
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
            weight, height, contact, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
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
            name = ?1, gender = ?2, menarche = ?3, birthday = ?4, school = ?5, grade = ?6, 
            weight = ?7, height = ?8, contact = ?9, updated_at = ?10
        WHERE id = ?11",
        (
            &patient.name,
            &patient.gender,
            &patient.menarche,
            &patient.birthday,
            &patient.school,
            &patient.grade,
            patient.weight,
            patient.height,
            &patient.contact,
            now,
            patient.id,
        ),
    )?;

    Ok(())
}

pub fn insert_treatment_course(conn: &Connection, patient_id: i64) -> Result<i64> {
    let now = chrono::Utc::now().timestamp();

    conn.execute(
        "INSERT INTO treatment_course (patient_id, created_at, updated_at) VALUES (?1, ?2, ?3)",
        (patient_id, now, now),
    )?;

    let id = conn.last_insert_rowid();
    Ok(id)
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

    if let Some(gender) = &request.gender {
        conditions.push(format!("gender = ?{}", inputs.len() + 1));
        inputs.push(gender);
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
            created_at: row.get(11)?,
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

pub fn select_by_id(conn: &Connection, id: i64) -> Result<Patient> {
    let sql = "SELECT * FROM patient WHERE id = ?";
    let mut stmt = conn.prepare(sql)?;
    let row = stmt.query_row(params_from_iter([id]), |row| {
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
            created_at: row.get(11)?,
        })
    })?;
    Ok(row)
}

pub fn select_treatment_course_list(
    conn: &Connection,
    patient_id: i64,
) -> Result<Vec<TreatmentCourse>> {
    let sql = "SELECT * FROM treatment_course WHERE patient_id = ? ORDER BY id DESC";
    let mut stmt = conn.prepare(sql)?;
    let rows = stmt.query_map(params_from_iter([patient_id]), |row| {
        Ok(TreatmentCourse {
            id: row.get(0)?,
            patient_id: row.get(1)?,
            created_at: row.get(2)?,
            updated_at: row.get(3)?,
        })
    })?;
    let items: Vec<TreatmentCourse> = rows.collect::<Result<_, _>>()?;
    Ok(items)
}

pub fn select_treatment_course(conn: &Connection, id: i64) -> Result<TreatmentCourseBody> {
    let clinical = clinical::select(conn, id)?;
    let course = TreatmentCourseBody {
        clinical,
        image: None,
    };

    Ok(course)
}

pub fn select_latest_treatment_course(
    conn: &Connection,
    patient_id: i64,
) -> Result<TreatmentCourse> {
    let sql = "SELECT * FROM treatment_course WHERE patient_id = ? ORDER BY id DESC LIMIT 1";
    let mut stmt = conn.prepare(sql)?;
    let row = stmt.query_row(params_from_iter([patient_id]), |row| {
        Ok(TreatmentCourse {
            id: row.get(0)?,
            patient_id: row.get(1)?,
            created_at: row.get(2)?,
            updated_at: row.get(3)?,
        })
    })?;
    Ok(row)
}
