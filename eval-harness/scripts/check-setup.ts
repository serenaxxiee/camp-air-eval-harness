/**
 * check-setup.ts
 *
 * Pre-flight check for the Camp AIR eval harness.
 * Run with: npm run check-setup
 *
 * No imports from harness src — this is a standalone utility.
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const BOLD = "\x1b[1m";

function pass(label: string): void {
  console.log(`  ${GREEN}✓${RESET} ${label}`);
}

function fail(label: string, fix: string): void {
  console.log(`  ${RED}✗${RESET} ${label}`);
  console.log(`    ${BOLD}Fix:${RESET} ${fix}`);
}

// ---------------------------------------------------------------------------
// Check 1: Node.js version >= 18
// ---------------------------------------------------------------------------
const nodeVersionString = process.versions.node; // e.g. "20.11.0"
const nodeMajor = parseInt(nodeVersionString.split(".")[0], 10);
const nodePass = nodeMajor >= 18;

// ---------------------------------------------------------------------------
// Check 2: ANTHROPIC_API_KEY is set and non-empty
// ---------------------------------------------------------------------------
const apiKey = process.env.ANTHROPIC_API_KEY ?? "";
const apiKeyPass = apiKey.trim().length > 0;

// ---------------------------------------------------------------------------
// Check 3: node_modules exists (npm install has been run)
// ---------------------------------------------------------------------------
const nodeModulesPath = path.resolve("node_modules");
const nodeModulesPass = fs.existsSync(nodeModulesPath);

// ---------------------------------------------------------------------------
// Check 4: Claude Code CLI is installed
// ---------------------------------------------------------------------------
let claudePass = false;
let claudeVersion = "";
try {
  claudeVersion = execSync("claude --version", { encoding: "utf-8" }).trim();
  claudePass = true;
} catch {
  claudePass = false;
}

// ---------------------------------------------------------------------------
// Print results
// ---------------------------------------------------------------------------
console.log();
console.log(`${BOLD}Camp AIR Eval Harness — Setup Check${RESET}`);
console.log("─".repeat(42));
console.log();

if (nodePass) {
  pass(`Node.js v${nodeVersionString} (>= 18 required)`);
} else {
  fail(
    `Node.js v${nodeVersionString} is too old (>= 18 required)`,
    `Install Node.js 18+ from nodejs.org (current: v${nodeVersionString})`
  );
}

if (apiKeyPass) {
  pass("ANTHROPIC_API_KEY is set");
} else {
  fail(
    "ANTHROPIC_API_KEY is not set",
    "Set your API key: export ANTHROPIC_API_KEY=sk-ant-...  (or $env:ANTHROPIC_API_KEY='...' on Windows)"
  );
  console.log(`    Get your API key at: https://console.anthropic.com/settings/keys`);
}

if (nodeModulesPass) {
  pass("node_modules exists (npm install has been run)");
} else {
  fail("node_modules not found", "Run: npm install");
}

if (claudePass) {
  pass(`Claude Code CLI installed (${claudeVersion})`);
} else {
  fail(
    "Claude Code CLI not found",
    "Install Claude Code: https://docs.anthropic.com/en/docs/claude-code/getting-started"
  );
}

console.log();

const allPassed = nodePass && apiKeyPass && nodeModulesPass && claudePass;

if (allPassed) {
  console.log(
    `${GREEN}${BOLD}✓ All checks passed — ready to run evals!${RESET}`
  );
  console.log();
  process.exit(0);
} else {
  console.log(
    `${RED}${BOLD}✗ Fix the issues above, then re-run npm run check-setup${RESET}`
  );
  console.log();
  process.exit(1);
}
