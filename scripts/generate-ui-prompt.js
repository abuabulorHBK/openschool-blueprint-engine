import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT_DIR, 'UI_PROMPT_FOR_AI.md');

const DIRS_TO_SCAN = ['src/components', 'src/views'];

// Utility to recursively find files
function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else if (fullPath.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractAttributes(tagString) {
  const classMatch = tagString.match(/className=(?:\{['"]([^'"]+)['"]\}|["']([^"']+)["'])/);
  const typeMatch = tagString.match(/type=["']([^"']+)["']/);
  const placeholderMatch = tagString.match(/placeholder=["']([^"']+)["']/);
  
  return {
    className: classMatch ? (classMatch[1] || classMatch[2]) : null,
    type: typeMatch ? typeMatch[1] : null,
    placeholder: placeholderMatch ? placeholderMatch[1] : null,
  };
}

function parseFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const elements = [];

  // Match buttons
  const buttonRegex = /<button([^>]*)>([\s\S]*?)<\/button>/g;
  let match;
  while ((match = buttonRegex.exec(content)) !== null) {
    const attrs = extractAttributes(match[1]);
    let text = match[2].replace(/<[^>]+>/g, '').trim(); // strip inner tags
    if (!text) text = '(Icon/No text)';
    elements.push({ tag: 'button', text, ...attrs });
  }

  // Match inputs
  const inputRegex = /<input([^>]+)\/?>/g;
  while ((match = inputRegex.exec(content)) !== null) {
    const attrs = extractAttributes(match[1]);
    elements.push({ tag: 'input', ...attrs });
  }

  // Match selects
  const selectRegex = /<select([^>]*)>/g;
  while ((match = selectRegex.exec(content)) !== null) {
    const attrs = extractAttributes(match[1]);
    elements.push({ tag: 'select', ...attrs });
  }

  // Match textareas
  const textareaRegex = /<textarea([^>]*)>/g;
  while ((match = textareaRegex.exec(content)) !== null) {
    const attrs = extractAttributes(match[1]);
    elements.push({ tag: 'textarea', ...attrs });
  }

  // Match key structural divs (cards, modals, etc)
  const divRegex = /<div([^>]*className=["'][^"']*(?:card|modal|section|container|panel|sidebar|grid|flex)[^"']*["'][^>]*)>/gi;
  while ((match = divRegex.exec(content)) !== null) {
    const attrs = extractAttributes(match[1]);
    if (attrs.className) {
      elements.push({ tag: 'div', role: 'layout-node', ...attrs });
    }
  }

  return elements;
}

function generateMarkdown() {
  const allFiles = DIRS_TO_SCAN.reduce((acc, dir) => {
    return acc.concat(getFiles(path.join(ROOT_DIR, dir)));
  }, []);

  let md = `# OpenSchool Blueprint Engine - UI Architecture & Prompt\n\n`;
  md += `This document contains an extraction of all interactive UI elements and key layout nodes across the application. It is designed to be provided as a prompt to AI design tools (like Stitch or Figma) to ensure accurate UI reconstruction.\n\n`;

  allFiles.forEach(file => {
    const relativePath = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
    const elements = parseFile(file);
    
    if (elements.length > 0) {
      md += `## File: \`${relativePath}\`\n\n`;
      
      const layoutNodes = elements.filter(e => e.role === 'layout-node');
      if (layoutNodes.length > 0) {
        md += `### Layout Nodes (Containers)\n`;
        layoutNodes.forEach(e => {
          md += `- **Node**: \`<div>\`\n`;
          md += `  - **Classes**: \`${e.className}\`\n`;
        });
        md += `\n`;
      }

      const interactiveElements = elements.filter(e => !e.role);
      if (interactiveElements.length > 0) {
        md += `### Interactive Elements\n`;
        interactiveElements.forEach(e => {
          md += `- **${e.tag.toUpperCase()}**\n`;
          if (e.text) md += `  - **Text/Content**: "${e.text.replace(/\s+/g, ' ')}"\n`;
          if (e.type) md += `  - **Type**: \`${e.type}\`\n`;
          if (e.placeholder) md += `  - **Placeholder**: "${e.placeholder}"\n`;
          if (e.className) md += `  - **Classes**: \`${e.className}\`\n`;
        });
        md += `\n`;
      }
    }
  });

  fs.writeFileSync(OUTPUT_FILE, md);
  console.log(`Successfully generated UI prompt at: ${OUTPUT_FILE}`);
}

generateMarkdown();
