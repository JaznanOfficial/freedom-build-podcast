import { Experimental_Agent as Agent, convertToModelMessages, validateUIMessages } from "ai";
import { GENERATE_VIDEO_TOOL_NAME } from "@/constants/aiTools";
import { generateVideoTool } from "./tools/generateVideoTool";

export const maxDuration = 30;
const modelName = process.env.MODEL_NAME || "gpt-4o";

const chatAgent = new Agent({
  model: modelName,
  system: `You are Jaznan, a helpful assistant built by FreedomBuild. Keep replies concise.

When the user asks to create or update a video (including avatar or podcast videos), call the "${GENERATE_VIDEO_TOOL_NAME}" tool. Only include URLs that the user provides—never fabricate them. If either audioUrl or imageUrl is missing, return the request with missingFields listing what you still need and ask the user for those items in a friendly tone. After the tool executes, summarise the result briefly unless the user prefers raw JSON. For other requests, respond conversationally without calling tools.`,
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
