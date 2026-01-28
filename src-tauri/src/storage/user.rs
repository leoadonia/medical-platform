use anyhow::Result;
use chrono::Utc;
use rusqlite::Connection;

use crate::schema::{user::User, PaginationData};

pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS user(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        password TEXT,
        created_at INTEGER,
        updated_at INTEGER
    )",
        [],
    )?;

    add_user(conn, "admin", "admin123")?;

    Ok(())
}

pub fn select_by_name(conn: &Connection, name: &str) -> Result<User> {
    let mut stmt = conn.prepare("SELECT * FROM user WHERE name = ?1")?;
    let user = stmt.query_row([name], |row| {
        Ok(User {
            id: row.get(0)?,
            name: row.get(1)?,
            password: row.get(2)?,
            created_at: row.get(3)?,
        })
    })?;
    Ok(user)
}

pub fn get_list(conn: &Connection, page: i32, limit: i32) -> Result<PaginationData<User>> {
    let offset = (page - 1) * limit;
    let mut stmt = conn.prepare("SELECT * FROM user LIMIT ?1 OFFSET ?2")?;
    let rows = stmt.query_map([limit, offset], |row| {
        Ok(User {
            id: row.get(0)?,
            name: row.get(1)?,
            password: row.get(2)?,
            created_at: row.get(3)?,
        })
    })?;

    let users = rows.collect::<Result<_, _>>()?;
    let total = conn.query_row("SELECT COUNT(*) FROM user", [], |row| row.get(0))?;

    Ok(PaginationData {
        total,
        page,
        limit,
        items: users,
    })
}

pub fn update_password(conn: &Connection, id: i64, password: &str) -> Result<()> {
    let now = Utc::now();
    let now_ts = now.timestamp();
    conn.execute(
        "UPDATE user SET password = ?1, updated_at = ?2 WHERE id = ?3",
        (password, now_ts, id),
    )?;
    Ok(())
}

pub fn add_user(conn: &Connection, name: &str, password: &str) -> Result<()> {
    let now = Utc::now();
    let now_ts = now.timestamp();
    conn.execute(
        "INSERT INTO user (name, password, created_at, updated_at) VALUES (?1, ?2, ?3, ?4)",
        (name, password, now_ts, now_ts),
    )?;
    Ok(())
}

pub fn delete(conn: &Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM user WHERE id = ?1", (id,))?;
    Ok(())
}
