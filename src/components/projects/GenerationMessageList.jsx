"use client";

import { Pause, Play, Volume2 } from "lucide-react";
import { useId, useRef, useState } from "react";
import { AUDIO_VOICE_OPTIONS } from "@/data/voices";
import { Response } from "@/components/ai-elements/response";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ALLOWED_RESOLUTIONS, DEFAULT_RESOLUTION } from "@/app/api/chat/videoSchema";
import {
  DEFAULT_VIDEO_STATUS_MESSAGE,
  VIDEO_TOOL_STATUS_MESSAGES,
  collectVideoToolParts,
  deriveVideoPlan,
  deriveVideoToolState,
  extractTextContent,
} from "./videoToolUtils";
import { useProjectChat } from "./ChatProvider";

const REQUIRED_TOOL_FIELDS = ["audioUrl", "imageUrl"];
const IMAGE_ASPECT_RATIO_OPTIONS = [
  "1:1",
  "3:2",
  "2:3",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "9:16",
  "16:9",
  "21:9",
];
const IMAGE_OUTPUT_FORMAT_OPTIONS = ["png", "jpeg"];
// Voice options are now imported from @/data/voices
const FORM_SUBMISSION_IMAGE_PROMPT = "FORM_SUBMISSION::image-prompt";
const FORM_SUBMISSION_AUDIO_PROMPT = "FORM_SUBMISSION::audio-prompt";

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

function AudioPromptInlineForm() {
  const { sendMessage, status } = useProjectChat();
  const baseId = useId();
  const [formState, setFormState] = useState({
    script: "",
    voice: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const audioRef = useRef(null);
  const [previewingVoice, setPreviewingVoice] = useState(null);

  const isStreaming = status === "streaming";
  const scriptMissing = typeof formState.script !== "string" || formState.script.trim() === "";
  const voiceMissing = typeof formState.voice !== "string" || formState.voice.trim() === "";
  const canSubmit = !(isStreaming || isSubmitting || scriptMissing || voiceMissing);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormState((previous) => ({ ...previous, [field]: value }));
  };

  const stopPreview = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    setPreviewingVoice(null);
  };

  const handleVoiceSelect = (value) => {
    stopPreview();
    setFormState((previous) => ({ ...previous, voice: value }));
  };

  const togglePreview = (option) => {
    const audio = audioRef.current;
    if (!audio || !option?.previewUrl) {
      return;
    }

    if (previewingVoice === option.value && !audio.paused) {
      stopPreview();
      return;
    }

    stopPreview();
    audio.src = option.previewUrl;
    audio
      .play()
      .then(() => {
        setPreviewingVoice(option.value);
      })
      .catch(() => {
        setPreviewingVoice(null);
      });
  };

  const handlePreviewClick = (event, option) => {
    event.preventDefault();
    event.stopPropagation();
    togglePreview(option);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);

    const trimmedScript = formState.script.trim();
    const trimmedVoice = formState.voice.trim();

    const payload = {
      script: trimmedScript,
      voice: trimmedVoice,
    };

    const message = `${FORM_SUBMISSION_AUDIO_PROMPT}\n${JSON.stringify(payload)}`;

    try {
      await sendMessage({
        parts: [{ type: "text", text: message }],
      });
      stopPreview();
      setFormState({ script: "", voice: trimmedVoice });
    } catch (error) {
      requestAnimationFrame(() => {
        throw error;
      });
    } finally {
      setIsSubmitting(false);
    }
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
      <p className="font-medium text-primary text-xs">Share the audio details and I’ll handle the rest.</p>
      <div className="space-y-2">
        <div className="space-y-1">
          <label
            className={cn(
              "block",
              "font-semibold",
              "text-muted-foreground",
              "text-xs",
              "tracking-wide",
              "uppercase",
            )}
            htmlFor={`${baseId}-script`}
          >
            Script<span className="text-destructive">*</span>
          </label>
          <textarea
            className={cn(...TEXT_INPUT_CLASSES, "min-h-[96px]")}
            id={`${baseId}-script`}
            onChange={handleChange("script")}
            placeholder="Provide the narration or lines for the audio"
            value={formState.script}
          />
        </div>
        <div className="space-y-1">
          <label
            className={cn(
              "block",
              "font-semibold",
              "text-muted-foreground",
              "text-xs",
              "tracking-wide",
              "uppercase",
            )}
            htmlFor={`${baseId}-voice`}
          >
            Voice<span className="text-destructive">*</span>
          </label>
          <div aria-labelledby={`${baseId}-voice`} className="space-y-2" role="radiogroup">
            {AUDIO_VOICE_OPTIONS.map((option) => {
              const isSelected = formState.voice === option.value;
              const isPlaying = previewingVoice === option.value;

              return (
                <label
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-md border px-3 py-2 transition focus-within:ring-2 focus-within:ring-primary",
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-muted-foreground/40 hover:border-primary/60",
                  )}
                  htmlFor={`${baseId}-voice-${option.value}`}
                  key={option.value}
                >
                  <div className="flex items-center gap-3">
                    <input
                      checked={isSelected}
                      className="sr-only"
                      id={`${baseId}-voice-${option.value}`}
                      name={`${baseId}-voice`}
                      onChange={() => handleVoiceSelect(option.value)}
                      type="radio"
                      value={option.value}
                    />
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-background text-primary">
                      <Volume2 className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium text-foreground">{option.label}</p>
                        {option.gender ? (
                          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {option.gender}
                          </span>
                        ) : null}
                      </div>
                      {option.description ? (
                        <p className="text-xs leading-snug text-muted-foreground">{option.description}</p>
                      ) : null}
                    </div>
                  </div>
                  <button
                    aria-label={`${isPlaying ? "Pause" : "Play"} ${option.label} preview`}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full border transition",
                      isPlaying
                        ? "border-primary bg-primary text-background"
                        : "border-primary/40 text-primary hover:border-primary hover:bg-primary/10",
                    )}
                    onClick={(event) => handlePreviewClick(event, option)}
                    type="button"
                  >
                    {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                  </button>
                </label>
              );
            })}
          </div>
          <audio
            aria-hidden
            onEnded={stopPreview}
            onPause={() => setPreviewingVoice(null)}
            preload="none"
            ref={audioRef}
          >
            <track kind="captions" />
          </audio>
        </div>
      </div>
      <Button className="w-full" disabled={!canSubmit} size="sm" type="submit" variant="default">
        {isSubmitting ? "Sent" : "Send"}
      </Button>
    </form>
  );
}

