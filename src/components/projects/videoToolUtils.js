import { GENERATE_VIDEO_TOOL_NAME } from "@/constants/aiTools";

export const VIDEO_TOOL_PART_TYPE = `tool-${GENERATE_VIDEO_TOOL_NAME}`;

export const VIDEO_TOOL_STATUS_MESSAGES = {
  "input-streaming": "Jaznan is cooking structured data...",
  "input-available": "Jaznan is reviewing the ingredients...",
  "output-streaming": "Jaznan is finishing the video brief...",
  "output-pending": "Jaznan is finishing the video brief...",
  "output-error": "Jaznan hit a snag while preparing the video brief.",
};

export const DEFAULT_VIDEO_STATUS_MESSAGE = "Jaznan is cooking structured data...";

export function extractTextContent(message) {
  if (Array.isArray(message?.parts)) {
    return message.parts
      .filter((part) => part?.type === "text" && typeof part.text === "string")
      .map((part) => part.text)
      .join("");
  }

  if (typeof message?.content === "string") {
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

export function collectVideoToolParts(message) {
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

export function deriveVideoToolState(parts) {
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

export function deriveVideoPlan(parts) {
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

export function findLatestVideoPlan(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return null;
  }

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];

    if (message?.role !== "assistant") {
      continue;
    }

    const parts = collectVideoToolParts(message);
    const plan = deriveVideoPlan(parts);

    if (plan) {
      return { messageId: message.id ?? `message-${index}`, plan };
    }
  }

  return null;
}
