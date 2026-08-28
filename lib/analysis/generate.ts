import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { CategoryCorpus } from "../corpus/types";
import { ModelBriefSchema, type ModelBrief } from "./schema";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";

const MODEL = "claude-opus-5";

export async function generateModelBrief(
  corpus: CategoryCorpus,
  categoryLabel: string,
  audienceLabel: string,
): Promise<{ brief: ModelBrief; usage: Anthropic.Usage }> {
  const client = new Anthropic();

  // Streamed rather than a plain parse() call: a full brief needs a max_tokens
  // large enough that the SDK refuses to run it non-streaming. finalMessage()
  // still returns the schema-parsed output.
  const stream = client.messages.stream({
    model: MODEL,
    // A full six-section brief runs 12-15k output tokens; 16k left no margin
    // and a category with more competitors truncated mid-JSON, surfacing as an
    // opaque parse error rather than as the length limit it was.
    max_tokens: 32000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: zodOutputFormat(ModelBriefSchema),
    },
    // The corpus is the bulk of the request and is re-sent on every retune of
    // the prompt, so it is worth caching.
    cache_control: { type: "ephemeral" },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildUserPrompt(corpus, categoryLabel, audienceLabel),
      },
    ],
  });

  const response = await stream.finalMessage();

  if (response.stop_reason === "max_tokens") {
    throw new Error(
      "Model output hit max_tokens and was cut off mid-brief. Raise max_tokens.",
    );
  }
  if (response.stop_reason === "refusal") {
    throw new Error(
      `Model declined: ${response.stop_details?.explanation ?? "no explanation"}`,
    );
  }
  if (!response.parsed_output) {
    throw new Error(
      `Model returned no parseable output (stop_reason: ${response.stop_reason})`,
    );
  }

  return { brief: response.parsed_output, usage: response.usage };
}
