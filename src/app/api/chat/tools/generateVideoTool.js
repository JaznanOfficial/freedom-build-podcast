import { tool } from "ai";
import {
  DEFAULT_RESOLUTION,
  ALLOWED_RESOLUTIONS,
  videoRequestSchema,
} from "../videoSchema";

const GENERATE_VIDEO_TOOL_NAME = "generateVideoPlan";

export const generateVideoTool = tool({
  name: GENERATE_VIDEO_TOOL_NAME,
  description:
    "Create or update a video request payload when the user asks to generate a video.",
  inputSchema: videoRequestSchema,
  execute: (payload) => {
    if (!payload) {
      return null;
    }

    return {
      type: "video-request",
      title: payload.title ?? "",
      description: payload.description ?? "",
      prompt: payload.prompt ?? "",
      resolution: ALLOWED_RESOLUTIONS.includes(payload.resolution ?? "")
        ? payload.resolution
        : DEFAULT_RESOLUTION,
      audioUrl: payload.audioUrl ?? "",
      imageUrl: payload.imageUrl ?? "",
      missingFields: Array.isArray(payload.missingFields)
        ? payload.missingFields
        : [],
    };
  },
});

export { GENERATE_VIDEO_TOOL_NAME };
