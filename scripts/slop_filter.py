#!/usr/bin/env python3
"""
AI Slop Filter & Text Normalizer (Python)
OpenSchool Blueprint Engine

Normalizes document language and strips out AI clichés, conversational filler, 
and formatting artifacts using compiled regular expressions.
"""

import re
import sys
import json
import argparse
from typing import List, Dict, Any, Tuple

# AI Slop Pattern Catalog
SLOP_PATTERNS = [
    # Conversational Preambles & Meta-Chat
    (re.compile(r'\b(as an ai (language model|assistant)|as a helpful assistant)[^,\.\n]*[,\.]?', re.IGNORECASE), ''),
    (re.compile(r'\b(here is (a|the) (comprehensive|detailed|breakdown|summary|overview)[^:\.\n]*:?)', re.IGNORECASE), ''),
    (re.compile(r'\b(certainly!|sure thing!|of course!|let\'s delve in!|hope this helps!)\b', re.IGNORECASE), ''),
    (re.compile(r'\b(in this section,? we will (explore|examine|delve into|look at))\b', re.IGNORECASE), ''),

    # AI Clichés & Buzzword Fillers
    (re.compile(r'\b(delve(?:s|d)? into(?: the realm of)?)\b', re.IGNORECASE), 'examine'),
    (re.compile(r'\b(a testament to(?: the)?)\b', re.IGNORECASE), 'evidence of'),
    (re.compile(r'\b(in the (?:rapidly )?ever-evolving (?:landscape|world|paradigm) of)\b', re.IGNORECASE), 'in'),
    (re.compile(r'\b(in today\'s fast-paced world,?)\b', re.IGNORECASE), 'currently,'),
    (re.compile(r'\b(tapestry of)\b', re.IGNORECASE), 'range of'),
    (re.compile(r'\b(unlock(?:ing|s|ed)? (?:the )?potential(?: of)?)\b', re.IGNORECASE), 'enabling'),
    (re.compile(r'\b(harness(?:ing|es|ed)? (?:the )?power of)\b', re.IGNORECASE), 'utilizing'),
    (re.compile(r'\b(plays? a (?:crucial|pivotal|vital|key) role in (?:fostering|shaping|driving))\b', re.IGNORECASE), 'supports'),
    (re.compile(r'\b(unwavering commitment(?: to)?)\b', re.IGNORECASE), 'dedication to'),
    (re.compile(r'\b(beacon of (?:excellence|hope|learning))\b', re.IGNORECASE), 'center for learning'),
    (re.compile(r'\b(seamless(?:ly)? integrat(?:ed|ing|ion|es))\b', re.IGNORECASE), 'integrated'),
    (re.compile(r'\b(synerg(?:y|istic|ies))\b', re.IGNORECASE), 'coordination'),
    (re.compile(r'\b(game-changer|paradigm shift)\b', re.IGNORECASE), 'significant advancement'),
    (re.compile(r'\b(holistic (?:approach|methodology|framework))\b', re.IGNORECASE), 'comprehensive approach'),

    # Empty Transitions & Pompous Connectors
    (re.compile(r'\b(it is worth noting that|it\'s worth noting that|it is important to remember that)\b', re.IGNORECASE), 'note that'),
    (re.compile(r'\b(at its core,?)\b', re.IGNORECASE), 'primarily,'),
    (re.compile(r'\b(furthermore,? moreover,?)\b', re.IGNORECASE), 'furthermore,'),
    (re.compile(r'\b(all in all,? in a nutshell,?)\b', re.IGNORECASE), 'in summary,'),
    (re.compile(r'\b(serves as a cornerstone(?: of)?)\b', re.IGNORECASE), 'serves as a foundation of'),
    (re.compile(r'\b(foster(?:s|ing|ed)? a culture of)\b', re.IGNORECASE), 'promote'),
    (re.compile(r'\b(poised to (?:revolutionize|transform))\b', re.IGNORECASE), 'designed to improve')
]

