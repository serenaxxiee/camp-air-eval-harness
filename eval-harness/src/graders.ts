/**
 * Built-in grader helpers.
 *
 * Eval files import these helpers to compose graders for their eval definition.
 * Each helper returns a Grader function (the actual callable consumed by the
 * harness loop).
 *
 * Eight built-ins are provided:
 *
 *   lengthAndTopicGrader()
 *     A fast deterministic grader. Checks that the output is below a character
 *     limit (from expected.max_length) and that it mentions a required topic
 *     substring (from expected.must_include_topic).
 *
 *   keywordPresenceGrader()
 *     A deterministic grader that checks whether the output contains ALL of the
 *     required keywords listed in expected.must_include_keywords (case-insensitive).
 *     Passes unconditionally when the field is absent or empty.
 *
 *   contentExclusionGrader()
 *     A deterministic grader that checks the output does NOT contain a forbidden
 *     string (from expected.must_not_contain, case-insensitive).
 *     Passes unconditionally when the field is absent or null.
 *
 *   formatGrader()
 *     A deterministic grader that checks the output matches a required format
 *     (from expected.format: "json" | "bullet-list" | "plain-text").
 *     Passes unconditionally when the field is absent or null.
 *
 *   classificationGrader()
 *     A deterministic grader that checks the output contains the expected
 *     classification label (from expected.classification, case-insensitive).
 *     Passes unconditionally when the field is absent.
 *
 *   minItemsGrader()
 *     A deterministic grader that checks the output contains at least
 *     expected.min_items non-empty lines (counts newline-separated items).
 *     Passes unconditionally when the field is absent.
 *
 *   modelGradedGrader(criteriaDescription)
 *     An LLM-powered grader. Sends the output and a criteria description to
 *     GRADER_MODEL and parses a 0.0–1.0 score + pass/fail from the response.
 *     When ANTHROPIC_API_KEY is not set, returns a failing result so you notice.
 *
 *   jsonOutputGrader(requiredKeys?)
 *     A deterministic grader that verifies the output is valid JSON.
 *     Optionally checks that all keys in requiredKeys are present at the top level.
 *     Useful for agents that return structured data.
 *
 * Eval authors can also write their own Grader functions — just match the type:
 *
 *   type Grader = (output, expected, input) => Promise<GraderResult>
 */

import Anthropic from "@anthropic-ai/sdk";
import type { Grader, GraderResult } from "./types.js";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Model used by modelGradedGrader. Change here to update everywhere. */
const GRADER_MODEL = "claude-3-5-haiku-20241022";

// ---------------------------------------------------------------------------
// lengthAndTopicGrader
// ---------------------------------------------------------------------------

/**
 * Deterministic grader that checks:
 *   1. Output length <= expected.max_length (characters, default 1000)
 *   2. Output contains expected.must_include_topic substring (case-insensitive)
 *      — skipped when must_include_topic is null or absent
 *
 * The grader passes only when both checks pass (when applicable).
 */
export function lengthAndTopicGrader(): Grader {
  return async (
    output: string,
    expected: Record<string, unknown>
  ): Promise<GraderResult> => {
    const maxLength =
      typeof expected.max_length === "number" ? expected.max_length : 1000;
    const requiredTopic =
      typeof expected.must_include_topic === "string"
        ? expected.must_include_topic
        : null;

    // --- length check ---
    const actualLength = output.length;
    const lengthOk = actualLength <= maxLength;

    // --- topic check ---
    const topicOk =
      requiredTopic === null ||
      output.toLowerCase().includes(requiredTopic.toLowerCase());

    const passed = lengthOk && topicOk;

    // Build a compact reason string for the result table
    const parts: string[] = [];
    if (!lengthOk) {
      parts.push(`length ${actualLength}/${maxLength} chars`);
    } else {
      parts.push(`length ok (${actualLength}/${maxLength})`);
    }
    if (requiredTopic !== null) {
      parts.push(topicOk ? `topic "${requiredTopic}" found` : `topic "${requiredTopic}" missing`);
    }

    return {
      name: "length+topic",
      passed,
      reason: parts.join("; "),
    };
  };
}

// ---------------------------------------------------------------------------
// keywordPresenceGrader
// ---------------------------------------------------------------------------