function ImagePromptInlineForm() {
  const { sendMessage, status } = useProjectChat();
  const baseId = useId();
  const [formState, setFormState] = useState({
    prompt: "",
    aspectRatio: "",
    outputFormat: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isStreaming = status === "streaming";
  const promptMissing = typeof formState.prompt !== "string" || formState.prompt.trim() === "";
  const canSubmit = !(isStreaming || isSubmitting || promptMissing);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormState((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      prompt: formState.prompt.trim(),
    };

    if (typeof formState.aspectRatio === "string" && formState.aspectRatio.trim() !== "") {
      payload.aspect_ratio = formState.aspectRatio.trim();
    }

    if (typeof formState.outputFormat === "string" && formState.outputFormat.trim() !== "") {
      payload.output_format = formState.outputFormat.trim();
    }

    const message = `${FORM_SUBMISSION_IMAGE_PROMPT}\n${JSON.stringify(payload)}`;

    try {
      await sendMessage({
        parts: [{ type: "text", text: message }],
      });
      setFormState({ prompt: "", aspectRatio: "", outputFormat: "" });
    } catch (error) {
      requestAnimationFrame(() => {
        throw error;
      });
    } finally {
      setIsSubmitting(false);
    }
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
        Share the image details here and I’ll pass them along.
      </p>
      <div className="space-y-2">
        <div className="space-y-1">
          <label
            className={cn(
              "block",
              "font-semibold",
              "text-muted-foreground",
              "text-xs",
              "tracking-wide",
              "uppercase",
            )}
            htmlFor={`${baseId}-prompt`}
          >
            Prompt<span className="text-destructive">*</span>
          </label>
          <textarea
            className={cn(...TEXT_INPUT_CLASSES, "min-h-[96px]")}
            id={`${baseId}-prompt`}
            onChange={handleChange("prompt")}
            placeholder="Describe the image you want to generate"
            value={formState.prompt}
          />
        </div>
        <div className="space-y-1">
          <label
            className={cn(
              "block",
              "font-semibold",
              "text-muted-foreground",
              "text-xs",
              "tracking-wide",
              "uppercase",
            )}
            htmlFor={`${baseId}-aspectRatio`}
          >
            Aspect ratio (optional)
          </label>
          <select
            className={cn(...TEXT_INPUT_CLASSES)}
            id={`${baseId}-aspectRatio`}
            onChange={handleChange("aspectRatio")}
            value={formState.aspectRatio}
          >
            <option value="">Select aspect ratio</option>
            {IMAGE_ASPECT_RATIO_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label
            className={cn(
              "block",
              "font-semibold",
              "text-muted-foreground",
              "text-xs",
              "tracking-wide",
              "uppercase",
            )}
            htmlFor={`${baseId}-outputFormat`}
          >
            Output format (optional)
          </label>
          <select
            className={cn(...TEXT_INPUT_CLASSES)}
            id={`${baseId}-outputFormat`}
            onChange={handleChange("outputFormat")}
            value={formState.outputFormat}
          >
            <option value="">Select format</option>
            {IMAGE_OUTPUT_FORMAT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button className="w-full" disabled={!canSubmit} size="sm" type="submit" variant="default">
        {isSubmitting ? "Sent" : "Send"}
      </Button>
    </form>
  );
}

function buildImageRequestBubble(messageId, request) {
  const pretty = JSON.stringify(request, null, 2);

  return (
    <div className="flex justify-start" key={`${messageId}-image-request`}>
      <div
        className={cn(
          "bg-muted",
          "max-w-[85%]",
          "px-3",
          "py-2",
          "rounded-lg",
          "shadow-sm",
          "text-foreground",
          "text-sm",
        )}
      >
        <p
          className={cn(
            "font-semibold",
            "text-muted-foreground",
            "text-xs",
            "tracking-wide",
            "uppercase",
          )}
        >
          Image request object
        </p>
        <pre
          className={cn(
            "break-words",
            "font-mono",
            "leading-5",
            "mt-2",
            "text-foreground",
            "text-xs",
            "whitespace-pre-wrap",
          )}
        >
          {pretty}
        </pre>
      </div>
    </div>
  );
}

function buildImagePromptFormBubble({ messageId }) {
  return (
    <div className="flex justify-start" key={`${messageId}-image-prompt-form`}>
      <div className="max-w-[85%]">
        <ImagePromptInlineForm />
      </div>
    </div>
  );
}

function buildAudioRequestBubble(messageId, request) {
  const pretty = JSON.stringify(request, null, 2);

  return (
    <div className="flex justify-start" key={`${messageId}-audio-request`}>
      <div
        className={cn(
          "bg-muted",
          "max-w-[85%]",
          "px-3",
          "py-2",
          "rounded-lg",
          "shadow-sm",
          "text-foreground",
          "text-sm",
        )}
      >
        <p
          className={cn(
            "font-semibold",
            "text-muted-foreground",
            "text-xs",
            "tracking-wide",
            "uppercase",
          )}
        >
          Audio request object
        </p>
        <pre
          className={cn(
            "break-words",
            "font-mono",
            "leading-5",
            "mt-2",
            "text-foreground",
            "text-xs",
            "whitespace-pre-wrap",
          )}
        >
          {pretty}
        </pre>
      </div>
    </div>
  );
}

function buildAudioPromptFormBubble({ messageId }) {
  return (
    <div className="flex justify-start" key={`${messageId}-audio-prompt-form`}>
      <div className="max-w-[85%]">
        <AudioPromptInlineForm />
      </div>
    </div>
  );
}

function buildVideoPlanBubble(messageId, plan) {
  const displayPlan =
    plan && typeof plan === "object"
      ? (({ missingFields: _ignored, ...rest }) => rest)(plan)
      : plan;
  const pretty = JSON.stringify(displayPlan, null, 2);

  return (
    <div className="flex justify-start" key={`${messageId}-video-plan`}>
      <div
        className={cn(
          "bg-muted",
          "max-w-[85%]",
          "px-3",
          "py-2",
          "rounded-lg",
          "shadow-sm",
          "text-foreground",
          "text-sm",
        )}
      >
        <p
          className={cn(
            "font-semibold",
            "text-muted-foreground",
            "text-xs",
            "tracking-wide",
            "uppercase",
          )}
        >
          Video request object
        </p>
        <pre
          className={cn(
            "break-words",
            "font-mono",
            "leading-5",
            "mt-2",
            "text-foreground",
            "text-xs",
            "whitespace-pre-wrap",
          )}
        >
          {pretty}
        </pre>
      </div>
    </div>
  );
}

function isFormSubmissionMessage(content) {
  return typeof content === "string" && content.startsWith("FORM_SUBMISSION::");
}

function parseFormSubmissionMessage(content) {
  if (!isFormSubmissionMessage(content)) {
    return null;
  }

  const newlineIndex = content.indexOf("\n");
  if (newlineIndex === -1) {
    return null;
  }

  const payloadText = content.slice(newlineIndex + 1).trim();
  if (!payloadText) {
    return null;
  }

  try {
    return JSON.parse(payloadText);
  } catch (error) {
    requestAnimationFrame(() => {
      throw error;
    });
    return null;
  }
}

function resolveAssistantContent({ content, isUser, toolState }) {
  if (isUser) {
    if (isFormSubmissionMessage(content)) {
      return "";
    }
    return content;
  }

  if (content) {
    return content;
  }

  if (toolState) {
    if (toolState in VIDEO_TOOL_STATUS_MESSAGES) {
      return VIDEO_TOOL_STATUS_MESSAGES[toolState];
    }

    if (toolState === "output-available" || toolState === "result") {
      return "";
    }

    return DEFAULT_VIDEO_STATUS_MESSAGE;
  }

  return content;
}

function parseImageRequest(content) {
  if (typeof content !== "string") {
    return null;
  }

  const trimmed = content.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object" && typeof parsed.prompt === "string") {
      const prompt = parsed.prompt.trim();
      if (!prompt) {
        return null;
      }
      const result = { prompt };
      if (typeof parsed.aspect_ratio === "string" && parsed.aspect_ratio.trim() !== "") {
        result.aspect_ratio = parsed.aspect_ratio.trim();
      }
      if (typeof parsed.output_format === "string" && parsed.output_format.trim() !== "") {
        result.output_format = parsed.output_format.trim();
      }
      return result;
    }
  } catch (error) {
    requestAnimationFrame(() => {
      throw error;
    });
  }

  return null;
}

function parseAudioRequest(content) {
  if (typeof content !== "string") {
    return null;
  }

  const trimmed = content.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object" && typeof parsed.script === "string" && typeof parsed.voice === "string") {
      const script = parsed.script.trim();
      const voice = parsed.voice.trim();
      if (!script || !voice) {
        return null;
      }
      return { script, voice };
    }
  } catch (error) {
    requestAnimationFrame(() => {
      throw error;
    });
  }

  return null;
}

