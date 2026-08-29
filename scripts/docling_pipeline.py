#!/usr/bin/env python3
"""
Docling Document Ingestion & AI Slop Normalization Pipeline
OpenSchool Blueprint Engine

Converts educational briefs, tender specifications, and donor requirements
from PDF/DOCX into structured OpenSchool project files, Typst layouts, or cleaned Markdown.
"""

import sys
import os
import json
import argparse
from typing import Optional, Dict, Any

# Import slop filter from adjacent module
try:
    from slop_filter import clean_text, detect_slop
except ImportError:
    from scripts.slop_filter import clean_text, detect_slop


import importlib

def parse_with_docling(file_path: str) -> str:
    """
    Parses a PDF/Docx using IBM Docling if installed, returning structured Markdown.
    Falls back gracefully to pypdf if Docling is not present.
    """
    try:
        docling_mod = importlib.import_module("docling.document_converter")
        DocumentConverter = getattr(docling_mod, "DocumentConverter")
        converter = DocumentConverter()
        result = converter.convert(file_path)
        markdown_output = result.document.export_to_markdown()
        print("[Docling] Document parsed successfully with full structure normalization.", file=sys.stderr)
        return markdown_output
    except (ImportError, ModuleNotFoundError):
        print("[Notice] 'docling' package not found in Python environment. Falling back to PyPDF extraction.", file=sys.stderr)
        return parse_with_pypdf(file_path)


def parse_with_pypdf(file_path: str) -> str:
    """Fallback text extractor using pypdf."""
    try:
        pypdf_mod = importlib.import_module("pypdf")
        PdfReader = getattr(pypdf_mod, "PdfReader")
        reader = PdfReader(file_path)
        pages_text = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                pages_text.append(f"## Page {i+1}\n\n{text}")
        return "\n\n".join(pages_text)
    except (ImportError, ModuleNotFoundError):
        raise RuntimeError("Neither 'docling' nor 'pypdf' is installed. Please install with: pip install docling pypdf")


def convert_markdown_to_openschool_json(cleaned_markdown: str, filename: str) -> Dict[str, Any]:
    """
    Heuristic mapper to turn parsed document text into OpenSchool Blueprint project structure.
    """
    base_name = os.path.splitext(os.path.basename(filename))[0].replace('_', ' ').replace('-', ' ').title()
    
    project_data = {
        "id": f"project-imported-{hash(filename) & 0xffffffff}",
        "name": f"{base_name} (Imported)",
        "location": "Regional Educational Hub",
        "countryCode": "KE",
        "currency": "KES",
        "curriculumLevel": "igcse",
        "totalStudents": 500,
        "notes": clean_text(cleaned_markdown[:600] + "..."),
        "rooms": []
    }
    
    # Heuristically detect any mentioned rooms
    room_keywords = {
        "classroom": ("Classroom", 10, 8, 80, 40),
        "physics": ("Physics Laboratory", 12.5, 8, 100, 30),
        "chemistry": ("Chemistry Laboratory", 12.5, 8, 100, 30),
        "biology": ("Biology Laboratory", 11.25, 8, 90, 30),
        "ict": ("ICT & Computer Centre", 10, 8, 80, 30),
        "staff": ("Faculty Staff Room", 10, 7, 70, 20),
        "library": ("Library & Resource Centre", 12, 10, 120, 60),
        "hall": ("Multi-Purpose Hall", 20, 15, 300, 200)
    }

    lower_text = cleaned_markdown.lower()
    room_count = 1
    for key, (name, w, l, area, cap) in room_keywords.items():
        if key in lower_text:
            project_data["rooms"].append({
                "id": f"rm-imp-{room_count:02d}",
                "name": f"{name} {room_count}",
                "type": key if key != "classroom" else "classroom",
                "width_m": w,
                "length_m": l,
                "area_m2": area,
                "capacity": cap,
                "equipment": []
            })
            room_count += 1

    return project_data


def main():
    parser = argparse.ArgumentParser(description="Docling Ingestion & Slop Filter Pipeline for OpenSchool Blueprints.")
    parser.add_argument("input_file", help="Path to input PDF or DOCX file")
    parser.add_argument("-o", "--output", help="Path to output file")
    parser.add_argument("--format", choices=["markdown", "json", "typst"], default="markdown", 
                        help="Target output format: cleaned markdown, OpenSchool JSON project, or Typst (.typ)")
    args = parser.parse_args()

    if not os.path.exists(args.input_file):
        print(f"Error: File '{args.input_file}' not found.", file=sys.stderr)
        sys.exit(1)

    print(f"[*] Processing document: {args.input_file} ...", file=sys.stderr)
    
    # 1. Extraction / Structure Normalization
    raw_markdown = parse_with_docling(args.input_file)

    # 2. AI Slop & Language Normalization
    slop_matches = detect_slop(raw_markdown)
    print(f"[*] Detected {len(slop_matches)} AI slop occurrences in document.", file=sys.stderr)
    cleaned_markdown = clean_text(raw_markdown)

    # 3. Format Output
    if args.format == "json":
        project_obj = convert_markdown_to_openschool_json(cleaned_markdown, args.input_file)
        final_output = json.dumps(project_obj, indent=2, ensure_ascii=False)
    elif args.format == "typst":
        final_output = f"""// Auto-generated Typst Dossier from Docling Pipeline
#set page(paper: "a4", margin: 2cm)
#set text(font: "Inter", size: 10pt)

= Ingested Educational Specification: {os.path.basename(args.input_file)}

{cleaned_markdown}
"""
    else:
        final_output = cleaned_markdown

    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(final_output)
        print(f"[+] Output saved to {args.output}", file=sys.stderr)
    else:
        print(final_output)


if __name__ == "__main__":
    main()
