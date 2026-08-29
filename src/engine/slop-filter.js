/**
 * AI Slop Filter & Language Normalization Engine
 * 
 * Cleans formulaic AI filler, clichés, conversational artifacts, 
 * and formatting debris from architectural and educational text descriptions.
 */

// Common AI buzzwords, hyperbolic transitions, and empty filler phrases
export const SLOP_PATTERNS = [
  // Conversational LLM Preambles & Meta-Chat
  { pattern: /\b(as an ai (language model|assistant)|as a helpful assistant)[^,\.\n]*[,\.]?/gi, replacement: '' },
  { pattern: /\b(here is (a|the) (comprehensive|detailed|breakdown|summary|overview)[^:\.\n]*:?)/gi, replacement: '' },
  { pattern: /\b(certainly!|sure thing!|of course!|let's delve in!|hope this helps!)\b/gi, replacement: '' },
  { pattern: /\b(in this section,? we will (explore|examine|delve into|look at))\b/gi, replacement: '' },

  // Overused AI Clichés & Buzzword Fillers
  { pattern: /\b(delve(?:s|d)? into(?: the realm of)?)\b/gi, replacement: 'examine' },
  { pattern: /\b(a testament to(?: the)?)\b/gi, replacement: 'evidence of' },
  { pattern: /\b(in the (?:rapidly )?ever-evolving (?:landscape|world|paradigm) of)\b/gi, replacement: 'in' },
  { pattern: /\b(in today's fast-paced world,?)\b/gi, replacement: 'currently,' },
  { pattern: /\b(tapestry of)\b/gi, replacement: 'range of' },
  { pattern: /\b(unlock(?:ing|s|ed)? (?:the )?potential(?: of)?)\b/gi, replacement: 'enabling' },
  { pattern: /\b(harness(?:ing|es|ed)? (?:the )?power of)\b/gi, replacement: 'utilizing' },
  { pattern: /\b(plays? a (?:crucial|pivotal|vital|key) role in (?:fostering|shaping|driving))\b/gi, replacement: 'supports' },
  { pattern: /\b(unwavering commitment(?: to)?)\b/gi, replacement: 'dedication to' },
  { pattern: /\b(beacon of (?:excellence|hope|learning))\b/gi, replacement: 'center for learning' },
  { pattern: /\b(seamless(?:ly)? integrat(?:ed|ing|ion|es))\b/gi, replacement: 'integrated' },
  { pattern: /\b(synerg(?:y|istic|ies))\b/gi, replacement: 'coordination' },
  { pattern: /\b(game-changer|paradigm shift)\b/gi, replacement: 'significant advancement' },
  { pattern: /\b(holistic (?:approach|methodology|framework))\b/gi, replacement: 'comprehensive approach' },
  { pattern: /\b(rich tapestry|vibrant ecosystem)\b/gi, replacement: 'environment' },

  // Empty Transitionals and Pompous Connectors
  { pattern: /\b(it is worth noting that|it's worth noting that|it is important to remember that)\b/gi, replacement: 'note that' },
  { pattern: /\b(at its core,?)\b/gi, replacement: 'primarily,' },
  { pattern: /\b(furthermore,? moreover,?)\b/gi, replacement: 'furthermore,' },
  { pattern: /\b(all in all,? in a nutshell,?)\b/gi, replacement: 'in summary,' },
  { pattern: /\b(serves as a cornerstone(?: of)?)\b/gi, replacement: 'serves as a foundation of' },
  { pattern: /\b(foster(?:s|ing|ed)? a culture of)\b/gi, replacement: 'promote' },
  { pattern: /\b(poised to (?:revolutionize|transform))\b/gi, replacement: 'designed to improve' }
];

// Formatting and invisible artifact regular expressions
export const FORMATTING_PATTERNS = [
  // Invisible / non-standard Unicode characters
  { pattern: /[\u00A0\u200B\u200C\u200D\u200E\u200F\uFEFF]/g, replacement: ' ' },
  // Excessive Markdown bolding/asterisks (3 or more)
  { pattern: /\*{3,}/g, replacement: '**' },
  // Trailing whitespace on lines
  { pattern: /[ \t]+$/gm, replacement: '' },
  // Multiple consecutive whitespace characters (excluding newlines)
  { pattern: /[^\S\r\n]{2,}/g, replacement: ' ' },
  // Three or more consecutive line breaks to two
  { pattern: /\n{3,}/g, replacement: '\n\n' }
];

/**
 * Detects all slop phrases in a given text string.
 * @param {string} text - The input text to inspect
 * @returns {Array<{phrase: string, index: number, suggestion: string}>}
 */
export function detectSlopMatches(text) {
  if (!text || typeof text !== 'string') return [];
  
  const matches = [];
  
  for (const { pattern, replacement } of SLOP_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        phrase: match[0],
        index: match.index,
        suggestion: replacement.trim() || '[Remove]'
      });
    }
  }

  return matches.sort((a, b) => a.index - b.index);
}

/**
 * Calculates the percentage of "slop density" in a text snippet.
 * @param {string} text 
 * @returns {number} Score from 0 to 100
 */
export function calculateSlopScore(text) {
  if (!text || typeof text !== 'string') return 0;
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;

  const matches = detectSlopMatches(text);
  if (matches.length === 0) return 0;

  let slopWordCount = 0;
  matches.forEach(m => {
    slopWordCount += m.phrase.trim().split(/\s+/).length;
  });

  const rawScore = (slopWordCount / words.length) * 100;
  return Math.min(100, Math.round(rawScore * 10) / 10);
}

/**
 * Cleans a text string by removing AI slop and normalizing formatting.
 * @param {string} text - Raw input text
 * @returns {string} Sanitized and normalized text
 */
export function cleanText(text) {
  if (!text || typeof text !== 'string') return text || '';

  let cleaned = text;

  // 1. Run formatting normalizations
  for (const { pattern, replacement } of FORMATTING_PATTERNS) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  // 2. Replace slop phrases
  for (const { pattern, replacement } of SLOP_PATTERNS) {
    cleaned = cleaned.replace(pattern, (match) => {
      // Preserve uppercase if original started with capital
      if (/^[A-Z]/.test(match) && replacement.length > 0) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }

  // 3. Clean up residual double punctuation or broken spacing
  cleaned = cleaned
    .replace(/\s+([.,!?;:])/g, '$1') // Space before punctuation
    .replace(/([.,])\1+/g, '$1')      // Double periods or commas
    .replace(/\(\s+/g, '(')           // Space after open parenthesis
    .replace(/\s+\)/g, ')')           // Space before close parenthesis
    .replace(/[^\S\r\n]{2,}/g, ' ')   // Extra spaces
    .trim();

  return cleaned;
}

/**
 * Recursively scans and cleans an OpenSchool project object.
 * Sanitizes project notes, room notes, staffing descriptions, etc.
 * @param {object} projectData - The full OpenSchool project data model
 * @returns {{ sanitizedProject: object, stats: { totalCleanedFields: number, matchesFound: number } }}
 */
export function sanitizeSchoolProject(projectData) {
  if (!projectData || typeof projectData !== 'object') {
    return { sanitizedProject: projectData, stats: { totalCleanedFields: 0, matchesFound: 0 } };
  }

  let totalCleanedFields = 0;
  let matchesFound = 0;

  const deepClean = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(item => deepClean(item));
    } else if (obj !== null && typeof obj === 'object') {
      const newObj = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          const detected = detectSlopMatches(value);
          if (detected.length > 0) {
            matchesFound += detected.length;
            totalCleanedFields += 1;
            newObj[key] = cleanText(value);
          } else {
            newObj[key] = value;
          }
        } else {
          newObj[key] = deepClean(value);
        }
      }
      return newObj;
    }
    return obj;
  };

  const sanitizedProject = deepClean(projectData);
  return {
    sanitizedProject,
    stats: {
      totalCleanedFields,
      matchesFound
    }
  };
}
