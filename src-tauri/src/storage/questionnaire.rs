use anyhow::Result;
use rusqlite::{params_from_iter, Connection};

use crate::schema::{
    patient::{QuestionAnswer, QuestionnaireWithPatient},
    PaginationData, PatientSearchRequest,
};

pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS questionnaire (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER NOT NULL,
            score INTEGER,
            created_at INTEGER
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS questionnaire_answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER NOT NULL,
            questionnaire_id INTEGER NOT NULL,
            question_idx INTEGER,
            score INTEGER
        )",
        [],
    )?;

    Ok(())
}

pub fn insert_questionnaire(
    conn: &mut Connection,
    patient_id: i64,
    answers: &[QuestionAnswer],
) -> Result<()> {
    let now = chrono::Utc::now().timestamp();
    let score: i64 = answers.iter().map(|a| a.score as i64).sum();

    let tx = conn.transaction()?;
    tx.execute(
        "INSERT INTO questionnaire (patient_id, score, created_at) VALUES (?1, ?2, ?3)",
        [patient_id, score, now],
    )?;
    let questionnaire_id = tx.last_insert_rowid();
    for (_, a) in answers.iter().enumerate() {
        tx.execute(
            "INSERT INTO questionnaire_answers (patient_id, questionnaire_id, question_idx, score) 
            VALUES (?1, ?2, ?3, ?4)",
            [patient_id, questionnaire_id, a.question_idx, a.score],
        )?;
    }
    tx.commit()?;
    Ok(())
}

pub fn select_answers_by_id(conn: &Connection, id: i64) -> Result<Vec<QuestionAnswer>> {
    let mut stmt = conn.prepare(
        "SELECT question_idx, score FROM questionnaire_answers 
        WHERE questionnaire_id = ?1",
    )?;
    let rows = stmt.query_map([id], |row| {
        Ok(QuestionAnswer {
            question_idx: row.get(0)?,
            score: row.get(1)?,
        })
    })?;

    let mut questionnaire = Vec::new();
    for row in rows {
        questionnaire.push(row?);
    }

    Ok(questionnaire)
}

pub fn select_questionnaire_list(
    conn: &Connection,
    request: &PatientSearchRequest,
    page: i32,
    limit: i32,
) -> Result<PaginationData<QuestionnaireWithPatient>> {
    let mut conditions = Vec::new();
    let mut inputs = Vec::new();

    if let Some(name) = &request.name {
        conditions.push(format!("p.name = ?{}", inputs.len() + 1));
        inputs.push(name);
    }

    if let Some(registration_number) = &request.registration_number {
        conditions.push(format!("p.registration_number = ?{}", inputs.len() + 1));
        inputs.push(registration_number);
    }

    if let Some(contact) = &request.contact {
        conditions.push(format!("p.contact = ?{}", inputs.len() + 1));
        inputs.push(contact);
    }

    let where_clause = if conditions.is_empty() {
        String::new()
    } else {
        format!(" WHERE {}", conditions.join(" AND "))
    };

    let total_sql = format!(
        "SELECT COUNT(*) FROM questionnaire q
        JOIN patient p ON q.patient_id = p.id
        {}",
        where_clause
    );
    let total: i64 = conn.query_row(&total_sql, params_from_iter(inputs.clone()), |row| {
        row.get(0)
    })?;

    let mut sql = format!("SELECT q.id, q.score, q.created_at, p.registration_number, p.name, p.gender, p.birthday, p.weight, p.height FROM questionnaire q
        JOIN patient p ON q.patient_id = p.id
        {} ORDER BY q.created_at DESC", where_clause);
    sql.push_str(&format!(" LIMIT {} OFFSET {}", limit, (page - 1) * limit));

    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map(params_from_iter(inputs), |row| {
        Ok(QuestionnaireWithPatient {
            id: row.get(0)?,
            score: row.get(1)?,
            created_at: row.get(2)?,
            registration_number: row.get(3)?,
            name: row.get(4)?,
            gender: row.get(5)?,
            birthday: row.get(6)?,
            weight: row.get(7)?,
            height: row.get(8)?,
        })
    })?;

    let mut questionnaire = Vec::new();
    for row in rows {
        questionnaire.push(row?);
    }

    Ok(PaginationData {
        total,
        page,
        limit,
        items: questionnaire,
    })
}
