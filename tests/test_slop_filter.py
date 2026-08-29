#!/usr/bin/env python3
"""
Unit tests for slop_filter.py
OpenSchool Blueprint Engine
"""

import unittest
import sys
import os

# Add scripts directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'scripts')))

from slop_filter import clean_text, detect_slop, clean_json_data, SLOP_PATTERNS, FORMATTING_PATTERNS


class TestSlopFilter(unittest.TestCase):

    def test_clean_text_removes_preambles(self):
        text = "As an AI language model, here is a comprehensive breakdown of the school design."
        cleaned = clean_text(text)
        self.assertNotIn("As an AI language model", cleaned)
        self.assertNotIn("here is a comprehensive breakdown", cleaned)

    def test_clean_text_replaces_cliches(self):
        text = "The academy delves into the realm of science and serves as a cornerstone of learning."
        cleaned = clean_text(text)
        self.assertNotIn("delves into the realm of", cleaned.lower())
        self.assertIn("examine", cleaned.lower())
        self.assertIn("foundation", cleaned.lower())

    def test_case_preservation(self):
        text = "Harnessing the power of solar energy is vital."
        cleaned = clean_text(text)
        self.assertTrue(cleaned.startswith("Utilizing") or cleaned.startswith("utilizing") or "solar energy" in cleaned)

    def test_detect_slop_positions(self):
        text = "This is a testament to our unwavering commitment."
        matches = detect_slop(text)
        self.assertGreaterEqual(len(matches), 1)
        phrases = [m["phrase"].lower() for m in matches]
        self.assertTrue(any("testament" in p or "unwavering commitment" in p for p in phrases))

    def test_formatting_cleanup(self):
        # Test invisible unicode characters and double spaces
        text = "Classroom\u00A01  (Grade\u200B 9)   ***Special***\n\n\n\nNotes"
        cleaned = clean_text(text)
        self.assertNotIn("\u00A0", cleaned)
        self.assertNotIn("\u200B", cleaned)
        self.assertNotIn("***", cleaned)
        self.assertNotIn("\n\n\n", cleaned)

    def test_clean_json_data(self):
        raw_json = {
            "name": "Kilifi Academy",
            "description": "As a helpful assistant, certainly! Delve into the rich tapestry of our campus.",
            "rooms": [
                {
                    "id": "rm-1",
                    "notes": "A testament to excellence, unlocking the potential of students."
                }
            ],
            "numericValue": 500,
            "isActive": True
        }
        cleaned_json, count = clean_json_data(raw_json)
        self.assertGreater(count, 0)
        self.assertNotIn("As a helpful assistant", cleaned_json["description"])
        self.assertNotIn("testament to", cleaned_json["rooms"][0]["notes"])
        self.assertEqual(cleaned_json["numericValue"], 500)
        self.assertEqual(cleaned_json["isActive"], True)

    def test_empty_and_edge_inputs(self):
        self.assertEqual(clean_text(""), "")
        self.assertEqual(clean_text(None), "")
        self.assertEqual(detect_slop(""), [])
        data, count = clean_json_data(None)
        self.assertEqual(count, 0)


if __name__ == '__main__':
    unittest.main()
