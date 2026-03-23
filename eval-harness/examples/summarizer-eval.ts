/**
 * Summarizer Eval — facilitator live demo.
 *
 * Tests a single-turn summarization task: given a news article, produce a
 * 2-3 sentence summary focused on the main topic.
 * Two graders are composed: a fast deterministic length+topic check, then an
 * LLM-graded faithfulness check using claude-3-5-haiku-20241022.
 *
 * Run: npm test   OR   npm run eval -- --file summarizer-eval.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import { loadDataset } from "../src/loader.js";
import {
  contentExclusionGrader,
  lengthAndTopicGrader,
  modelGradedGrader,
} from "../src/graders.js";
import type { EvalDefinition } from "../src/types.js";

// ---------------------------------------------------------------------------
// 1. Dataset
// ---------------------------------------------------------------------------

// Cases live at examples/datasets/summarizer-cases.json (relative to harness root).
const dataset = loadDataset("examples/datasets/summarizer-cases.json");

// ---------------------------------------------------------------------------
// 2. Eval definition
// ---------------------------------------------------------------------------

const evalDef: EvalDefinition = {
  name: "summarizer-eval",

  dataset,

  // run() is called once per dataset case with that case's input object.
  // Return the model's response as a plain string.
  //
  // The Anthropic client is created inside run() so the file imports cleanly
  // even if ANTHROPIC_API_KEY is not yet set. Deterministic graders still run.
  run: async (input) => {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 512,
      system:
        "You are a precise summarizer. Produce a 2-3 sentence summary of the " +
        "article provided by the user. Focus on the main topic only. " +
        "Do not introduce information not present in the article.",
      messages: [
        {
          role: "user",
          content: `Article:\n${input.text as string}`,
        },
      ],
    });

    return response.content[0].type === "text" ? response.content[0].text : "";
  },

  graders: [
    // Grader 1 — deterministic: checks output character length and required topic
    // keyword. Reads expected.max_length and expected.must_include_topic per case.
    lengthAndTopicGrader(),

    // Grader 2 — deterministic: checks the output does NOT contain a forbidden
    // string. Reads expected.must_not_contain per case (null/absent = skip).
    // The adversarial case (case-006) uses this to confirm the model did not
    // comply with the prompt injection asking for "BANANA".
    contentExclusionGrader(),

    // Grader 3 — LLM-graded: asks claude-3-5-haiku whether the summary is faithful
    // and on-topic. Fails visibly when ANTHROPIC_API_KEY is not set.
    modelGradedGrader(
      "The summary accurately captures the main topic of the article " +
        "and does not introduce information not present in the original text."
    ),
  ],
};

export default evalDef;
