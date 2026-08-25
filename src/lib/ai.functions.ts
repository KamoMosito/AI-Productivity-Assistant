import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-2.5-flash";

const MessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

const InputSchema = z.object({
  messages: z.array(MessageSchema).min(1),
});

export type AiResult = { text: string; demo: boolean };

function demoResponse(prompt: string): string {
  return `⚠️ DEMO MODE — no AI service configured, this is a clearly labelled mock response.

Based on your input:
"""
${prompt.slice(-600)}
"""

A real Rooted AI response would appear here with the requested structure. Connect an AI key to enable live generation.`;
}

export const runAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<AiResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    const last = data.messages[data.messages.length - 1]?.content ?? "";

    if (!apiKey) return { text: demoResponse(last), demo: true };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({ model: MODEL, messages: data.messages }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      if (res.status === 429) {
        throw new Error("Rooted AI is busy right now (rate limit). Please wait a moment and retry.");
      }
      if (res.status === 402) {
        throw new Error("AI credits are exhausted for this workspace. Please add credits and try again.");
      }
      throw new Error(`AI request failed (${res.status}). ${body.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("Rooted AI returned an empty response. Please retry.");
    return { text, demo: false };
  });
