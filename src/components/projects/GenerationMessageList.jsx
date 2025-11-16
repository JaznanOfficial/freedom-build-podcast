"use client";

import { useId, useState } from "react";
import { Response } from "@/components/ai-elements/response";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DEFAULT_VIDEO_STATUS_MESSAGE,
  VIDEO_TOOL_STATUS_MESSAGES,
  collectVideoToolParts,
  deriveVideoPlan,
  deriveVideoToolState,
  extractTextContent,
  findLatestVideoPlan,
} from "./videoToolUtils";
import { GenerationVideoPlanCard } from "./GenerationVideoPlanCard";
import { useProjectChat } from "./ChatProvider";

const REQUIRED_TOOL_FIELDS = ["audioUrl", "imageUrl"];

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
      maybePromptForMissingFields({
        bubbles,
        message,
        messages,
        videoPlan,
      });
    }

    return bubbles;
  });
}

function maybePromptForMissingFields({ videoPlan, messages, message, bubbles }) {
  const missing = Array.isArray(videoPlan?.missingFields) ? videoPlan.missingFields : [];
  const hasMissingRequired = REQUIRED_TOOL_FIELDS.some(
    (field) => videoPlan?.[field] == null || videoPlan?.[field] === "",
  );

  if (!hasMissingRequired || missing.length === 0) {
    return;
  }

  const missingList = missing.join(" and ");
  const latestPlan = findLatestVideoPlan(messages);
  const alreadyPrompted = latestPlan?.messageId === message.id;

  if (alreadyPrompted) {
    return;
  }

  bubbles.push(
    buildTextBubble(
      `${message.id}-missing-input`,
      `I still need the ${missingList}. Please share the ${missingList} URLs to continue.`,
      false,
    ),
  );
  bubbles.push(buildMissingFieldFormBubble(message.id, missing));
}

function buildMissingFieldFormBubble(messageId, missingFields) {
  return (
    <div className="flex justify-start" key={`${messageId}-missing-input-form`}>
      <div className="max-w-[85%]">
        <MissingFieldInlineForm fields={missingFields} />
      </div>
    </div>
  );
}

const FIELD_LABELS = {
  audioUrl: "Audio URL",
  imageUrl: "Image URL",
};

const FIELD_PLACEHOLDERS = {
  audioUrl: "https://example.com/voiceover.mp3",
  imageUrl: "https://example.com/thumbnail.jpg",
};

function MissingFieldInlineForm({ fields }) {
  const { sendMessage, status } = useProjectChat();
  const baseId = useId();
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((field) => [field, ""])),
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isStreaming = status === "streaming";
  const allFilled = fields.every((field) => values[field]?.trim());

  const handleChange = (field) => (event) => {
    setValues((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!allFilled || isStreaming) {
      return;
    }

    const payload = fields
      .map((field) => `${field}: ${values[field].trim()}`)
      .join("\n");

    sendMessage({ parts: [{ type: "text", text: payload }] });
    setIsSubmitted(true);
  };

  return (
    <form
      className={cn(
        "bg-primary/5",
        "border",
        "border-dashed",
        "border-primary/40",
        "px-3",
        "py-3",
        "rounded-lg",
        "space-y-3",
        "text-sm",
      )}
      onSubmit={handleSubmit}
    >
      <p className="font-medium text-primary text-xs">
        Drop the missing links below and I'll slot them into the plan.
      </p>
      {fields.map((field) => (
        <div className="space-y-1" key={field}>
          <label
            className={cn(
              "block",
              "font-semibold",
              "text-muted-foreground",
              "text-xs",
              "tracking-wide",
              "uppercase",
            )}
            htmlFor={`${baseId}-${field}`}
          >
            {FIELD_LABELS[field] ?? field}
          </label>
          <input
            className={cn(
              "bg-background",
              "border",
              "border-input",
              "px-3",
              "py-2",
              "rounded-md",
              "shadow-sm",
              "text-foreground",
              "text-sm",
              "w-full",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-primary",
            )}
            onChange={handleChange(field)}
            placeholder={FIELD_PLACEHOLDERS[field] ?? "https://"}
            id={`${baseId}-${field}`}
            type="url"
            value={values[field]}
          />
        </div>
      ))}
      <Button
        className="w-full"
        disabled={isStreaming || !allFilled || isSubmitted}
        size="sm"
        type="submit"
        variant="default"
      >
        {isSubmitted ? "Submitted" : "Share URLs"}
      </Button>
    </form>
  );
}
