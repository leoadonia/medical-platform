use anyhow::Result;
use pdfium_render::prelude::{PdfPageObjectsCommon, Pdfium};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct PdfMetadata {
    pub title: Option<String>,
    pub summary: Option<String>,
}

pub struct StringBuilder {
    inner: String,
    capacity: usize,
}

impl StringBuilder {
    pub fn new(capacity: usize) -> Self {
        Self {
            inner: String::with_capacity(capacity),
            capacity,
        }
    }

    pub fn push(&mut self, s: &str) {
        if self.inner.len() + s.len() > self.capacity {
            return;
        }

        self.inner.push_str(s);
    }

    pub fn guess_title(&mut self) -> Option<String> {
        let splitter = ["。", "？", "！", "<image>"];
        let mut splitter_at = 0;

        let mut matched_splitter = 0;

        for (idx, s) in splitter.iter().enumerate() {
            if let Some(index) = self.inner.find(s) {
                if splitter_at == 0 || splitter_at > index {
                    splitter_at = index + s.len();
                    matched_splitter = idx;
                }
            }
        }

        if splitter_at == 0 {
            return None;
        }

        let mut title = self.inner[0..splitter_at].to_string();
        if matched_splitter == 3 {
            title.truncate(title.len() - splitter[3].len());
        }

        self.inner = self.inner[splitter_at..].to_string();
        return Some(title);
    }

    pub fn summary(&self) -> &str {
        self.inner.as_str()
    }
}

pub fn parse_pdf(app_dir: &str, pdf: &str) -> Result<PdfMetadata> {
    let pdfium = Pdfium::new(
        Pdfium::bind_to_library(Pdfium::pdfium_platform_library_name_at_path(app_dir))
            .or_else(|_| Pdfium::bind_to_system_library())
            .map_err(|e| anyhow::anyhow!("Failed to load pdfium library, {:?}", e))?,
    );
    let document = pdfium.load_pdf_from_file(pdf, None)?;

    if document.pages().len() == 0 {
        return Err(anyhow::anyhow!("Invalid pdf, no pages found"));
    }

    let first_page = document.pages().first()?;

    // Extract text, max length is 1000.
    let mut sb = StringBuilder::new(1000);
    let mut found_image = false;

    first_page
        .objects()
        .iter()
        .enumerate()
        .for_each(|(_, object)| {
            if let Some(text) = object.as_text_object() {
                sb.push(text.text().as_str());
            } else if let Some(_) = object.as_image_object() {
                if !found_image {
                    sb.push("<image>");
                    found_image = true;
                }

                // if let Ok(image) = image.get_raw_image() {
                //     let path = tmpdir.join(format!("img-{}.jpg", index));
                //     let r = image.save(path.to_str().unwrap());
                //     if r.is_ok() {
                //         images.push(path.to_string_lossy().to_string());
                //     }
                // }
            }
        });

    Ok(PdfMetadata {
        title: sb.guess_title(),
        summary: Some(sb.summary().to_string()),
    })
}