/**
 * Deterministic grader that checks whether the output contains all required keywords.
 * Reads expected.must_include_keywords (string[]) — an array of required substrings (case-insensitive).
 * Passes when every keyword is found in the output.
 * If must_include_keywords is absent or empty, the grader passes unconditionally.
 */
export function keywordPresenceGrader(): Grader {
  return async (
    output: string,
    expected: Record<string, unknown>
  ): Promise<GraderResult> => {
    const keywords =
      Array.isArray(expected.must_include_keywords)
        ? (expected.must_include_keywords as string[])
        : [];

    // Pass unconditionally when the field is absent or empty
    if (keywords.length === 0) {
      return {
        name: "keyword-presence",
        passed: true,
        reason: "No keywords required for this case.",
      };
    }

    const outputLower = output.toLowerCase();
    const missing = keywords.filter(
      (kw) => !outputLower.includes(kw.toLowerCase())
    );

    const passed = missing.length === 0;
    const reason = passed
      ? `all ${keywords.length} keyword${keywords.length === 1 ? "" : "s"} found`
      : `missing keyword${missing.length === 1 ? "" : "s"}: ${missing.map((k) => `"${k}"`).join(", ")}`;

    return {
      name: "keyword-presence",
      passed,
      reason,
    };
  };
}

// ---------------------------------------------------------------------------
// jsonOutputGrader
// ---------------------------------------------------------------------------

/**
 * Deterministic grader that verifies the model output is valid JSON and
 * optionally checks that specific top-level keys are present.
 *
 * Use this for agents that return structured data (e.g., a JSON object with
 * a "category" field and a "response" field).
 *
 * @param requiredKeys  Optional array of key names that must exist at the top
 *                      level of the parsed JSON object. Leave empty (or omit)
 *                      to check only that the output is valid JSON.
 *
 * Example:
 *   jsonOutputGrader(["category", "response"])
 *   // Passes when output parses as JSON and has both "category" and "response" keys.
 */
export function jsonOutputGrader(requiredKeys: string[] = []): Grader {
  return async (output: string): Promise<GraderResult> => {
    // --- parse check ---
    let parsed: unknown;
    try {
      parsed = JSON.parse(output.trim());
    } catch {
      return {
        name: "json-output",
        passed: false,
        reason: "Output is not valid JSON.",
      };
    }

    // If no required keys, parsing is sufficient.
    if (requiredKeys.length === 0) {
      return {
        name: "json-output",
        passed: true,
        reason: "Output is valid JSON.",
      };
    }

    // --- key presence check ---
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {
        name: "json-output",
        passed: false,
        reason: `Output is valid JSON but is not an object — cannot check for keys: ${requiredKeys.join(", ")}.`,
      };
    }

    const obj = parsed as Record<string, unknown>;
    const missingKeys = requiredKeys.filter((k) => !(k in obj));

    if (missingKeys.length > 0) {
      return {
        name: "json-output",
        passed: false,
        reason: `Valid JSON but missing required key${missingKeys.length === 1 ? "" : "s"}: ${missingKeys.map((k) => `"${k}"`).join(", ")}.`,
      };
    }

    return {
      name: "json-output",
      passed: true,
      reason: `Valid JSON with all required keys: ${requiredKeys.map((k) => `"${k}"`).join(", ")}.`,
    };
  };
}

// ---------------------------------------------------------------------------
// contentExclusionGrader
// ---------------------------------------------------------------------------

/**
 * Deterministic grader that checks the output does NOT contain a forbidden string.
 *
 * Reads expected.must_not_contain (string | null).
 * - If null or absent: PASS (no exclusion requirement for this case).
 * - If a string: FAIL when the output contains that string (case-insensitive),
 *   PASS when the output does not.
 *
 * Use this for adversarial cases (prompt injection, policy violations,
 * hallucinated content, forbidden disclosures, etc.).
 *
 * Name: "content-exclusion"
 */
export function contentExclusionGrader(): Grader {
  return async (
    output: string,
    expected: Record<string, unknown>
  ): Promise<GraderResult> => {
    const forbidden =
      typeof expected.must_not_contain === "string"
        ? expected.must_not_contain
        : null;

    // Skip when the field is absent or null
    if (forbidden === null) {
      return {
        name: "content-exclusion",
        passed: true,
        reason: "No content exclusion required for this case.",
      };
    }

    const found = output.toLowerCase().includes(forbidden.toLowerCase());

    return {
      name: "content-exclusion",
      passed: !found,
      reason: found
        ? `Output contains forbidden string: "${forbidden}"`
        : `Forbidden string "${forbidden}" not found — ok.`,
    };
  };
}

