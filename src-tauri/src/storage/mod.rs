use std::path::Path;

use anyhow::Result;
use rusqlite::Connection;

use crate::schema::{
    clinical::Clinical,
    patient::{Patient, QuestionAnswer, QuestionnaireWithPatient},
    radiology::Radiology,
    user::User,
    PaginationData, PatientSearchRequest,
};

mod asset;
mod clinical;
mod patient;
mod questionnaire;
mod radiology;
mod user;

pub struct Storage {
    conn: Option<Connection>,
    data_dir: Option<String>,
}

impl Storage {
    pub fn new() -> Self {
        Self {
            conn: None,
            data_dir: None,
        }
    }

    pub fn init(&mut self, data_dir: &str) -> Result<()> {
        self.data_dir = Some(data_dir.to_string());

        let db_file = Path::new(data_dir).join("medical.db");
        let has_init = db_file.exists();
        self.conn = Some(Connection::open(db_file).map_err(|err| anyhow::anyhow!(err))?);
        if has_init {
            return Ok(());
        }

        let conn = self.conn.as_ref().unwrap();
        user::create_table(conn)?;
        patient::create_table(conn)?;
        clinical::create_table(conn)?;
        questionnaire::create_table(conn)?;
        radiology::create_table(conn)?;
        Ok(())
    }

    pub fn get_user_by_name(&self, name: &str) -> Result<User> {
        let conn = self.conn.as_ref().unwrap();
        user::select_by_name(conn, name)
    }

    pub fn get_user_list(&self, page: i32, limit: i32) -> Result<PaginationData<User>> {
        let conn = self.conn.as_ref().unwrap();
        user::get_list(conn, page, limit)
    }

    pub fn modify_user_password(&self, id: i64, password: &str) -> Result<()> {
        let conn = self.conn.as_ref().unwrap();
        user::update_password(conn, id, password)
    }

    pub fn add_user(&self, name: &str, password: &str) -> Result<()> {
        let conn = self.conn.as_ref().unwrap();
        user::add_user(conn, name, password)
    }

    pub fn delete_user(&self, id: i64) -> Result<()> {
        let conn = self.conn.as_ref().unwrap();
        user::delete(conn, id)
    }

    pub fn create_patient(&self, request: &Patient) -> Result<i64> {
        let conn = self.conn.as_ref().unwrap();
        let id = patient::insert(conn, request)?;
        // self.create_treatment_course(id, &request.treatment)?;

        Ok(id)
    }

    pub fn update_patient(&self, patient: &Patient) -> Result<()> {
        let conn = self.conn.as_ref().unwrap();
        patient::update(conn, patient)?;
        Ok(())
    }

    pub fn get_patients(
        &self,
        request: &PatientSearchRequest,
        page: i32,
        limit: i32,
    ) -> Result<PaginationData<Patient>> {
        let conn = self.conn.as_ref().unwrap();
        patient::get_list(conn, request, page, limit)
    }

    pub fn add_questionnaire(&mut self, patient_id: i64, answers: &[QuestionAnswer]) -> Result<()> {
        let mut conn = self.conn.as_mut().unwrap();
        questionnaire::insert_questionnaire(&mut conn, patient_id, answers)?;
        Ok(())
    }

    pub fn get_questionnaire(&self, id: i64) -> Result<Vec<QuestionAnswer>> {
        let conn = self.conn.as_ref().unwrap();
        questionnaire::select_answers_by_id(conn, id)
    }

    pub fn select_questionnaire_list(
        &self,
        request: &PatientSearchRequest,
        page: i32,
        limit: i32,
    ) -> Result<PaginationData<QuestionnaireWithPatient>> {
        let conn = self.conn.as_ref().unwrap();
        questionnaire::select_questionnaire_list(conn, request, page, limit)
    }

    pub fn select_clinical_list(
        &self,
        patient_id: i64,
        page: i32,
        limit: i32,
    ) -> Result<PaginationData<Clinical>> {
        let conn = self.conn.as_ref().unwrap();
        clinical::get_list(conn, patient_id, page, limit)
    }

    pub fn insert_clinical(&self, clinical: &Clinical) -> Result<i64> {
        let conn = self.conn.as_ref().unwrap();
        clinical::insert(conn, clinical)
    }

    pub fn insert_radiology(&self, radiology: &Radiology) -> Result<i64> {
        let conn = self.conn.as_ref().unwrap();
        let data_dir = self.data_dir.as_ref().unwrap();
        radiology::insert(conn, radiology, data_dir)
    }
}
