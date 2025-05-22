import os
import subprocess
from pdf2image import convert_from_path
from PIL import Image, ImageEnhance
from fpdf import FPDF

# === Setări ===
input_folder = "pdf_raw"
temp_folder = "temp_pdf_cleaned"
output_folder = "pdf_ocr_var2"

os.makedirs(temp_folder, exist_ok=True)
os.makedirs(output_folder, exist_ok=True)

dpi = 300

def preprocess_image(img: Image.Image) -> Image.Image:
    img = img.convert("L")  # Gri
    img = ImageEnhance.Contrast(img).enhance(2.0)
    threshold = 150
    return img.point(lambda x: 255 if x > threshold else 0)

def create_pdf_from_images(images, output_path):
    pdf = FPDF()
    for img in images:
        temp_img = "temp.jpg"
        img.save(temp_img, "JPEG")
        pdf.add_page()
        pdf.image(temp_img, x=0, y=0, w=210, h=297)
        os.remove(temp_img)
    pdf.output(output_path)

for filename in os.listdir(input_folder):
    if not filename.lower().endswith(".pdf"):
        continue

    input_path = os.path.join(input_folder, filename)
    temp_clean_pdf = os.path.join(temp_folder, f"cleaned_{filename}")
    final_pdf = os.path.join(output_folder, filename)

    print(f"[🔧] Procesare imagine: {filename}")
    pages = convert_from_path(input_path, dpi=dpi)
    processed = [preprocess_image(p) for p in pages]
    create_pdf_from_images(processed, temp_clean_pdf)

    print(f"[🧠] Aplic OCR: {filename}")
    subprocess.run([
        "ocrmypdf",
        "--skip-text",
        "--output-type", "pdf",
        "--language", "ron+eng",
        "--optimize", "3",
        "--deskew",
        temp_clean_pdf,
        final_pdf
    ])

    print(f"[✔] Gata: {final_pdf}")
