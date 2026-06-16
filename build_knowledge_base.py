import os
import json
import re
import sys
import docx
import pypdf

# Config paths
SOURCE_DIR = "/Users/honeyvachhani/Downloads/TRANSCRIPTIONS FOR MY BRAIN AI"
OUTPUT_FILE = "/Users/honeyvachhani/.gemini/antigravity/scratch/mirror-magic-agent/knowledge.json"

def clean_vtt(text):
    # Remove WEBVTT headers and time codes
    lines = text.split("\n")
    cleaned_lines = []
    for line in lines:
        line = line.strip()
        # Skip VTT formatting lines
        if not line:
            continue
        if line.startswith("WEBVTT"):
            continue
        if "-->" in line:
            continue
        if line.isdigit():
            continue
        cleaned_lines.append(line)
    return " ".join(cleaned_lines)

def parse_docx(path):
    doc = docx.Document(path)
    text = []
    for para in doc.paragraphs:
        if para.text.strip():
            text.append(para.text.strip())
    return "\n".join(text)

def parse_pdf(path):
    reader = pypdf.PdfReader(path)
    text = []
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text.append(extracted.strip())
    return "\n".join(text)

def chunk_text(text, filename, chunk_size=800, overlap=150):
    # Split text into paragraphs/sentences and rebuild chunks
    paragraphs = text.split("\n")
    chunks = []
    current_chunk = []
    current_len = 0
    
    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        
        para_len = len(para)
        if current_len + para_len > chunk_size:
            if current_chunk:
                chunks.append({
                    "source": filename,
                    "content": " ".join(current_chunk)
                })
            # Start new chunk with overlap if possible
            if len(current_chunk) > 1:
                current_chunk = current_chunk[-1:]  # Keep last sentence/paragraph for overlap
                current_len = len(current_chunk[0])
            else:
                current_chunk = []
                current_len = 0
                
        current_chunk.append(para)
        current_len += para_len
        
    if current_chunk:
        chunks.append({
            "source": filename,
            "content": " ".join(current_chunk)
        })
        
    return chunks

def build_db():
    if not os.path.exists(SOURCE_DIR):
        print(f"Source directory not found: {SOURCE_DIR}")
        sys.exit(1)
        
    all_chunks = []
    files = [f for f in os.listdir(SOURCE_DIR) if not f.startswith(".")]
    
    print(f"Scanning {len(files)} files in knowledge base folder...")
    
    for filename in files:
        filepath = os.path.join(SOURCE_DIR, filename)
        ext = os.path.splitext(filename)[1].lower()
        
        # Skip directories
        if os.path.isdir(filepath):
            continue
            
        print(f"Processing {filename}...")
        try:
            text = ""
            if ext == ".vtt":
                with open(filepath, "r", encoding="utf-8") as f:
                    text = clean_vtt(f.read())
            elif ext == ".txt":
                with open(filepath, "r", encoding="utf-8") as f:
                    text = f.read()
            elif ext == ".docx":
                text = parse_docx(filepath)
            elif ext == ".pdf":
                text = parse_pdf(filepath)
            else:
                # Skip other formats
                continue
                
            if text.strip():
                chunks = chunk_text(text, filename)
                all_chunks.extend(chunks)
                print(f"-> Generated {len(chunks)} chunks.")
        except Exception as e:
            print(f"Error parsing {filename}: {e}")
            
    print(f"Total chunks compiled: {len(all_chunks)}")
    
    # Save output
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2, ensure_ascii=False)
    print(f"Database successfully saved to: {OUTPUT_FILE}")

if __name__ == "__main__":
    build_db()
