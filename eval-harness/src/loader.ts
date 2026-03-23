/**
 * Dataset loader utility.
 *
 * Eval files call loadDataset() to read a JSON file from disk and get back
 * a typed array of DatasetCase objects. The path is resolved relative to
 * process.cwd(), which is the harness root when running via `npm run eval`.
 *
 * Usage in an eval file:
 *
 *   import { loadDataset } from "../src/loader.js";
 *   const dataset = loadDataset("examples/datasets/summarizer-cases.json");
 */

import fs from "fs";
import path from "path";
import type { DatasetCase } from "./types.js";

/**
 * Load a dataset from a JSON file.
 *
 * @param filePath  Path to the JSON file. Resolved relative to process.cwd()
 *                  (the harness root), so eval files can use paths like
 *                  "examples/datasets/my-cases.json".
 * @returns         Array of DatasetCase objects.
 */
export function loadDataset(filePath: string): DatasetCase[] {
  const resolved = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(resolved)) {
    throw new Error(
      `loadDataset: file not found at "${resolved}"\n` +
        `  Make sure paths are relative to the harness root (where package.json lives).`
    );
  }

  const raw = fs.readFileSync(resolved, "utf-8");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`loadDataset: failed to parse JSON at "${resolved}": ${err}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      `loadDataset: expected a JSON array at "${resolved}", got ${typeof parsed}`
    );
  }

  // Lightweight validation — warn on missing required fields rather than
  // throwing, so a partially-valid dataset still runs during a workshop.
  for (let i = 0; i < parsed.length; i++) {
    const item = parsed[i] as Record<string, unknown>;
    if (typeof item.id !== "string") {
      console.warn(
        `loadDataset: case at index ${i} is missing required field "id" — results may be incomplete`
      );
    }
    if (typeof item.input !== "object" || item.input === null) {
      console.warn(
        `loadDataset: case at index ${i} is missing required field "input" — results may be incomplete`
      );
    }
    if (typeof item.expected !== "object" || item.expected === null) {
      console.warn(
        `loadDataset: case at index ${i} is missing required field "expected" — results may be incomplete`
      );
    }
  }

  return parsed as DatasetCase[];
}