function shouldShowImagePromptForm(content) {
  if (typeof content !== "string") {
    return false;
  }

  const normalized = content.toLowerCase();
  if (normalized.includes("share the prompt")) {
    return true;
  }
  if (normalized.includes("provide the prompt")) {
    return true;
  }
  if (normalized.includes("image prompt") && normalized.includes("prompt")) {
    return true;
  }

  return false;
}

function shouldShowAudioPromptForm(content) {
  if (typeof content !== "string") {
    return false;
  }

  const normalized = content.toLowerCase();
  if (normalized.includes("share the script")) {
    return true;
  }
  if (normalized.includes("provide the script")) {
    return true;
  }
  if (normalized.includes("audio script")) {
    return true;
  }
  if (normalized.includes("audio prompt") && normalized.includes("voice")) {
    return true;
  }
  if (normalized.includes("please provide") && normalized.includes("script") && normalized.includes("voice")) {
    return true;
  }
  if (normalized.includes("narration script") && normalized.includes("desired voice")) {
    return true;
  }
  if (normalized.includes("once i have both") && normalized.includes("voice")) {
    return true;
  }

  return false;
}

export function GenerationMessageList({ messages }) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return null;
  }

  let lastImagePromptSubmission = null;
  let lastAudioPromptSubmission = null;

  return messages.flatMap((message) => {
    const isUser = message.role === "user";
    const bubbles = [];

    const rawContent = extractTextContent(message);

    if (isUser && isFormSubmissionMessage(rawContent)) {
      if (rawContent.startsWith(FORM_SUBMISSION_IMAGE_PROMPT)) {
        lastImagePromptSubmission = parseFormSubmissionMessage(rawContent);
      } else if (rawContent.startsWith(FORM_SUBMISSION_AUDIO_PROMPT)) {
        lastAudioPromptSubmission = parseFormSubmissionMessage(rawContent);
      }
      return bubbles;
    }

    if (isUser) {
      lastImagePromptSubmission = null;
      lastAudioPromptSubmission = null;
    }

    let content = rawContent;
    const videoToolParts = isUser ? [] : collectVideoToolParts(message);
    const videoPlan = isUser ? null : deriveVideoPlan(videoToolParts);
    const toolState = isUser ? null : deriveVideoToolState(videoToolParts);

    content = resolveAssistantContent({ content, isUser, toolState });

    const originalContent = content;
    let imageRequest = null;
    let audioRequest = null;

    if (!isUser) {
      audioRequest = parseAudioRequest(content);
      if (audioRequest) {
        const submissionScript = lastAudioPromptSubmission?.script;
        if (typeof submissionScript === "string") {
          const trimmedSubmissionScript = submissionScript.trim();
          if (trimmedSubmissionScript && trimmedSubmissionScript === audioRequest.script) {
            if (
              !audioRequest.voice &&
              typeof lastAudioPromptSubmission?.voice === "string" &&
              lastAudioPromptSubmission.voice.trim() !== ""
            ) {
              audioRequest.voice = lastAudioPromptSubmission.voice.trim();
            }
          }
        }
        lastAudioPromptSubmission = null;
        content = "";
      } else {
        imageRequest = parseImageRequest(content);
        if (imageRequest) {
          const submissionPrompt = lastImagePromptSubmission?.prompt;
          if (typeof submissionPrompt === "string") {
            const trimmedSubmissionPrompt = submissionPrompt.trim();
            if (trimmedSubmissionPrompt && trimmedSubmissionPrompt === imageRequest.prompt) {
              if (
                !imageRequest.aspect_ratio &&
                typeof lastImagePromptSubmission?.aspect_ratio === "string" &&
                lastImagePromptSubmission.aspect_ratio.trim() !== ""
              ) {
                imageRequest.aspect_ratio = lastImagePromptSubmission.aspect_ratio.trim();
              }
              if (
                !imageRequest.output_format &&
                typeof lastImagePromptSubmission?.output_format === "string" &&
                lastImagePromptSubmission.output_format.trim() !== ""
              ) {
                imageRequest.output_format = lastImagePromptSubmission.output_format.trim();
              }
            }
          }
          lastImagePromptSubmission = null;
          content = "";
        }
      }
    }

    if (content) {
      bubbles.push(buildTextBubble(message.id, content, isUser));
    }

    if (!isUser && shouldShowAudioPromptForm(originalContent) && !audioRequest) {
      bubbles.push(buildAudioPromptFormBubble({ messageId: message.id }));
    }

    if (!isUser && shouldShowImagePromptForm(originalContent) && !imageRequest) {
      bubbles.push(buildImagePromptFormBubble({ messageId: message.id }));
    }

    if (!isUser && audioRequest) {
      bubbles.push(buildAudioRequestBubble(message.id, audioRequest));
    }

    if (!isUser && imageRequest) {
      bubbles.push(buildImageRequestBubble(message.id, imageRequest));
    }

    if (!isUser && videoPlan) {
      bubbles.push(buildVideoPlanBubble(message.id, videoPlan));
      maybePromptForMissingFields({
        bubbles,
        message,
        videoPlan,
      });
    }

    return bubbles;
  });
}

