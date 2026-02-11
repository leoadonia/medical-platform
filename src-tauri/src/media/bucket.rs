// - <data_dir>
//   |- <radiology>
//   |- <media>
//     |- <article>

use std::path::PathBuf;

use anyhow::Result;

const RADIOLOGY_BUCKET_NAME: &str = "radiology";
const MEDIA_BUCKET_NAME: &str = "media";
const MEDIA_ARTICLE_BUCKET_NAME: &str = "article";

pub struct Bucket {
    pub data_dir: String,
}

impl Bucket {
    pub fn new(data_dir: &str) -> Self {
        Self {
            data_dir: data_dir.to_string(),
        }
    }

    pub fn create_radiology_bucket(&self) -> Result<PathBuf> {
        let radiology_dir = PathBuf::from(&self.data_dir).join(RADIOLOGY_BUCKET_NAME);
        if !radiology_dir.exists() {
            std::fs::create_dir_all(&radiology_dir)?;
        }

        Ok(radiology_dir)
    }

    pub fn radiology_bucket(&self) -> PathBuf {
        PathBuf::from(&self.data_dir).join(RADIOLOGY_BUCKET_NAME)
    }

    pub fn create_media_bucket(&self) -> Result<PathBuf> {
        let media_dir = PathBuf::from(&self.data_dir).join(MEDIA_BUCKET_NAME);
        if !media_dir.exists() {
            std::fs::create_dir_all(&media_dir)?;
        }

        Ok(media_dir)
    }

    pub fn create_article_bucket(&self) -> Result<PathBuf> {
        let article_dir = PathBuf::from(&self.data_dir)
            .join(MEDIA_BUCKET_NAME)
            .join(MEDIA_ARTICLE_BUCKET_NAME);
        if !article_dir.exists() {
            std::fs::create_dir_all(&article_dir)?;
        }

        Ok(article_dir)
    }
}
