#!/usr/bin/env node
/**
 * CLI entry point for the Camp AIR eval harness.
 *
 * Usage:
 *   npm run eval -- --file my-eval.ts
 *   npm run eval -- --file my-eval.ts --ci
 *   npm run eval -- --file my-eval.ts --tags edge-case
 *   npm run eval -- --file my-eval.ts --verbose
 *
 * --file accepts a bare filename OR a relative path from the harness root.
 * Bare filenames are searched in: my-evals/ then examples/
 *
 * Flags:
 *   --file <path>    Eval file to run (required).
 *   --ci             Exit 1 if any cases fail (for CI pipelines).
 *   --tags <tag>     Only run dataset cases that include this tag.
 *   --verbose        Print full model output under each case row.
 *
 * The eval file must have a default export of type EvalDefinition.
 */

import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { runEval } from "./harness.js";
import { printResults, writeResults } from "./reporter.js";
import type { EvalDefinition, RunOptions } from "./types.js";

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

const HELP_TEXT = `
Camp AIR Eval Harness

Usage:
  npm run eval -- --file <path> [options]

Options:
  --file <path>    Eval file to run (required). Bare filename or relative path.
  --ci             Exit code 1 if any cases fail (for CI pipelines).
  --tags <tag>     Only run cases whose tags array includes this value.
  --verbose        Print the full model output under each case row.
  --help, -h       Show this help message.

Examples:
  npm run eval -- --file my-eval.ts
  npm run eval -- --file my-eval.ts --verbose
  npm run eval -- --file my-eval.ts --tags edge-case --ci
  npm run eval -- --file my-evals/my-agent-eval.ts
  npm test                     (runs the demo eval)
`.trim();

function parseArgs(argv: string[]): {
  file: string | null;
  ci: boolean;
  tagsFilter: string | undefined;
  verbose: boolean;
  help: boolean;
} {
  const args = argv.slice(2); // drop "node" and script path
  let file: string | null = null;
  let ci = false;
  let tagsFilter: string | undefined;
  let verbose = false;
  let help = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--file" && args[i + 1]) {
      file = args[++i];
    } else if (arg === "--ci") {
      ci = true;
    } else if (arg === "--tags" && args[i + 1]) {
      tagsFilter = args[++i];
    } else if (arg === "--verbose") {
      verbose = true;
    } else if (arg === "--help" || arg === "-h") {
      help = true;
    }
  }

  return { file, ci, tagsFilter, verbose, help };
}

// ---------------------------------------------------------------------------
// File resolution
// ---------------------------------------------------------------------------

/**
 * Resolve the eval file path with a smart fallback search.
 *
 * Resolution order (first existing path wins):
 *   1. The value given by --file, relative to the harness root
 *   2. my-evals/<basename of value>
 *   3. examples/<basename of value>
 *
 * This lets participants type:
 *   --file my-eval.ts          (resolves to my-evals/my-eval.ts)
 *   --file summarizer-eval.ts  (resolves to examples/summarizer-eval.ts)
 *   --file my-evals/my-eval.ts (used as-is)
 */
function findEvalFile(rawFile: string, harnessRoot: string): string {
  const basename = path.basename(rawFile);
  const candidates = [
    path.resolve(harnessRoot, rawFile),
    path.resolve(harnessRoot, "my-evals", basename),
    path.resolve(harnessRoot, "examples", basename),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  // Return first candidate — import below will produce a clear ENOENT message.
  return candidates[0];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const { file, ci, tagsFilter, verbose, help } = parseArgs(process.argv);

  if (help) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  if (!file) {
    console.error(
      "Error: --file <path> is required.\n" +
        "Usage: npm run eval -- --file my-eval.ts"
    );
    process.exit(1);
  }

  // Warn (don't block) if no API key — model-graded graders will fail
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('\n⚠️  ANTHROPIC_API_KEY is not set. Model-graded graders will fail.');
    console.warn('   To fix: export ANTHROPIC_API_KEY=your-key-here\n');
  }

  const harnessRoot = process.cwd();
  const resolvedFile = findEvalFile(file, harnessRoot);

  // Dynamically import the eval file and extract its default export
  let evalDef: EvalDefinition;
  try {
    const fileUrl = pathToFileURL(resolvedFile).href;
    const module = (await import(fileUrl)) as { default: EvalDefinition };

    if (!module.default) {
      throw new Error(
        `The eval file does not have a default export.\n` +
          `Make sure your eval file ends with: export default evalDef;`
      );
    }
    evalDef = module.default;
  } catch (err) {
    console.error(`\nFailed to load eval file: ${resolvedFile}`);
    console.error((err as Error).message);
    process.exit(1);
  }

  // Validate the eval definition shape
  if (!evalDef.name || !Array.isArray(evalDef.dataset) || typeof evalDef.run !== "function" || !Array.isArray(evalDef.graders)) {
    console.error(
      "Error: The default export from the eval file must be an EvalDefinition with:\n" +
        "  name: string\n" +
        "  dataset: DatasetCase[]\n" +
        "  run: (input) => Promise<string>\n" +
        "  graders: Grader[]"
    );
    process.exit(1);
  }

  const options: RunOptions = { tagsFilter, verbose };

  // Run the eval
  const result = await runEval(evalDef, options);

  // Write JSON results file (silent — no console output from writeResults itself)
  const outPath = writeResults(result, harnessRoot);

  // Print the result table, then the copy-pasteable block, then the saved-to path
  // (all three appear in that order because printResults emits the saved-to line last)
  printResults(result, verbose, outPath);

  // Exit 1 in CI mode if any cases failed
  if (ci && result.failedCases > 0) {
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