function maybePromptForMissingFields({ videoPlan, message, bubbles }) {
  const planMissingFields = Array.isArray(videoPlan?.missingFields)
    ? videoPlan.missingFields
    : [];
  const derivedMissingFields = REQUIRED_TOOL_FIELDS.filter(
    (field) => videoPlan?.[field] == null || videoPlan?.[field] === "",
  );
  const missing = Array.from(new Set([...planMissingFields, ...derivedMissingFields]));
  const hasMissingRequired = missing.length > 0;

  if (!hasMissingRequired) {
    return;
  }

  const missingList = missing.join(" and ");
  bubbles.push(
    buildTextBubble(
      `${message.id}-missing-input`,
      `I still need the ${missingList}. Please share the ${missingList} URLs to continue.`,
      false,
    ),
  );
  bubbles.push(buildMissingFieldFormBubble({ messageId: message.id, missingFields: missing, plan: videoPlan }));
}

function buildMissingFieldFormBubble({ messageId, missingFields, plan }) {
  return (
    <div className="flex justify-start" key={`${messageId}-missing-input-form`}>
      <div className="max-w-[85%]">
        <MissingFieldInlineForm fields={missingFields} plan={plan} />
      </div>
    </div>
  );
}

const FIELD_PLACEHOLDERS = {
  audioUrl: "https://example.com/voiceover.mp3",
  imageUrl: "https://example.com/thumbnail.jpg",
};

