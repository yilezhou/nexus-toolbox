#!/usr/bin/env node

/**
 * orchestrator.js
 * 
 * Orchestrates the execution of tasks in a project's STATUS.md using OpenClaw subagents.
 * 
 * Usage: node orchestrator.js --project <path_to_project>
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// 1. Input: Parse --project argument
const args = process.argv.slice(2);
const projectIndex = args.indexOf('--project');
if (projectIndex === -1 || !args[projectIndex + 1]) {
  console.error('Error: --project <path> argument is required.');
  process.exit(1);
}

const projectPath = path.resolve(args[projectIndex + 1]);
const statusFilePath = path.join(projectPath, 'STATUS.md');

if (!fs.existsSync(statusFilePath)) {
  console.error(`Error: STATUS.md not found at ${statusFilePath}`);
  process.exit(1);
}

// 2. State Reader: Read STATUS.md
let statusContent = fs.readFileSync(statusFilePath, 'utf8');
const lines = statusContent.split('\n');

// 3. Loop Logic: Find the first unchecked task
let taskToRun = null;
let lineIndex = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Match unchecked tasks like: - [ ] Spec: Feature
  const match = line.match(/^\s*-\s*\[\s\]\s*(Spec|Code|Audit):\s*(.*)/i);
  if (match) {
    taskToRun = {
      type: match[1].toLowerCase(),
      description: match[2].trim(),
      originalLine: line
    };
    lineIndex = i;
    break;
  }
}

if (!taskToRun) {
  console.log('No pending tasks found in STATUS.md.');
  process.exit(0);
}

console.log(`Executing Task: [${taskToRun.type}] ${taskToRun.description}`);

// 4. Execution: Spawn OpenClaw agents
let agentType = '';
let agentPrompt = '';

switch (taskToRun.type) {
  case 'spec':
    agentType = 'Architect';
    agentPrompt = `You are an Architect agent. Your task is to design the specification for: ${taskToRun.description}. Project path: ${projectPath}`;
    break;
  case 'code':
    agentType = 'Developer';
    agentPrompt = `You are a Developer agent. Your task is to implement the code for: ${taskToRun.description}. Project path: ${projectPath}`;
    break;
  case 'audit':
    agentType = 'Quality Guard';
    agentPrompt = `You are a Quality Guard agent. Your task is to audit the implementation of: ${taskToRun.description}. Project path: ${projectPath}`;
    break;
  default:
    console.error(`Unknown task type: ${taskToRun.type}`);
    process.exit(1);
}

// Spawning via openclaw CLI
// command: openclaw spawn "prompt" --label "Label"
const spawnCmd = 'openclaw';
const spawnArgs = [
  'spawn',
  agentPrompt,
  '--label', `${agentType}: ${taskToRun.description}`
];

console.log(`Spawning ${agentType} agent...`);
const result = spawnSync(spawnCmd, spawnArgs, { stdio: 'inherit', shell: true });

if (result.status === 0) {
  // 5. Output: Update STATUS.md to [x]
  console.log(`Task completed successfully. Updating ${statusFilePath}...`);
  lines[lineIndex] = lines[lineIndex].replace(/\[\s\]/, '[x]');
  fs.writeFileSync(statusFilePath, lines.join('\n'), 'utf8');
  console.log('STATUS.md updated.');
} else {
  console.error(`Agent execution failed with exit code ${result.status}`);
  process.exit(result.status || 1);
}