FORMATTING_PATTERNS = [
    (re.compile(r'[\u00A0\u200B\u200C\u200D\u200E\u200F\uFEFF]'), ' '),
    (re.compile(r'\*{3,}'), '**'),
    (re.compile(r'[ \t]+$', re.MULTILINE), ''),
    (re.compile(r'[^\S\r\n]{2,}'), ' '),
    (re.compile(r'\n{3,}'), '\n\n')
]

def clean_text(text: str) -> str:
    """Normalizes formatting and strips AI slop from text string."""
    if not text or not isinstance(text, str):
        return ""

    cleaned = text
    for pattern, repl in FORMATTING_PATTERNS:
        cleaned = pattern.sub(repl, cleaned)

    for pattern, repl in SLOP_PATTERNS:
        def replace_with_case(match):
            m = match.group(0)
            if m and m[0].isupper() and len(repl) > 0:
                return repl[0].upper() + repl[1:]
            return repl
        cleaned = pattern.sub(replace_with_case, cleaned)

    # Post cleanup punctuation and spacing
    cleaned = re.sub(r'\s+([.,!?;:])', r'\1', cleaned)
    cleaned = re.sub(r'([.,])\1+', r'\1', cleaned)
    cleaned = re.sub(r'\(\s+', '(', cleaned)
    cleaned = re.sub(r'\s+\)', ')', cleaned)
    cleaned = re.sub(r'[^\S\r\n]{2,}', ' ', cleaned)
    return cleaned.strip()

def detect_slop(text: str) -> List[Dict[str, Any]]:
    """Detects slop phrases and returns their positions."""
    if not text:
        return []
    matches = []
    for pattern, repl in SLOP_PATTERNS:
        for m in pattern.finditer(text):
            matches.append({
                "phrase": m.group(0),
                "start": m.start(),
                "end": m.end(),
                "suggestion": repl or "[Remove]"
            })
    return sorted(matches, key=lambda x: x["start"])

def clean_json_data(data: Any) -> Tuple[Any, int]:
    """Recursively cleans all string values in a JSON structure."""
    cleaned_count = 0
    if isinstance(data, dict):
        new_dict = {}
        for k, v in data.items():
            cleaned_v, count = clean_json_data(v)
            new_dict[k] = cleaned_v
            cleaned_count += count
        return new_dict, cleaned_count
    elif isinstance(data, list):
        new_list = []
        for item in data:
            cleaned_item, count = clean_json_data(item)
            new_list.append(cleaned_item)
            cleaned_count += count
        return new_list, cleaned_count
    elif isinstance(data, str):
        matches = detect_slop(data)
        if matches:
            return clean_text(data), len(matches)
        return data, 0
    return data, 0

def main():
    parser = argparse.ArgumentParser(description="Clean AI slop and normalize text in Markdown, Text, or JSON files.")
    parser.add_argument("input_file", help="Path to input file")
    parser.add_argument("-o", "--output", help="Path to output file (defaults to stdout)")
    parser.add_argument("--json", action="store_true", help="Process input as JSON data structure")
    args = parser.parse_args()

    try:
        with open(args.input_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file {args.input_file}: {e}", file=sys.stderr)
        sys.exit(1)

    if args.json or args.input_file.endswith('.json'):
        try:
            data = json.loads(content)
            cleaned_data, count = clean_json_data(data)
            output_str = json.dumps(cleaned_data, indent=2, ensure_ascii=False)
            print(f"Cleaned {count} AI slop occurrences in JSON.", file=sys.stderr)
        except Exception as e:
            print(f"Error parsing JSON: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        matches = detect_slop(content)
        cleaned_content = clean_text(content)
        print(f"Cleaned {len(matches)} AI slop occurrences in text.", file=sys.stderr)
        output_str = cleaned_content

    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(output_str)
        print(f"Saved cleaned output to {args.output}", file=sys.stderr)
    else:
        print(output_str)

if __name__ == "__main__":
    main()
