/**
 * Terminal reporter and JSON results writer.
 *
 * printResults() renders the result table to stdout.
 * writeResults()  serialises the EvalResult to a JSON file under results/.
 *
 * Output format:
 *
 *   Running eval: summarizer-eval (5 cases)
 *
 *     CASE ID     STATUS   GRADERS                              DURATION
 *     case-001    PASS     length+topic: PASS, model-graded: 0.9 PASS   342ms
 *     case-003    FAIL     length+topic: FAIL (length 412/400)          301ms
 *
 *   Results: 4/5 passed (80%)
 *   Written to: results/summarizer-eval-2026-03-21T14-22-10.json
 *
 * When --verbose is active, the full model output is printed under each row.
 */

import fs from "fs";
import path from "path";
import type { CaseResult, EvalResult, GraderResult } from "./types.js";

// ---------------------------------------------------------------------------
// ANSI colour helpers (gracefully disabled when not in a TTY)
// ---------------------------------------------------------------------------

const isTTY = process.stdout.isTTY;

function green(s: string): string {
  return isTTY ? `\x1b[32m${s}\x1b[0m` : s;
}
function red(s: string): string {
  return isTTY ? `\x1b[31m${s}\x1b[0m` : s;
}
function yellow(s: string): string {
  return isTTY ? `\x1b[33m${s}\x1b[0m` : s;
}
function bold(s: string): string {
  return isTTY ? `\x1b[1m${s}\x1b[0m` : s;
}
function dim(s: string): string {
  return isTTY ? `\x1b[2m${s}\x1b[0m` : s;
}

// ---------------------------------------------------------------------------
// printResults
// ---------------------------------------------------------------------------

/**
 * Print a formatted result table to stdout.
 *
 * @param result   The aggregated eval result.
 * @param verbose  When true, print the full model output under each case row.
 * @param outPath  Path where the JSON was written (shown in the summary line).
 */
export function printResults(
  result: EvalResult,
  verbose: boolean,
  outPath: string
): void {
  console.log("");
  console.log(
    bold(`Running eval: ${result.evalName}`) +
      ` (${result.totalCases} case${result.totalCases !== 1 ? "s" : ""})`
  );
  console.log("");

  // --- header row ---
  console.log(
    "  " +
      bold(padRight("CASE ID", 16)) +
      bold(padRight("STATUS", 9)) +
      bold(padRight("GRADERS", 52)) +
      bold("DURATION")
  );

  // --- case rows ---
  for (const c of result.caseResults) {
    const statusStr = c.passed ? green("PASS") : red("FAIL");
    const graderStr = formatGraders(c.graderResults);
    const durationStr = dim(`${c.durationMs}ms`);

    console.log(
      "  " +
        padRight(c.caseId, 16) +
        padRight(statusStr, 9 + ansiPad(statusStr)) +
        padRight(graderStr, 52 + ansiPad(graderStr)) +
        durationStr
    );

    if (verbose) {
      console.log("");
      console.log(dim("    --- model output ---"));
      // Indent each line of the model output for readability
      const lines = c.modelOutput.split("\n");
      for (const line of lines) {
        console.log(dim(`    ${line}`));
      }
      console.log("");
    }
  }

  console.log("");

  // --- summary line ---
  const pct = result.totalCases > 0
    ? Math.round((result.passedCases / result.totalCases) * 100)
    : 0;

  const summaryColor = result.failedCases === 0 ? green : result.failedCases === result.totalCases ? red : yellow;

  console.log(
    summaryColor(
      bold(
        `Results: ${result.passedCases}/${result.totalCases} passed (${pct}%)`
      )
    )
  );
  console.log(dim(`Written to: ${outPath}`));
  console.log("");

  // --- copy-pasteable summary for /eval-result-interpreter ---
  const failedCaseIds = result.caseResults
    .filter((c) => !c.passed)
    .map((c) => c.caseId);

  const summary = {
    evalName: result.evalName,
    passedCases: result.passedCases,
    totalCases: result.totalCases,
    passRate: `${pct}%`,
    failedCaseIds,
    timestamp: result.timestamp,
  };

  const divider = "────────────────────────────────────────────";
  console.log(bold(divider));
  console.log(bold("PASTE INTO /eval-result-interpreter:"));
  console.log(bold(divider));
  console.log(bold(JSON.stringify(summary)));
  console.log(bold(divider));
  console.log("");
  console.log(dim(`📄 Full results saved to: ${outPath}`));
  console.log("");
}

// ---------------------------------------------------------------------------
// writeResults
// ---------------------------------------------------------------------------

/**
 * Serialise an EvalResult to JSON and write it to the results/ directory.
 *
 * The filename is: results/<evalName>-<ISO-timestamp-safe>.json
 * Directory is created if it does not exist.
 *
 * @returns The relative path to the written file (for display purposes).
 */
export function writeResults(result: EvalResult, harnessRoot: string): string {
  const resultsDir = path.join(harnessRoot, "results");
  fs.mkdirSync(resultsDir, { recursive: true });

  // Make timestamp filesystem-safe by replacing colons and dots
  const safeTimestamp = result.timestamp
    .replace(/:/g, "-")
    .replace(/\..+$/, ""); // remove milliseconds

  const fileName = `${result.evalName}-${safeTimestamp}.json`;
  const fullPath = path.join(resultsDir, fileName);

  fs.writeFileSync(fullPath, JSON.stringify(result, null, 2), "utf-8");

  const relativePath = path.relative(process.cwd(), fullPath).replace(/\\/g, "/");

  return relativePath;
}

// ---------------------------------------------------------------------------
// Internal formatting helpers
// ---------------------------------------------------------------------------

/**
 * Format the grader results for a single case into a compact string.
 * Example: "length+topic: PASS, model-graded: 0.9 PASS"
 */
function formatGraders(graderResults: GraderResult[]): string {
  return graderResults
    .map((s) => {
      const statusTag = s.passed ? green("PASS") : red("FAIL");
      const scoreTag =
        s.score !== undefined ? yellow(s.score.toFixed(1)) + " " : "";

      // Always surface the grader reason so participants can see why a case
      // passed as well as why it failed — more educational in a workshop context.
      const hint = s.reason ? dim(` (${s.reason})`) : "";

      return `${s.name}: ${scoreTag}${statusTag}${hint}`;
    })
    .join(", ");
}

/** Pad a plain string (no ANSI) to a fixed width with spaces. */
function padRight(s: string, width: number): string {
  const visible = stripAnsi(s);
  const pad = Math.max(0, width - visible.length);
  return s + " ".repeat(pad);
}

/**
 * When a string contains ANSI escape codes the visible character count is
 * shorter than s.length. Return the number of invisible bytes so callers can
 * compensate when computing pad widths.
 */
function ansiPad(s: string): number {
  return s.length - stripAnsi(s).length;
}

/** Remove ANSI escape sequences to measure visible character length. */
function stripAnsi(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/\x1b\[[0-9;]*m/g, "");
}
