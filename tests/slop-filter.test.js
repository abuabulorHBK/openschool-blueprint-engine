import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  detectSlopMatches,
  calculateSlopScore,
  cleanText,
  sanitizeSchoolProject,
  SLOP_PATTERNS,
  FORMATTING_PATTERNS
} from '../src/engine/slop-filter.js';

describe('Slop Filter & Normalization Engine (JS)', () => {
  it('should export valid pattern definitions', () => {
    assert.ok(Array.isArray(SLOP_PATTERNS));
    assert.ok(SLOP_PATTERNS.length > 10);
    assert.ok(Array.isArray(FORMATTING_PATTERNS));
  });

  it('detectSlopMatches should identify conversational meta-chat and buzzwords', () => {
    const text = 'As an AI language model, here is a comprehensive breakdown of the project. Delve into the rich tapestry of education.';
    const matches = detectSlopMatches(text);
    assert.ok(matches.length >= 3);
    const phrases = matches.map(m => m.phrase.toLowerCase());
    assert.ok(phrases.some(p => p.includes('as an ai')));
    assert.ok(phrases.some(p => p.includes('here is a')));
    assert.ok(phrases.some(p => p.includes('delve into')));
  });

  it('calculateSlopScore should compute accurate density percentages', () => {
    const cleanStr = 'The new laboratory has twelve computer stations and two fume hoods.';
    assert.equal(calculateSlopScore(cleanStr), 0);

    const sloppyStr = 'As a helpful assistant, delve into the ever-evolving landscape of learning.';
    const score = calculateSlopScore(sloppyStr);
    assert.ok(score > 0 && score <= 100);
  });

  it('cleanText should strip clichés, preserve capitalization, and format cleanly', () => {
    const raw = '  Delves into the realm of modern science.  ***Special Lab*** \u00A0 \n\n\n\nNotes: ';
    const cleaned = cleanText(raw);
    assert.ok(cleaned.startsWith('Examine') || cleaned.toLowerCase().includes('examine'));
    assert.ok(!cleaned.includes('delves into the realm of'));
    assert.ok(!cleaned.includes('\u00A0'));
    assert.ok(!cleaned.includes('***'));
    assert.ok(!cleaned.includes('\n\n\n'));
  });

  it('sanitizeSchoolProject should recursively clean project objects and count stats', () => {
    const project = {
      name: 'Kilifi Academy',
      notes: 'As an AI language model, this school serves as a cornerstone of learning.',
      rooms: [
        {
          id: 'rm-1',
          name: 'Classroom 1',
          notes: 'Unlocking the potential of youth in today\'s fast-paced world.'
        }
      ],
      numericField: 42,
      booleanField: true
    };

    const { sanitizedProject, stats } = sanitizeSchoolProject(project);
    assert.ok(stats.matchesFound >= 3);
    assert.ok(stats.totalCleanedFields >= 2);
    assert.ok(!sanitizedProject.notes.includes('As an AI language model'));
    assert.ok(!sanitizedProject.rooms[0].notes.includes('in today\'s fast-paced world'));
    assert.equal(sanitizedProject.numericField, 42);
    assert.equal(sanitizedProject.booleanField, true);
  });

  it('handles null, undefined, or empty inputs gracefully', () => {
    assert.equal(cleanText(''), '');
    assert.equal(cleanText(null), '');
    assert.deepEqual(detectSlopMatches(null), []);
    assert.equal(calculateSlopScore(''), 0);
    const { sanitizedProject, stats } = sanitizeSchoolProject(null);
    assert.equal(stats.totalCleanedFields, 0);
  });
});
