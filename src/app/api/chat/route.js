import { Experimental_Agent as Agent, convertToModelMessages, validateUIMessages } from "ai";
import { GENERATE_VIDEO_TOOL_NAME } from "@/constants/aiTools";
import { generateVideoTool } from "./tools/generateVideoTool";

export const maxDuration = 30;
const modelName = process.env.MODEL_NAME || "gpt-4o";

const chatAgent = new Agent({
  model: modelName,
  system: `You are Jaznan, a helpful assistant built by FreedomBuild. Keep replies concise.

When the user asks to create or update a video (including avatar or podcast videos), you MUST call the "${GENERATE_VIDEO_TOOL_NAME}" tool. Populate every field you know (title, description, resolution, audioUrl, imageUrl, prompt). For anything the user has not supplied, leave the field empty and list it in missingFields (this includes title and description as well as audioUrl and imageUrl). Only include URLs that the user provides—never fabricate them. ALWAYS provide a well-formed JSON object as the tool arguments. Example:

{
  "type": "video-request",
  "title": "",
  "description": "",
  "resolution": "720",
  "audioUrl": "",
  "imageUrl": "",
  "prompt": "",
  "missingFields": ["title", "description", "audioUrl", "imageUrl"]
}

When you receive a user message that begins with "FORM_SUBMISSION::missing-field-inline-form", treat everything after the first newline as a JSON payload supplied by the user. Parse that JSON exactly (do not add new keys) and immediately call the "${GENERATE_VIDEO_TOOL_NAME}" tool using those values. After calling the tool, reply with a concise confirmation summarising the updated plan, and include the structured object in the response so the UI can render it.

After the tool executes, ask for any missing items in a friendly tone and summarise the result briefly unless the user prefers raw JSON. For other requests, respond conversationally without calling tools.`,
  tools: {
    [GENERATE_VIDEO_TOOL_NAME]: generateVideoTool,
  },
});

export async function POST(req) {
  const body = await req.json().catch(() => null);
  const messages = Array.isArray(body?.messages) ? body.messages : [];

  if (messages.length === 0) {
    return new Response("No messages provided", { status: 400 });
  }

  const validated = await validateUIMessages({ messages });

  if (validated.length === 0) {
    return new Response("Invalid messages", { status: 400 });
  }

  const modelMessages = convertToModelMessages(validated);

  const stream = await chatAgent.stream({ messages: modelMessages });

  return stream.toUIMessageStreamResponse();
}
