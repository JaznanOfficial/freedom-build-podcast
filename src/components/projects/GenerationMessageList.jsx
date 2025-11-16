"use client";

import { Response } from "@/components/ai-elements/response";
import { GENERATE_VIDEO_TOOL_NAME } from "@/constants/aiTools";
import { GenerationVideoPlanCard } from "./GenerationVideoPlanCard";

const VIDEO_TOOL_PART_TYPE = `tool-${GENERATE_VIDEO_TOOL_NAME}`;
const VIDEO_TOOL_STATUS_MESSAGES = {
  "input-streaming": "Jaznan is cooking structured data...",
  "input-available": "Jaznan is reviewing the ingredients...",
  "output-streaming": "Jaznan is finishing the video brief...",
  "output-pending": "Jaznan is finishing the video brief...",
  "output-error": "Jaznan hit a snag while preparing the video brief.",
};
const DEFAULT_VIDEO_STATUS_MESSAGE = "Jaznan is cooking structured data...";

function extractTextContent(message) {
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((part) => part?.type === "text" && typeof part.text === "string")
      .map((part) => part.text)
      .join("");
  }

  if (typeof message.content === "string") {
    return message.content;
  }

  return "";
}

function visitParts(node, callback) {
  if (!node) {
    return;
  }

  if (Array.isArray(node)) {
    for (const child of node) {
      visitParts(child, callback);
    }
    return;
  }

  if (typeof node === "object") {
    callback(node);

    if (Array.isArray(node.parts)) {
      visitParts(node.parts, callback);
    }
  }
}

function collectVideoToolParts(message) {
  const parts = [];

  visitParts(message?.parts, (part) => {
    if (!part?.type) {
      return;
    }

    if (
      part.type === VIDEO_TOOL_PART_TYPE ||
      (part.type === "dynamic-tool" && part.toolName === GENERATE_VIDEO_TOOL_NAME)
    ) {
      parts.push(part);
    }
  });

  visitParts(message?.content, (part) => {
    if (!part?.type) {
      return;
    }

    if (
      part.type === VIDEO_TOOL_PART_TYPE ||
      (part.type === "dynamic-tool" && part.toolName === GENERATE_VIDEO_TOOL_NAME)
    ) {
      parts.push(part);
    }
  });

  if (Array.isArray(message?.toolInvocations)) {
    for (const invocation of message.toolInvocations) {
      if (invocation?.toolName === GENERATE_VIDEO_TOOL_NAME) {
        parts.push(invocation);
      }
    }
  }

  return parts;
}

function deriveVideoToolState(parts) {
  if (!Array.isArray(parts) || parts.length === 0) {
    return null;
  }

  const prioritizedStates = [
    "output-error",
    "output-streaming",
    "output-pending",
    "input-streaming",
    "input-available",
  ];

  for (const state of prioritizedStates) {
    const match = parts.find((part) => part?.state === state);
    if (match) {
      return match.state;
    }
  }

  const completed = parts.find((part) => part?.state === "output-available" || part?.state === "result");
  return completed?.state ?? null;
}

function deriveVideoPlan(parts) {
  if (!Array.isArray(parts)) {
    return null;
  }

  const candidates = parts.filter((part) =>
    ["output-available", "result"].includes(part?.state ?? ""),
  );

  for (const candidate of candidates) {
    if (candidate?.output && typeof candidate.output === "object") {
      return candidate.output;
    }

    if (candidate?.result && typeof candidate.result === "object") {
      return candidate.result;
    }

    if (candidate?.data && typeof candidate.data === "object") {
      return candidate.data;
    }
  }

  return null;
}

function buildTextBubble(messageId, content, isUser) {
  const alignment = isUser ? "justify-end" : "justify-start";
  const tone = isUser ? "bg-primary/10 text-primary" : "bg-muted text-foreground";

  return (
    <div className={`flex ${alignment}`} key={`${messageId}-text`}>
      <div className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${tone}`}>
        {isUser ? content : <Response>{content}</Response>}
      </div>
    </div>
  );
}

function buildVideoPlanBubble(messageId, plan) {
  return (
    <div className="flex justify-start" key={`${messageId}-video-plan`}>
      <div className="max-w-[85%]">
        <GenerationVideoPlanCard plan={plan} />
      </div>
    </div>
  );
}

function resolveAssistantContent({ content, isUser, toolState }) {
  if (isUser) {
    return content;
  }

  if (content) {
    return content;
  }

  if (toolState) {
    return VIDEO_TOOL_STATUS_MESSAGES[toolState] ?? DEFAULT_VIDEO_STATUS_MESSAGE;
  }

  return content;
}

export function GenerationMessageList({ messages }) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return null;
  }

  return messages.flatMap((message) => {
    const isUser = message.role === "user";
    const bubbles = [];

    let content = extractTextContent(message);
    const videoToolParts = isUser ? [] : collectVideoToolParts(message);
    const videoPlan = isUser ? null : deriveVideoPlan(videoToolParts);
    const toolState = isUser ? null : deriveVideoToolState(videoToolParts);

    content = resolveAssistantContent({ content, isUser, toolState });

    if (content) {
      bubbles.push(buildTextBubble(message.id, content, isUser));
    }

    if (!isUser && videoPlan) {
      bubbles.push(buildVideoPlanBubble(message.id, videoPlan));
    }

    return bubbles;
  });
}
