import { z } from "zod";

const MIN_TITLE_LENGTH = 3;
const MIN_DESCRIPTION_LENGTH = 10;
const DEFAULT_RESOLUTION = "720";
const ALLOWED_RESOLUTIONS = ["480", "720"];

const emptyString = z.literal("");
const optionalTitle = z.union([
  z
    .string()
    .min(MIN_TITLE_LENGTH, "Provide a short title for the video."),
  emptyString,
]).optional();
const optionalDescription = z.union([
  z
    .string()
    .min(MIN_DESCRIPTION_LENGTH, "Describe what the video should cover."),
  emptyString,
]).optional();
const optionalUrl = z.union([z.string().url(), emptyString]).optional();
const optionalPrompt = z.union([z.string(), emptyString]).optional();

export const videoRequestSchema = z.object({
  type: z.literal("video-request").default("video-request"),
  title: optionalTitle,
  description: optionalDescription,
  prompt: optionalPrompt,
  resolution: z.enum(ALLOWED_RESOLUTIONS).default(DEFAULT_RESOLUTION),
  audioUrl: optionalUrl,
  imageUrl: optionalUrl,
  missingFields: z
    .array(z.enum(["title", "description", "audioUrl", "imageUrl"]))
    .default([]),
});

export { DEFAULT_RESOLUTION, ALLOWED_RESOLUTIONS };
