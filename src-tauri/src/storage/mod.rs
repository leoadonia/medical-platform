use std::path::Path;

use anyhow::Result;
use rusqlite::Connection;

use crate::schema::{
    patient::{
        MedicalImage, Patient, QuestionAnswer, QuestionnaireWithPatient, TreatmentCourseBody,
    },
    user::User,
    PaginationData, PatientInfo, PatientSearchRequest,
};

mod asset;
mod clinical;
mod patient;
mod questionnaire;
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

    pub fn create_treatment_course(
        &self,
        patient_id: i64,
        course: &TreatmentCourseBody,
    ) -> Result<()> {
        let conn = self.conn.as_ref().unwrap();
        let course_id = patient::insert_treatment_course(conn, patient_id)?;
        let _ = clinical::insert(conn, patient_id, course_id, &course.clinical)?;

        if let Some(image) = &course.image {
            let data_dir = Path::new(self.data_dir.as_ref().unwrap())
                .join("images")
                .join(patient_id.to_string());

            asset::save_medical_image(&data_dir, &image.x_ray, course_id, "x_ray".to_string())?;
            asset::save_medical_image(
                &data_dir,
                &image.posture_backend,
                course_id,
                "posture_backend".to_string(),
            )?;
            asset::save_medical_image(
                &data_dir,
                &image.posture_frontend,
                course_id,
                "posture_frontend".to_string(),
            )?;
            asset::save_medical_image(
                &data_dir,
                &image.posture_left,
                course_id,
                "posture_left".to_string(),
            )?;
            asset::save_medical_image(
                &data_dir,
                &image.posture_right,
                course_id,
                "posture_right".to_string(),
            )?;
        }

        Ok(())
    }

    pub fn select_treatment_course(&self, id: i64) -> Result<TreatmentCourseBody> {
        let conn = self.conn.as_ref().unwrap();
        let mut course = patient::select_treatment_course(conn, id)?;
        let base_dir = Path::new(self.data_dir.as_ref().unwrap())
            .join("images")
            .join(course.clinical.parent_id.to_string());

        course.image = Some(MedicalImage {
            x_ray: if let Some(image) = asset::get_medical_image(&base_dir, id, "x_ray".to_string())
            {
                image
            } else {
                "".to_string()
            },
            posture_backend: if let Some(image) =
                asset::get_medical_image(&base_dir, id, "posture_backend".to_string())
            {
                image
            } else {
                "".to_string()
            },
            posture_frontend: if let Some(image) =
                asset::get_medical_image(&base_dir, id, "posture_frontend".to_string())
            {
                image
            } else {
                "".to_string()
            },
            posture_left: if let Some(image) =
                asset::get_medical_image(&base_dir, id, "posture_left".to_string())
            {
                image
            } else {
                "".to_string()
            },
            posture_right: if let Some(image) =
                asset::get_medical_image(&base_dir, id, "posture_right".to_string())
            {
                image
            } else {
                "".to_string()
            },
        });

        Ok(course)
    }

    pub fn select_latest_treatment_course(&self, patient_id: i64) -> Result<TreatmentCourseBody> {
        let conn = self.conn.as_ref().unwrap();
        let course = patient::select_latest_treatment_course(conn, patient_id)?;
        self.select_treatment_course(course.id)
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
}
