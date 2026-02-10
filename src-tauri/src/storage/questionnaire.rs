use anyhow::Result;
use rusqlite::Connection;

use crate::schema::{
    questionnaire::{QuestionAnswer, Questionnaire},
    PaginationData,
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
    patient_id: i64,
    page: i32,
    limit: i32,
) -> Result<PaginationData<Questionnaire>> {
    let total_sql = format!(
        "SELECT COUNT(*) FROM questionnaire WHERE patient_id = {}",
        patient_id
    );
    let total: i64 = conn.query_row(&total_sql, [], |row| row.get(0))?;

    let sql = format!(
        "
        SELECT id, patient_id, score, created_at FROM questionnaire
        WHERE patient_id = {} ORDER BY created_at DESC LIMIT {} OFFSET {}",
        patient_id,
        limit,
        (page - 1) * limit
    );

    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map([], |row| {
        Ok(Questionnaire {
            id: row.get(0)?,
            patient_id: row.get(1)?,
            score: row.get(2)?,
            created_at: row.get(3)?,
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
