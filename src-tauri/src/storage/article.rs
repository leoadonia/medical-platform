use std::path::Path;

use anyhow::Result;
use rusqlite::{
    types::{FromSql, FromSqlError, ValueRef},
    Connection, ToSql,
};

use crate::schema::{
    article::{Article, ArticleState},
    PaginationData,
};

impl ToSql for ArticleState {
    fn to_sql(&self) -> rusqlite::Result<rusqlite::types::ToSqlOutput<'_>> {
        let n = match self {
            Self::Init => 0,
            Self::Published => 1,
        };
        Ok(rusqlite::types::ToSqlOutput::from(n))
    }
}

impl FromSql for ArticleState {
    fn column_result(value: ValueRef<'_>) -> Result<ArticleState, FromSqlError> {
        let n = value.as_i64()?;
        match n {
            0 => Ok(Self::Init),
            1 => Ok(Self::Published),
            _ => Err(FromSqlError::InvalidType),
        }
    }
}

pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS article (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL DEFAULT '',
            summary TEXT NOT NULL DEFAULT '',
            state INTEGER NOT NULL DEFAULT 0,
            created_at INTEGER NOT NULL DEFAULT 0,
            updated_at INTEGER NOT NULL DEFAULT 0
        )",
        [],
    )?;

    Ok(())
}

pub fn insert(conn: &Connection, data_dir: &str, article: &Article) -> Result<i64> {
    let now = chrono::Utc::now().timestamp();

    conn.execute(
        "INSERT INTO article (title, summary, state, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?4, ?5)",
        (&article.title, &article.summary, &article.state, now, now),
    )?;

    let id = conn.last_insert_rowid();

    // Copy assets.
    let dest = Path::new(data_dir)
        .join("media")
        .join("article")
        .join(id.to_string());
    if !dest.exists() {
        std::fs::create_dir_all(&dest)?;
    }

    println!("Saved article: {:?}", article);

    std::fs::copy(article.origin_file.as_str(), dest.join("source.pdf")).map_err(|err| {
        println!("Failed to copy pdf, {:?}", err);
        err
    })?;
    // Copy cover.
    if let Some(cover) = article.cover.as_deref() {
        std::fs::copy(cover, dest.join("cover.jpg")).map_err(|err| {
            println!("Failed to copy cover, {:?}", err);
            err
        })?;
    }

    Ok(id)
}

pub fn update(conn: &Connection, article: &Article) -> Result<()> {
    let now = chrono::Utc::now().timestamp();

    conn.execute(
        "UPDATE article SET title = ?1, summary = ?2, state = ?3, updated_at = ?4 WHERE id = ?5",
        (
            &article.title,
            &article.summary,
            &article.state,
            now,
            article.id,
        ),
    )?;

    Ok(())
}

pub fn get_list(
    conn: &Connection,
    data: &str,
    state: Option<ArticleState>,
    page: i32,
    limit: i32,
) -> Result<PaginationData<Article>> {
    let article_media = Path::new(data).join("media").join("article");

    let mut total_sql = "SELECT COUNT(*) FROM article".to_string();
    if let Some(state) = state {
        total_sql = format!(
            "SELECT COUNT(*) FROM article where state = {:?}",
            state.to_sql()
        );
    }

    println!("total: {}", total_sql);

    let total = conn.query_row(total_sql.as_str(), [], |row| row.get(0))?;

    let mut sql = "SELECT * from article".to_string();
    if let Some(state) = state {
        sql.push_str(&format!(" WHERE state = {:?}", state.to_sql()));
    }

    sql.push_str(&format!(
        " ORDER BY updated_at DESC LIMIT {} OFFSET {}",
        limit,
        (page - 1) * limit
    ));

    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map([], |row| {
        let id: i64 = row.get(0)?;
        let cover = article_media.join(id.to_string()).join("cover.jpg");
        let cover = if cover.exists() {
            Some(cover.to_string_lossy().to_string())
        } else {
            None
        };

        Ok(Article {
            id,
            title: row.get(1)?,
            summary: row.get(2)?,
            state: row.get(3)?,
            created_at: row.get(4)?,
            updated_at: row.get(5)?,
            origin_file: article_media
                .join(id.to_string())
                .join("source.pdf")
                .to_string_lossy()
                .to_string(),
            cover,
        })
    })?;

    let items: Vec<Article> = rows.collect::<Result<_, _>>()?;
    Ok(PaginationData {
        total,
        page,
        limit,
        items,
    })
}

pub fn delete(conn: &Connection, data_dir: &str, id: i64) -> Result<()> {
    conn.execute("DELETE FROM article WHERE id = ?", [id])?;
    let media_dir = Path::new(data_dir)
        .join("media")
        .join("article")
        .join(id.to_string());
    if media_dir.exists() {
        std::fs::remove_dir_all(&media_dir)?;
    }

    Ok(())
}
