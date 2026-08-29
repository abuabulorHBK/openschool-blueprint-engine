#!/usr/bin/env node
/**
 * Master Test Runner for OpenSchool Blueprint Engine
 * Runs complete test matrix:
 *  1. JS Engine & Data Suite (Node test runner)
 *  2. Python Docling Ingestion & Slop Filter Suite (Python unittest)
 *  3. Oxlint Static Analysis Linter
 *  4. Production Bundle Build (Vite)
 *  5. AI UI Prompt Generator verification
 */

import { execSync } from 'node:child_process';
import process from 'node:process';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

const steps = [
  {
    name: 'JavaScript Engine & Data Models (Node.js Test Runner)',
    cmd: 'node --test tests/*.test.js'
  },
  {
    name: 'Python Ingestion Pipeline & AI Slop Filter (unittest)',
    cmd: 'python -m unittest discover -s tests -p "test_*.py"'
  },
  {
    name: 'Static Analysis & Code Quality (oxlint)',
    cmd: 'npm run lint'
  },
  {
    name: 'Vite Production Build & Tree-Shaking',
    cmd: 'npm run build'
  },
  {
    name: 'AI UI Prompt Generation Pipeline',
    cmd: 'npm run generate-ui-prompt'
  }
];

console.log(`${colors.bright}${colors.cyan}========================================================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}  OPENSCHOOL BLUEPRINT ENGINE — AUTOMATED FULL TEST MATRIX${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================================================${colors.reset}\n`);

let failed = false;
const startTime = Date.now();

for (let i = 0; i < steps.length; i++) {
  const step = steps[i];
  console.log(`${colors.blue}[${i + 1}/${steps.length}] Running: ${colors.bright}${step.name}${colors.reset}`);
  console.log(`${colors.yellow}Command:${colors.reset} ${step.cmd}`);
  
  const stepStart = Date.now();
  try {
    const output = execSync(step.cmd, { stdio: 'pipe', encoding: 'utf-8' });
    const stepDuration = ((Date.now() - stepStart) / 1000).toFixed(2);
    console.log(output.trim());
    console.log(`${colors.green}✔ PASSED (${stepDuration}s)${colors.reset}\n`);
  } catch (err) {
    const stepDuration = ((Date.now() - stepStart) / 1000).toFixed(2);
    console.error(`${colors.red}✖ FAILED (${stepDuration}s)${colors.reset}`);
    if (err.stdout) console.log(err.stdout.toString());
    if (err.stderr) console.error(err.stderr.toString());
    failed = true;
    break;
  }
}

const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log(`${colors.bright}${colors.cyan}========================================================================${colors.reset}`);
if (failed) {
  console.log(`${colors.bright}${colors.red}  TEST SUITE COMPLETED WITH FAILURES (Elapsed: ${totalDuration}s)${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}========================================================================${colors.reset}\n`);
  process.exit(1);
} else {
  console.log(`${colors.bright}${colors.green}  ALL TESTS PASSED SUCCESSFULLY! (Total Time: ${totalDuration}s)${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}========================================================================${colors.reset}\n`);
  process.exit(0);
}
