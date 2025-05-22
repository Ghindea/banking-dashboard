import os
import subprocess

# === Setări ===
input_folder = "pdf_raw"         # folderul cu PDF-urile scanate
output_folder = "pdf_ocr"                # folderul unde salvezi PDF-urile cu OCR

os.makedirs(output_folder, exist_ok=True)

# === OCR pe fiecare fișier PDF din input_folder ===
for filename in os.listdir(input_folder):
    if filename.lower().endswith(".pdf"):
        input_path = os.path.join(input_folder, filename)
        output_path = os.path.join(output_folder, filename)
        
        print(f"[📄] Procesez: {filename}...")
        
        command = [
            "ocrmypdf",
            "--optimize", "3",
            "--deskew",
            "--output-type", "pdf",
            "--skip-text",
            "--language", "ron+eng",
            input_path,
            output_path
        ]
        
        result = subprocess.run(command)
        
        if result.returncode == 0:
            print(f"[✔] Gata: {output_path}")
        else:
            print(f"[❌] Eroare la: {filename}")

print("\n🎉 Toate documentele au fost procesate.")
