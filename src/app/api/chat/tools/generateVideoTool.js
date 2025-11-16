import { tool } from "ai";
import { videoRequestSchema } from "../videoSchema";

const GENERATE_VIDEO_TOOL_NAME = "generateVideoPlan";

export const generateVideoTool = tool({
  name: GENERATE_VIDEO_TOOL_NAME,
  description:
    "Create or update a video request payload when the user asks to generate a video.",
  inputSchema: videoRequestSchema,
  execute: async (payload) => payload,
});

export { GENERATE_VIDEO_TOOL_NAME };
