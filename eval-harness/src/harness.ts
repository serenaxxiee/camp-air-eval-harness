/**
 * Core harness loop.
 *
 * runEval() is the heart of the eval harness. It:
 *   1. Optionally filters dataset cases by tag
 *   2. Calls evalDef.run() for each case to get the model output
 *   3. Runs every grader against the output
 *   4. Aggregates CaseResult objects into an EvalResult
 *
 * The CLI (src/index.ts) calls this function and passes the result to the
 * reporter. Eval files never import this directly.
 */

import type {
  CaseResult,
  DatasetCase,
  EvalDefinition,
  EvalResult,
  RunOptions,
  GraderResult,
} from "./types.js";

/**
 * Run a complete eval.
 *
 * @param evalDef  The eval definition loaded from an eval file.
 * @param options  Run-time options parsed from the CLI.
 * @returns        Aggregated EvalResult with per-case breakdowns.
 */
export async function runEval(
  evalDef: EvalDefinition,
  options: RunOptions
): Promise<EvalResult> {
  const timestamp = new Date().toISOString();

  // --- filter by tag if requested ---
  let cases: DatasetCase[] = evalDef.dataset;
  if (options.tagsFilter) {
    const tag = options.tagsFilter;
    cases = cases.filter((c) => Array.isArray(c.tags) && c.tags.includes(tag));

    if (cases.length === 0) {
      console.warn(
        `\nWarning: --tags "${tag}" matched no cases.\n` +
        `Tip: Check that the tag exists in your dataset's "tags" arrays.\n` +
        `Running 0 cases.\n`
      );
    }
  }

  // --- run each case ---
  // Cases run in parallel batches (max 5 concurrent) for speed. Graders within each case run in series.
  const CONCURRENCY_LIMIT = 5;
  const caseResults: CaseResult[] = [];

  for (let i = 0; i < cases.length; i += CONCURRENCY_LIMIT) {
    const batch = cases.slice(i, i + CONCURRENCY_LIMIT);
    const batchStart = i + 1;
    const batchEnd = Math.min(i + CONCURRENCY_LIMIT, cases.length);
    if (cases.length > 1) {
      process.stdout.write(`  Running cases ${batchStart}–${batchEnd} of ${cases.length}...\r`);
    }
    const batchResults = await Promise.all(batch.map((c) => runSingleCase(evalDef, c, options)));
    caseResults.push(...batchResults);
  }
  if (cases.length > 1) {
    // Clear the progress line before the reporter prints the result table
    process.stdout.write("  All cases complete.          \n");
  }

  // --- aggregate ---
  const passedCases = caseResults.filter((r) => r.passed).length;

  return {
    evalName: evalDef.name,
    timestamp,
    totalCases: caseResults.length,
    passedCases,
    failedCases: caseResults.length - passedCases,
    caseResults,
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Run a single dataset case through the model and all graders.
 */
async function runSingleCase(
  evalDef: EvalDefinition,
  dataCase: DatasetCase,
  _options: RunOptions
): Promise<CaseResult> {
  const startMs = Date.now();

  // Call the model under test
  let modelOutput = "";
  let runError: string | null = null;

  try {
    modelOutput = await evalDef.run(dataCase.input);
  } catch (err) {
    runError = (err as Error).message ?? String(err);
    modelOutput = "";
  }

  const durationMs = Date.now() - startMs;

  // Run graders (in series to keep API rate limits manageable)
  const graderResults: GraderResult[] = [];

  if (runError !== null) {
    // If the model call itself failed, immediately fail all graders
    for (const grader of evalDef.graders) {
      // We still need a name — call with empty output so the grader can return
      // its own name, but override passed to false with an error reason.
      try {
        const r = await grader("", dataCase.expected, dataCase.input);
        graderResults.push({
          ...r,
          passed: false,
          reason: `Model run failed: ${runError}`,
        });
      } catch {
        graderResults.push({
          name: "unknown",
          passed: false,
          reason: `Model run failed: ${runError}`,
        });
      }
    }
  } else {
    for (const grader of evalDef.graders) {
      try {
        const result = await grader(modelOutput, dataCase.expected, dataCase.input);
        graderResults.push(result);
      } catch (err) {
        graderResults.push({
          name: "grader-error",
          passed: false,
          reason: `Grader threw: ${(err as Error).message}`,
        });
      }
    }
  }

  // A case passes only when every grader passes
  const passed = graderResults.length > 0 && graderResults.every((r) => r.passed);

  return {
    caseId: dataCase.id,
    tags: dataCase.tags ?? [],
    passed,
    graderResults,
    modelOutput,
    durationMs,
  };
}
