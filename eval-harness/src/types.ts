/**
 * Core TypeScript types for the Camp AIR eval harness.
 *
 * These types define the shape of eval definitions, dataset cases, grader
 * results, and final run outputs. Eval authors import EvalDefinition and
 * DatasetCase when writing their own eval files.
 */

// ---------------------------------------------------------------------------
// Dataset
// ---------------------------------------------------------------------------

/** A single row in an eval dataset. */
export interface DatasetCase {
  /** Unique identifier used in result tables and JSON output. */
  id: string;

  /** The input passed to the model under test (free-form key/value pairs). */
  input: Record<string, unknown>;

  /**
   * Expected behaviour descriptors consumed by graders.
   * What keys matter depends on which graders are registered.
   *
   * Recognised fields (all optional):
   *   max_length           (number)  — max output length in chars; used by lengthAndTopicGrader
   *   must_include_topic   (string | null) — substring output must contain; used by lengthAndTopicGrader
   *   must_include_keywords (string[]) — all substrings that must appear; used by keywordPresenceGrader
   *   must_not_contain     (string | null) — substring that must NOT appear; used by contentExclusionGrader
   *   format               ("json" | "bullet-list" | "plain-text") — expected output format; used by formatGrader
   *   classification       (string) — expected label/category in output; used by classificationGrader
   *   min_items            (number) — minimum non-empty lines expected; used by minItemsGrader
   *
   * Example: { max_length: 400, must_include_topic: "revenue", must_not_contain: "BANANA" }
   */
  expected: Record<string, unknown>;

  /** Optional tags used to filter cases with --tags on the CLI. */
  tags?: string[];
}

/**
 * NOTE — multi-turn conversation evals:
 * Prior conversation turns are stored directly in the `input` object rather
 * than as a separate top-level field. The conventional key is `input.history`,
 * an array of { role: "user" | "assistant", content: string } objects.
 * See examples/multi-turn-eval.ts for a complete working pattern.
 */

// ---------------------------------------------------------------------------
// Graders
// ---------------------------------------------------------------------------

/** The result returned by a single grader for a single case. */
export interface GraderResult {
  /** Human-readable grader name shown in the result table. */
  name: string;

  /** Whether this grader considers the output acceptable. */
  passed: boolean;

  /**
   * Continuous score between 0.0 and 1.0.
   * Only used by model-graded graders; deterministic graders omit this.
   */
  score?: number;

  /** Free-text explanation of why the grader passed or failed. */
  reason?: string;
}

/**
 * A grader function.
 *
 * Receives the raw model output string, the expected descriptor from the
 * dataset case, and the original input, and returns a GraderResult promise.
 */
export type Grader = (
  output: string,
  expected: Record<string, unknown>,
  input: Record<string, unknown>
) => Promise<GraderResult>;

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

/** The result of running all graders against a single dataset case. */
export interface CaseResult {
  caseId: string;
  tags: string[];
  passed: boolean;
  graderResults: GraderResult[];
  /** The raw string output produced by the model under test. */
  modelOutput: string;
  /** Wall-clock time from calling run() to receiving the output. */
  durationMs: number;
}

/** Aggregated result for a full eval run. */
export interface EvalResult {
  evalName: string;
  /** ISO-8601 timestamp of when the run started. */
  timestamp: string;
  totalCases: number;
  passedCases: number;
  failedCases: number;
  caseResults: CaseResult[];
}

// ---------------------------------------------------------------------------
// Eval definition
// ---------------------------------------------------------------------------

/**
 * The shape of the default export from every eval file.
 *
 * Eval authors construct one of these objects and export it as default.
 * The harness imports it, iterates over dataset, calls run(), and applies
 * each grader to the output.
 */
export interface EvalDefinition {
  /** Display name shown in the result table and written to the JSON file. */
  name: string;

  /** The dataset cases to evaluate. Use loadDataset() to load from a file. */
  dataset: DatasetCase[];

  /**
   * Calls the model (or agent) under test with a single case's input.
   * Must return the model's response as a plain string.
   */
  run: (input: Record<string, unknown>) => Promise<string>;

  /** Ordered list of graders applied to every case output. */
  graders: Grader[];
}

// ---------------------------------------------------------------------------
// Run options (internal — passed from CLI to harness)
// ---------------------------------------------------------------------------

/** Options parsed from the CLI and forwarded to runEval(). */
export interface RunOptions {
  /** Only run cases whose tags array includes this tag. */
  tagsFilter?: string;

  /** Print the full model output under each case row. */
  verbose: boolean;
}
