import { z } from "zod";

const MIN_TITLE_LENGTH = 3;
const MIN_DESCRIPTION_LENGTH = 10;
const DEFAULT_RESOLUTION = "720";
const ALLOWED_RESOLUTIONS = ["480", "720"];

export const videoRequestSchema = z.object({
  type: z.literal("video-request").default("video-request"),
  title: z.string().min(MIN_TITLE_LENGTH, "Provide a short title for the video."),
  description: z
    .string()
    .min(MIN_DESCRIPTION_LENGTH, "Describe what the video should cover."),
  prompt: z.string().optional(),
  resolution: z.enum(ALLOWED_RESOLUTIONS).default(DEFAULT_RESOLUTION),
  audioUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  missingFields: z.array(z.enum(["audioUrl", "imageUrl"])).default([]),
});
