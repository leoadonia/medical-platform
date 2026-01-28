use std::path::{Path, PathBuf};

use anyhow::{Ok, Result};

pub fn save_medical_image(
    data_dir: &PathBuf,
    image: &str,
    course_id: i64,
    category: String,
) -> Result<()> {
    if image.is_empty() {
        return Ok(());
    }

    let image_dir = data_dir.join(course_id.to_string());
    std::fs::create_dir_all(&image_dir)?;

    let image_src = Path::new(image);
    if !image_src.exists() {
        return Err(anyhow::anyhow!("Image file not found: {:?}", image_src));
    }

    let extension = image_src.extension().unwrap_or_default();
    let image_dst = image_dir.join(format!("{}.{}", category, extension.to_string_lossy()));
    std::fs::copy(image_src, &image_dst)?;

    Ok(())
}

pub fn get_medical_image(data_dir: &PathBuf, course_id: i64, category: String) -> Option<String> {
    let image_dir = data_dir.join(course_id.to_string());
    if !image_dir.exists() {
        return None;
    }

    // Search for the image file starts with category.
    let image_files = image_dir
        .read_dir()
        .unwrap()
        .filter_map(|entry| entry.ok())
        .map(|entry| entry.path())
        .collect::<Vec<_>>();

    let image_file = image_files.into_iter().find(|path| {
        path.file_stem()
            .unwrap()
            .to_string_lossy()
            .starts_with(&category)
    })?;

    Some(image_file.to_string_lossy().to_string())
}
