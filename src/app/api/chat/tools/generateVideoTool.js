import { tool } from "ai";
import {
  DEFAULT_RESOLUTION,
  ALLOWED_RESOLUTIONS,
  videoRequestSchema,
} from "../videoSchema";

const GENERATE_VIDEO_TOOL_NAME = "generateVideoPlan";
const REQUIRED_FIELDS = ["audioUrl", "imageUrl"];

function normalize(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

export const generateVideoTool = tool({
  name: GENERATE_VIDEO_TOOL_NAME,
  description:
    "Create or update a video request payload when the user asks to generate a video.",
  inputSchema: videoRequestSchema,
  execute: (payload) => {
    if (!payload) {
      return null;
    }

    const sanitized = {
      type: "video-request",
      title: normalize(payload.title),
      description: normalize(payload.description),
      prompt: normalize(payload.prompt),
      resolution: ALLOWED_RESOLUTIONS.includes(payload.resolution ?? "")
        ? payload.resolution
        : DEFAULT_RESOLUTION,
      audioUrl: normalize(payload.audioUrl),
      imageUrl: normalize(payload.imageUrl),
    };

    const providedMissing = Array.isArray(payload.missingFields)
      ? payload.missingFields.filter((field) => REQUIRED_FIELDS.includes(field))
      : [];

    const computedMissing = REQUIRED_FIELDS.filter((field) => !sanitized[field]);

    sanitized.missingFields = Array.from(
      new Set([...providedMissing, ...computedMissing]),
    );

    return sanitized;
  },
});

export { GENERATE_VIDEO_TOOL_NAME };
