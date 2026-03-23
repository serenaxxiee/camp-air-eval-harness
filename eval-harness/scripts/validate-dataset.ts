/**
 * validate-dataset.ts
 *
 * Validates that a dataset JSON file is well-formed for the Camp AIR eval harness.
 * Run with: npm run validate
 *          npm run validate:workshop
 *          npx tsx scripts/validate-dataset.ts path/to/my-cases.json
 *
 * No API calls are made. No imports from harness src — this is a standalone utility.
 */

import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// ANSI color helpers (same pattern as check-setup.ts)
// ---------------------------------------------------------------------------
const RESET  = "\x1b[0m";
const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BOLD   = "\x1b[1m";
const DIM    = "\x1b[2m";

// ---------------------------------------------------------------------------
// Recognised expected fields (determines model-graded vs deterministic)
// ---------------------------------------------------------------------------
const RECOGNIZED_EXPECTED_FIELDS = [
  "max_length",
  "must_include_topic",
  "must_include_keywords",
  "must_not_contain",
  "format",
  "classification",
  "min_items",
  "criteria",
] as const;

const MODEL_GRADED_FIELDS = new Set(["criteria"]);

// ---------------------------------------------------------------------------
// Resolve target file
// ---------------------------------------------------------------------------
const argPath = process.argv[2];
const DEFAULT_PATH = "my-evals/datasets/my-eval-cases.json";
const targetRelative = argPath ?? DEFAULT_PATH;
const targetAbsolute = path.resolve(targetRelative);

console.log();
console.log(`${BOLD}Camp AIR Eval Harness — Dataset Validator${RESET}`);
console.log("─".repeat(46));
console.log(`${DIM}File: ${targetAbsolute}${RESET}`);
console.log();

// ---------------------------------------------------------------------------
// Step 1: File exists and is readable
// ---------------------------------------------------------------------------
if (!fs.existsSync(targetAbsolute)) {
  console.log(`${RED}${BOLD}Error:${RESET} File not found: ${targetAbsolute}`);
  console.log();
  console.log(`${BOLD}Fix:${RESET} Check the file path, or create the file first.`);
  console.log(`       Default location: ${DEFAULT_PATH}`);
  console.log();
  process.exit(1);
}