// ---------------------------------------------------------------------------
// formatGrader
// ---------------------------------------------------------------------------

/**
 * Deterministic grader that checks the output matches a required format.
 *
 * Reads expected.format ("json" | "bullet-list" | "plain-text").
 * - "json":        PASS when output is valid JSON (any JSON value).
 * - "bullet-list": PASS when output contains at least one bullet point line
 *                  starting with "- ", "• ", or "* ".
 * - "plain-text":  Always PASS (any text qualifies as plain text).
 * - absent/null:   PASS (no format requirement for this case).
 *
 * Name: "format"
 */
export function formatGrader(): Grader {
  return async (
    output: string,
    expected: Record<string, unknown>
  ): Promise<GraderResult> => {
    const format =
      typeof expected.format === "string" ? expected.format : null;

    if (format === null) {
      return {
        name: "format",
        passed: true,
        reason: "No format requirement for this case.",
      };
    }

    if (format === "json") {
      try {
        JSON.parse(output.trim());
        return { name: "format", passed: true, reason: "Output is valid JSON." };
      } catch {
        return { name: "format", passed: false, reason: "Output is not valid JSON." };
      }
    }

    if (format === "bullet-list") {
      // Match lines starting with "- ", "• ", or "* " (with optional leading whitespace)
      const hasBullet = /^[ \t]*([-•*]) /m.test(output);
      return {
        name: "format",
        passed: hasBullet,
        reason: hasBullet
          ? "Output contains at least one bullet point."
          : 'Output contains no bullet points (expected lines starting with "- ", "• ", or "* ").',
      };
    }

    if (format === "plain-text") {
      return {
        name: "format",
        passed: true,
        reason: "Format is plain-text — any output qualifies.",
      };
    }

    // Unknown format value — fail with an informative message
    return {
      name: "format",
      passed: false,
      reason: `Unknown format value "${format}". Expected "json", "bullet-list", or "plain-text".`,
    };
  };
}

// ---------------------------------------------------------------------------
// classificationGrader
// ---------------------------------------------------------------------------

/**
 * Deterministic grader that checks the output contains the expected
 * classification label.
 *
 * Reads expected.classification (string).
 * - If absent: PASS (no classification requirement for this case).
 * - If present: PASS when the output contains the classification string
 *   (case-insensitive exact match anywhere in the output).
 *
 * Use this for agents that label or categorise their input (e.g., sentiment
 * classifiers, triage agents, routing agents).
 *
 * Name: "classification"
 */
export function classificationGrader(): Grader {
  return async (
    output: string,
    expected: Record<string, unknown>
  ): Promise<GraderResult> => {
    const classification =
      typeof expected.classification === "string"
        ? expected.classification
        : null;

    if (classification === null) {
      return {
        name: "classification",
        passed: true,
        reason: "No classification requirement for this case.",
      };
    }

    const found = output.toLowerCase().includes(classification.toLowerCase());

    return {
      name: "classification",
      passed: found,
      reason: found
        ? `Classification "${classification}" found in output.`
        : `Expected classification "${classification}" not found in output.`,
    };
  };
}

// ---------------------------------------------------------------------------
// minItemsGrader
// ---------------------------------------------------------------------------

/**
 * Deterministic grader that checks the output contains at least a minimum
 * number of items.
 *
 * Reads expected.min_items (integer).
 * - If absent: PASS (no minimum item count for this case).
 * - If present: counts non-empty lines in the output and passes when the
 *   count >= min_items. This works for both newline-separated lists and
 *   bullet-point lists.
 *
 * Use this for agents that must return a list of a certain length (e.g., "at
 * least 3 action items", "at least 5 recommendations").
 *
 * Name: "min-items"
 */
export function minItemsGrader(): Grader {
  return async (
    output: string,
    expected: Record<string, unknown>
  ): Promise<GraderResult> => {
    const minItems =
      typeof expected.min_items === "number" ? expected.min_items : null;

    if (minItems === null) {
      return {
        name: "min-items",
        passed: true,
        reason: "No minimum item count required for this case.",
      };
    }

    const nonEmptyLines = output
      .split("\n")
      .filter((line) => line.trim().length > 0);
    const count = nonEmptyLines.length;
    const passed = count >= minItems;

    return {
      name: "min-items",
      passed,
      reason: passed
        ? `${count} non-empty line${count === 1 ? "" : "s"} found (minimum ${minItems}).`
        : `Only ${count} non-empty line${count === 1 ? "" : "s"} found; expected at least ${minItems}.`,
    };
  };
}

