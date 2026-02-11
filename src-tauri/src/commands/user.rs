use std::sync::{Arc, Mutex};

use tauri::{Result, State};

use crate::{
    schema::{
        user::{User, UserSessionRequest},
        PaginationData,
    },
    storage::Storage,
};

#[tauri::command]
pub async fn get_user_session(storage: State<'_, Arc<Mutex<Storage>>>, data: &str) -> Result<User> {
    let storage = storage.lock().unwrap();
    let request: UserSessionRequest = serde_json::from_str(data)?;
    let user = storage
        .get_user_by_name(&request.name)
        .map_err(|_| anyhow::anyhow!("用户不存在"))?;

    if user.password != request.password {
        return Err(anyhow::anyhow!("用户名或者密码不正确").into());
    }

    Ok(user)
}

#[tauri::command]
pub async fn get_users(
    storage: State<'_, Arc<Mutex<Storage>>>,
    page: i32,
    limit: i32,
) -> Result<PaginationData<User>> {
    let storage = storage.lock().unwrap();
    let users = storage.get_user_list(page, limit)?;
    Ok(users)
}

#[tauri::command]
pub async fn modify_password(
    storage: State<'_, Arc<Mutex<Storage>>>,
    id: i64,
    password: &str,
) -> Result<()> {
    let storage = storage.lock().unwrap();
    storage.modify_user_password(id, password)?;
    Ok(())
}

#[tauri::command]
pub async fn add_user(storage: State<'_, Arc<Mutex<Storage>>>, data: &str) -> Result<()> {
    let storage = storage.lock().unwrap();
    let user: User = serde_json::from_str(data)?;
    storage.add_user(&user.name, &user.password)?;
    Ok(())
}

#[tauri::command]
pub async fn delete_user(storage: State<'_, Arc<Mutex<Storage>>>, id: i64) -> Result<()> {
    let storage = storage.lock().unwrap();
    storage.delete_user(id)?;
    Ok(())
}