const RESOLUTION_OPTIONS = ALLOWED_RESOLUTIONS;
const TEXT_INPUT_CLASSES = [
  "bg-background",
  "border",
  "border-input",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-primary",
  "px-3",
  "py-2",
  "rounded-md",
  "shadow-sm",
  "text-foreground",
  "text-sm",
  "w-full",
];

function MissingFieldInlineForm({ fields, plan }) {
  const { sendMessage, status } = useProjectChat();
  const baseId = useId();
  const [formState, setFormState] = useState(() => ({
    title: plan?.title ?? "",
    description: plan?.description ?? "",
    resolution: RESOLUTION_OPTIONS.includes(plan?.resolution)
      ? plan.resolution
      : DEFAULT_RESOLUTION,
    audioUrl: plan?.audioUrl ?? "",
    imageUrl: plan?.imageUrl ?? "",
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isStreaming = status === "streaming";
  const requiresAudio = fields.includes("audioUrl");
  const requiresImage = fields.includes("imageUrl");

  const requiredFields = [];
  if (requiresAudio) {
    requiredFields.push("audioUrl");
  }
  if (requiresImage) {
    requiredFields.push("imageUrl");
  }

  const isMissingRequired = requiredFields.some((field) => {
    const value = formState[field];
    if (typeof value !== "string") {
      return true;
    }
    return value.trim() === "";
  });
  const canSubmit = !(isStreaming || isSubmitting || isMissingRequired);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormState((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    const payloadObject = {
      type: "video-request",
      title: formState.title.trim(),
      description: formState.description.trim(),
      resolution: formState.resolution,
      audioUrl: formState.audioUrl.trim(),
      imageUrl: formState.imageUrl.trim(),
    };

    const message = `FORM_SUBMISSION::missing-field-inline-form\n${JSON.stringify(payloadObject)}`;

    try {
      await sendMessage({
        parts: [{ type: "text", text: message }],
      });
    } catch (error) {
      requestAnimationFrame(() => {
        throw error;
      });
    } finally {
      setIsSubmitting(false);
    }
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
        Fill in the details below and I’ll craft the video plan for you.
      </p>
      <div className="space-y-2">
        <div className="space-y-1">
          <label
            className={cn(
              "block",
              "font-semibold",
              "text-muted-foreground",
              "text-xs",
              "tracking-wide",
              "uppercase",
            )}
            htmlFor={`${baseId}-title`}
          >
            Title (optional)
          </label>
          <input
            className={cn(...TEXT_INPUT_CLASSES)}
            id={`${baseId}-title`}
            onChange={handleChange("title")}
            placeholder="Give the video a short name"
            type="text"
            value={formState.title}
          />
        </div>
        <div className="space-y-1">
          <label
            className={cn(
              "block",
              "font-semibold",
              "text-muted-foreground",
              "text-xs",
              "tracking-wide",
              "uppercase",
            )}
            htmlFor={`${baseId}-description`}
          >
            Description (optional)
          </label>
          <textarea
            className={cn(...TEXT_INPUT_CLASSES, "min-h-[96px]")}
            id={`${baseId}-description`}
            onChange={handleChange("description")}
            placeholder="Describe what should happen in the video"
            value={formState.description}
          />
        </div>
        <div className="space-y-1">
          <span
            className={cn(
              "block",
              "font-semibold",
              "text-muted-foreground",
              "text-xs",
              "tracking-wide",
              "uppercase",
            )}
          >
            Resolution (optional)
          </span>
          <div className="flex gap-2">
            {RESOLUTION_OPTIONS.map((option) => {
              const isActive = formState.resolution === option;
              return (
                <label
                  className={cn(
                    "flex",
                    "flex-1",
                    "cursor-pointer",
                    "items-center",
                    "justify-center",
                    "rounded-md",
                    "border",
                    "px-3",
                    "py-2",
                    "text-sm",
                    "font-medium",
                    "transition",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted-foreground/40 text-muted-foreground hover:border-primary/60 hover:text-primary",
                  )}
                  htmlFor={`${baseId}-resolution-${option}`}
                  key={option}
                >
                  <input
                    checked={isActive}
                    className="sr-only"
                    id={`${baseId}-resolution-${option}`}
                    name={`${baseId}-resolution`}
                    onChange={() =>
                      setFormState((previous) => ({
                        ...previous,
                        resolution: option,
                      }))
                    }
                    type="radio"
                    value={option}
                  />
                  {option}p
                </label>
              );
            })}
          </div>
        </div>
        <div className="space-y-1">
          <label
            className={cn(
              "block",
              "font-semibold",
              "text-muted-foreground",
              "text-xs",
              "tracking-wide",
              "uppercase",
            )}
            htmlFor={`${baseId}-audioUrl`}
          >
            Audio URL{requiresAudio ? <span className="text-destructive">*</span> : null}
          </label>
          <input
            className={cn(...TEXT_INPUT_CLASSES)}
            id={`${baseId}-audioUrl`}
            onChange={handleChange("audioUrl")}
            placeholder={FIELD_PLACEHOLDERS.audioUrl}
            type="url"
            value={formState.audioUrl}
          />
        </div>
        <div className="space-y-1">
          <label
            className={cn(
              "block",
              "font-semibold",
              "text-muted-foreground",
              "text-xs",
              "tracking-wide",
              "uppercase",
            )}
            htmlFor={`${baseId}-imageUrl`}
          >
            Image URL{requiresImage ? <span className="text-destructive">*</span> : null}
          </label>
          <input
            className={cn(...TEXT_INPUT_CLASSES)}
            id={`${baseId}-imageUrl`}
            onChange={handleChange("imageUrl")}
            placeholder={FIELD_PLACEHOLDERS.imageUrl}
            type="url"
            value={formState.imageUrl}
          />
        </div>
      </div>
      <Button
        className="w-full"
        disabled={!canSubmit}
        size="sm"
        type="submit"
        variant="default"
      >
        {isSubmitting ? "Sent" : "Send"}
      </Button>
    </form>
  );
}