let rawText: string;
try {
  rawText = fs.readFileSync(targetAbsolute, "utf-8");
} catch (err) {
  console.log(`${RED}${BOLD}Error:${RESET} Could not read file: ${(err as Error).message}`);
  console.log();
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Step 2: Valid JSON
// ---------------------------------------------------------------------------
let parsed: unknown;
try {
  parsed = JSON.parse(rawText);
} catch (err) {
  console.log(`${RED}${BOLD}Error:${RESET} Invalid JSON — ${(err as Error).message}`);
  console.log();
  console.log(`${BOLD}Fix:${RESET} Run the JSON through a linter (e.g. jsonlint.com) to find the syntax error.`);
  console.log();
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Step 3: Top-level must be an array
// ---------------------------------------------------------------------------
if (!Array.isArray(parsed)) {
  console.log(`${RED}${BOLD}Error:${RESET} Dataset must be a JSON array (got ${typeof parsed}).`);
  console.log();
  console.log(`${BOLD}Fix:${RESET} Wrap your cases in [ ... ].`);
  console.log();
  process.exit(1);
}

const cases = parsed as Record<string, unknown>[];

if (cases.length === 0) {
  console.log(`${YELLOW}Warning:${RESET} Dataset array is empty — nothing to validate.`);
  console.log();
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Step 4: Validate each case and collect per-row data for the table
// ---------------------------------------------------------------------------
type RowResult = {
  id: string;
  presentFields: string[];
  hasModelGraded: boolean;
  errors: string[];
  warnings: string[];
};

const rows: RowResult[] = [];
let structuralErrors = 0;

for (let i = 0; i < cases.length; i++) {
  const item = cases[i];
  const rowIndex = `[${i}]`;

  const errors: string[] = [];
  const warnings: string[] = [];

  // --- id ---
  const rawId = item["id"];
  let displayId: string;
  if (rawId === undefined || rawId === null) {
    errors.push(`missing required field "id"`);
    displayId = `${rowIndex} (no id)`;
  } else if (typeof rawId !== "string") {
    errors.push(`"id" must be a string (got ${typeof rawId})`);
    displayId = `${rowIndex} (bad id)`;
  } else {
    displayId = rawId as string;
  }

  // --- input ---
  const rawInput = item["input"];
  if (rawInput === undefined || rawInput === null) {
    errors.push(`missing required field "input"`);
  } else if (typeof rawInput !== "object" || Array.isArray(rawInput)) {
    errors.push(`"input" must be an object (got ${Array.isArray(rawInput) ? "array" : typeof rawInput})`);
  }

  // --- expected ---
  const rawExpected = item["expected"];
  if (rawExpected === undefined || rawExpected === null) {
    errors.push(`missing required field "expected"`);
  } else if (typeof rawExpected !== "object" || Array.isArray(rawExpected)) {
    errors.push(`"expected" must be an object (got ${Array.isArray(rawExpected) ? "array" : typeof rawExpected})`);
  }

  // --- tags (optional) ---
  const rawTags = item["tags"];
  if (rawTags !== undefined && rawTags !== null && !Array.isArray(rawTags)) {
    errors.push(`"tags" must be an array if present (got ${typeof rawTags})`);
  }

  // --- recognised expected fields ---
  let presentFields: string[] = [];
  let hasModelGraded = false;

  if (
    rawExpected !== undefined &&
    rawExpected !== null &&
    typeof rawExpected === "object" &&
    !Array.isArray(rawExpected)
  ) {
    const expectedObj = rawExpected as Record<string, unknown>;
    presentFields = RECOGNIZED_EXPECTED_FIELDS.filter(
      (f) => f in expectedObj
    );
    hasModelGraded = presentFields.some((f) => MODEL_GRADED_FIELDS.has(f));

    if (presentFields.length === 0) {
      warnings.push(
        `no recognised expected fields found — autoScorer will pass unconditionally`
      );
    }
  }

  if (errors.length > 0) structuralErrors += errors.length;

  rows.push({ id: displayId, presentFields, hasModelGraded, errors, warnings });
}

// ---------------------------------------------------------------------------
// Step 5: Print the results table
// ---------------------------------------------------------------------------

// Determine column widths dynamically
const idColWidth = Math.max(20, ...rows.map((r) => r.id.length)) + 2;
const fieldsColHeader = "Expected fields present";
const statusColHeader = "Status";

const headerId      = "Case ID".padEnd(idColWidth);
const headerFields  = fieldsColHeader.padEnd(36);
const headerStatus  = statusColHeader;

console.log(`${BOLD}${headerId}  ${headerFields}  ${headerStatus}${RESET}`);
console.log("─".repeat(idColWidth + 2 + 36 + 2 + 10));

for (const row of rows) {
  const idCell     = row.id.padEnd(idColWidth);
  const fieldsCell = (row.presentFields.length > 0
    ? row.presentFields.join(", ")
    : DIM + "(none)" + RESET
  ).padEnd(36);

  let statusCell: string;
  if (row.errors.length > 0) {
    statusCell = `${RED}${BOLD}FAIL${RESET}`;
  } else if (row.warnings.length > 0) {
    statusCell = `${YELLOW}WARN${RESET}`;
  } else {
    statusCell = `${GREEN}OK${RESET}`;
  }

  console.log(`${idCell}  ${fieldsCell}  ${statusCell}`);

  for (const err of row.errors) {
    console.log(`  ${RED}  Error:${RESET} ${err}`);
  }
  for (const warn of row.warnings) {
    console.log(`  ${YELLOW}  Warning:${RESET} ${warn}`);
  }
}

console.log();

// ---------------------------------------------------------------------------
// Step 6: Summary
// ---------------------------------------------------------------------------
const totalCases     = rows.length;
const modelGradedCount = rows.filter((r) => r.hasModelGraded).length;
const warnCount      = rows.filter((r) => r.warnings.length > 0 && r.errors.length === 0).length;

if (structuralErrors === 0) {
  console.log(
    `${GREEN}${BOLD}✓${RESET} ${totalCases} case${totalCases !== 1 ? "s" : ""} validated` +
    (warnCount > 0 ? `, ${warnCount} with warnings` : "") +
    "."
  );
} else {
  console.log(
    `${RED}${BOLD}✗${RESET} ${structuralErrors} structural error${structuralErrors !== 1 ? "s" : ""} found across ${totalCases} case${totalCases !== 1 ? "s" : ""}.`
  );
}

console.log(
  `  ${modelGradedCount} case${modelGradedCount !== 1 ? "s" : ""} have model-graded criteria` +
  ` (require ANTHROPIC_API_KEY).`
);
console.log();

if (structuralErrors > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