// ---------------------------------------------------------------------------
// autoGrader
// ---------------------------------------------------------------------------

/**
 * Universal auto-grader that inspects the `expected` block of each dataset
 * case and automatically applies whichever sub-graders are relevant based on
 * which fields are present.
 *
 * This is the recommended grader to use when your dataset was produced by
 * /eval-generator. Drop it in as your only grader and it will handle every
 * expected field type automatically — no manual wiring required.
 *
 * Field-to-grader mappings:
 *   expected.max_length or expected.must_include_topic → lengthAndTopicGrader
 *   expected.must_include_keywords                     → keywordPresenceGrader
 *   expected.must_not_contain                          → contentExclusionGrader
 *   expected.format                                    → formatGrader
 *   expected.classification                            → classificationGrader
 *   expected.min_items                                 → minItemsGrader
 *   expected.criteria                                  → modelGradedGrader(criteria)
 *
 * Each sub-grader result appears in the output with its own labelled name
 * (e.g., "auto[length+topic]", "auto[keywords]", "auto[model-graded]").
 * The combined grader passes only when every applicable sub-grader passes.
 * Cases with none of the recognised fields pass unconditionally with a note.
 *
 * Name: "auto"
 */
export function autoGrader(): Grader {
  return async (
    output: string,
    expected: Record<string, unknown>,
    input: Record<string, unknown>
  ): Promise<GraderResult> => {
    // Determine which sub-graders apply for this case
    const hasLengthOrTopic =
      typeof expected.max_length === "number" ||
      typeof expected.must_include_topic === "string";
    const hasKeywords =
      Array.isArray(expected.must_include_keywords) &&
      (expected.must_include_keywords as unknown[]).length > 0;
    const hasExclusion = typeof expected.must_not_contain === "string";
    const hasFormat = typeof expected.format === "string";
    const hasClassification = typeof expected.classification === "string";
    const hasMinItems = typeof expected.min_items === "number";
    const hasCriteria = typeof expected.criteria === "string";

    // If no recognised fields are present, pass unconditionally
    if (
      !hasLengthOrTopic &&
      !hasKeywords &&
      !hasExclusion &&
      !hasFormat &&
      !hasClassification &&
      !hasMinItems &&
      !hasCriteria
    ) {
      return {
        name: "auto",
        passed: true,
        reason: "No recognised expected fields — passing unconditionally.",
      };
    }

    // Run applicable sub-graders and collect results
    const subResults: GraderResult[] = [];

    if (hasLengthOrTopic) {
      const raw = await lengthAndTopicGrader()(output, expected, input);
      subResults.push({ ...raw, name: "auto[length+topic]" });
    }

    if (hasKeywords) {
      const raw = await keywordPresenceGrader()(output, expected, input);
      subResults.push({ ...raw, name: "auto[keywords]" });
    }

    if (hasExclusion) {
      const raw = await contentExclusionGrader()(output, expected, input);
      subResults.push({ ...raw, name: "auto[exclusion]" });
    }

    if (hasFormat) {
      const raw = await formatGrader()(output, expected, input);
      subResults.push({ ...raw, name: "auto[format]" });
    }

    if (hasClassification) {
      const raw = await classificationGrader()(output, expected, input);
      subResults.push({ ...raw, name: "auto[classification]" });
    }

    if (hasMinItems) {
      const raw = await minItemsGrader()(output, expected, input);
      subResults.push({ ...raw, name: "auto[min-items]" });
    }

    if (hasCriteria) {
      const criteria = expected.criteria as string;
      const raw = await modelGradedGrader(criteria)(output, expected, input);
      subResults.push({ ...raw, name: "auto[model-graded]" });
    }

    // Combined: pass only when all sub-graders pass
    const allPassed = subResults.every((r) => r.passed);
    const failedNames = subResults
      .filter((r) => !r.passed)
      .map((r) => r.name)
      .join(", ");

    const reasons = subResults
      .map((r) => `[${r.name}] ${r.passed ? "PASS" : "FAIL"}: ${r.reason ?? ""}`)
      .join(" | ");

    return {
      name: "auto",
      passed: allPassed,
      reason: allPassed
        ? `All sub-graders passed. ${reasons}`
        : `Failed: ${failedNames}. ${reasons}`,
    };
  };
}

