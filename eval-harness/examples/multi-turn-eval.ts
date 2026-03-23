/**
 * Multi-turn Eval — customer support bot evaluated over 2-turn conversations
 *
 * This eval demonstrates how to test a model that must maintain context
 * across multiple conversation turns. Prior turns are stored directly in the
 * dataset case's `input.history` field as an array of {role, content} objects.
 * The `run()` function builds the full Anthropic messages array by prepending
 * those prior turns before the final user message.
 *
 * Run it with:
 *   npm run eval -- --file examples/multi-turn-eval.ts
 *   npm run eval -- --file examples/multi-turn-eval.ts --verbose
 *   npm run eval -- --file examples/multi-turn-eval.ts --tags edge-case
 *
 * Pattern overview (compare with summarizer-eval.ts):
 *   - summarizer-eval.ts : single-turn  → input.text is the article
 *   - multi-turn-eval.ts : multi-turn   → input.history[] + input.message
 *
 * How to read this file:
 *   1. dataset    — 5 cases loaded from examples/datasets/multi-turn-cases.json
 *   2. run()      — builds the Anthropic messages array from history + message
 *   3. graders    — two checks applied to every case output:
 *                   (a) deterministic content-exclusion check
 *                   (b) LLM-graded context-consistency check
 */

import Anthropic from "@anthropic-ai/sdk";
import { loadDataset } from "../src/loader.js";
import { contentExclusionGrader, modelGradedGrader } from "../src/graders.js";
import type { EvalDefinition } from "../src/types.js";

// ---------------------------------------------------------------------------
// 1. Dataset
// ---------------------------------------------------------------------------

// Paths are relative to the harness root (where package.json lives).
const dataset = loadDataset("examples/datasets/multi-turn-cases.json");

// NOTE: The multi-turn dataset cases include a max_length field in `expected` for
// documentation purposes (showing what a good response length limit looks like),
// but this eval does not wire up lengthAndTopicGrader — it uses contentExclusionGrader
// instead, which reads `expected.must_not_contain`. To also enforce length, you could
// add lengthAndTopicGrader() to the graders array.

// ---------------------------------------------------------------------------
// 2. Eval definition
// ---------------------------------------------------------------------------

const evalDef: EvalDefinition = {
  name: "multi-turn-eval",

  dataset,

  // run() is called once per dataset case.
  //
  // Multi-turn pattern:
  //   1. Read input.history — prior turns already in {role, content} format
  //   2. Append input.message as the final user turn
  //   3. Call the Anthropic API with the full messages array
  //
  // This is intentionally simple. For a real customer support bot you would
  // also pass a system prompt describing the bot's persona and constraints.
  run: async (input) => {
    // The Anthropic client is created inside run() so the file imports cleanly
    // even if ANTHROPIC_API_KEY is not yet set. Deterministic graders still run.
    const client = new Anthropic();

    // input.history is an array of prior {role, content} turns from the JSON.
    // Cast carefully: if a case has no history, default to an empty array.
    type Turn = { role: "user" | "assistant"; content: string };
    const history = (input.history as Turn[] | undefined) ?? [];

    const messages: Array<{ role: "user" | "assistant"; content: string }> = [
      ...history,
      { role: "user", content: input.message as string },
    ];

    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 512,
      system:
        "You are a helpful customer support agent for TravelEase, a travel booking platform. " +
        "Be concise, friendly, and accurate. Always maintain context from earlier in the conversation.",
      messages,
    });

    return response.content[0].type === "text" ? response.content[0].text : "";
  },

  graders: [
    // Deterministic: checks that the response does not mention a forbidden term.
    // Uses the built-in contentExclusionGrader from src/graders.ts — reads
    // expected.must_not_contain from each dataset case.
    contentExclusionGrader(),

    // Model-graded: checks that the response is consistent with prior context.
    modelGradedGrader(
      "The response is consistent with the prior conversation context. " +
        "If the user provided personal details or constraints earlier in the conversation, " +
        "the response must respect them and not ask for information already given. " +
        "The response should directly address the user's latest message."
    ),
  ],
};

export default evalDef;
