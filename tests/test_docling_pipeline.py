#!/usr/bin/env python3
"""
Unit tests for docling_pipeline.py
OpenSchool Blueprint Engine
"""

import unittest
import sys
import os
import json

# Add scripts directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'scripts')))

from docling_pipeline import convert_markdown_to_openschool_json


class TestDoclingPipeline(unittest.TestCase):

    def test_convert_markdown_to_openschool_json_heuristics(self):
        sample_markdown = """
        # Tender Specification for Kilifi Regional STEM School
        The campus requires:
        - 4 standard classroom blocks for secondary learners.
        - 1 physics laboratory and 1 chemistry laboratory with gas fittings.
        - 1 biology laboratory for microscopy.
        - 1 ict lab with 30 computer terminals.
        - 1 staff room for faculty meetings.
        - 1 central library and 1 multi-purpose hall for sports and assemblies.
        """
        
        project = convert_markdown_to_openschool_json(sample_markdown, "kilifi_stem_project.pdf")
        
        self.assertIn("Kilifi Stem Project", project["name"])
        self.assertEqual(project["countryCode"], "KE")
        self.assertEqual(project["curriculumLevel"], "igcse")
        self.assertGreater(len(project["rooms"]), 4)
        
        room_types = [r["type"] for r in project["rooms"]]
        self.assertIn("classroom", room_types)
        self.assertIn("physics", room_types)
        self.assertIn("chemistry", room_types)
        self.assertIn("biology", room_types)
        self.assertIn("ict", room_types)
        self.assertIn("staff", room_types)
        self.assertIn("library", room_types)
        self.assertIn("hall", room_types)

    def test_convert_markdown_slop_cleaning(self):
        sample_markdown = "As an AI language model, here is a breakdown for a new classroom and physics laboratory."
        project = convert_markdown_to_openschool_json(sample_markdown, "spec.docx")
        
        self.assertNotIn("As an AI language model", project["notes"])
        self.assertGreaterEqual(len(project["rooms"]), 2)


if __name__ == '__main__':
    unittest.main()