// ---------------------------------------------------------------------------
// modelGradedGrader
// ---------------------------------------------------------------------------

/** Threshold above which the model-graded grader is considered passing. */
const MODEL_GRADED_PASS_THRESHOLD = 0.6;

/**
 * LLM-powered grader.
 *
 * Sends the model output and a human-written criteria description to
 * GRADER_MODEL and asks it to return a JSON object with:
 *   { "score": <0.0–1.0>, "reasoning": "<brief explanation>" }
 *
 * The grader passes when score >= 0.6.
 *
 * When ANTHROPIC_API_KEY is not set, returns a FAILING result with a clear
 * message so participants know they need to set the API key.
 *
 * @param criteriaDescription  Plain-English description of what "good" looks
 *                             like. This is injected directly into the grader
 *                             prompt, so write it as a complete sentence.
 */
export function modelGradedGrader(criteriaDescription: string): Grader {
  // Check API key and create client once at grader-creation time, not on each call.
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
  const client = hasApiKey ? new Anthropic() : null;

  return async (
    output: string,
    _expected: Record<string, unknown>,
    _input: Record<string, unknown>
  ): Promise<GraderResult> => {
    // --- no API key: fail visibly so participants notice and fix it ---
    if (!hasApiKey || !client) {
      return {
        name: "model-graded",
        passed: false,
        score: 0,
        reason:
          "[MOCK] No ANTHROPIC_API_KEY set — model-graded scoring skipped. Set API key to enable.",
      };
    }

    // Chain-of-thought prompt: reasoning before score improves judge accuracy ~15-20%
    // (per Anthropic "Demystifying Evals" and Evidently AI LLM-as-a-Judge guide).
    // The model writes its analysis first, then commits to a numeric score — the
    // reverse order (score first) causes the reasoning to rationalise the score
    // rather than drive it.
    const graderPrompt = `You are an impartial evaluator judging AI-generated text.

CRITERIA:
${criteriaDescription}

OUTPUT TO EVALUATE:
"""
${output}
"""

Evaluate whether the output meets the criteria above.

Step 1 — write your reasoning first (2-4 sentences): analyse whether the output satisfies each part of the criteria. Note any gaps, errors, or strengths.

Step 2 — after your reasoning, respond with ONLY a valid JSON object on its own line (no markdown, no extra text):
{"score": <number between 0.0 and 1.0>, "reasoning": "<copy your 1-2 sentence summary here>"}

Where score means:
  1.0 = fully meets criteria
  0.7 = mostly meets criteria with minor issues
  0.4 = partially meets criteria
  0.0 = does not meet criteria at all`;

    try {
      const response = await client.messages.create({
        model: GRADER_MODEL,
        max_tokens: 256,
        messages: [{ role: "user", content: graderPrompt }],
      });

      const rawText =
        response.content[0].type === "text" ? response.content[0].text.trim() : "";

      // Parse the JSON response from the grader
      let score = 0.0;
      let reasoning = "Could not parse grader response.";

      try {
        // Strip any accidental markdown code fences
        const jsonText = rawText.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/, "");
        const parsed = JSON.parse(jsonText) as { score: number; reasoning: string };
        score = typeof parsed.score === "number" ? Math.max(0, Math.min(1, parsed.score)) : 0;
        reasoning = typeof parsed.reasoning === "string" ? parsed.reasoning : rawText;
      } catch {
        // If JSON parse fails, try to extract a number from the raw text
        const match = rawText.match(/(\d+\.?\d*)/);
        if (match) {
          score = Math.max(0, Math.min(1, parseFloat(match[1])));
        }
        reasoning = `Parse error; raw response: ${rawText.slice(0, 120)}`;
      }

      return {
        name: "model-graded",
        passed: score >= MODEL_GRADED_PASS_THRESHOLD,
        score,
        reason: reasoning,
      };
    } catch (err) {
      // Network / API errors should not crash the harness — return a fail
      return {
        name: "model-graded",
        passed: false,
        score: 0,
        reason: `Grader API error: ${(err as Error).message}`,
      };
    }
  };
}
