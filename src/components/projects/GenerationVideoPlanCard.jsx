"use client";

import { cn } from "@/lib/utils";

export function GenerationVideoPlanCard({ plan, className }) {
  if (!plan) {
    return null;
  }

  const {
    audioUrl,
    imageUrl,
    prompt,
    resolution,
    missingFields = [],
    title,
    description,
  } = plan;

  const hasMissingFields =
    Array.isArray(missingFields) && missingFields.length > 0;

  return (
    <div
      className={cn(
        "space-y-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-foreground text-sm shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground leading-tight">
            Video request summary
          </p>
          {title && (
            <p className="mt-1 font-medium text-primary text-sm">{title}</p>
          )}
        </div>
        {resolution && (
          <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-xs uppercase tracking-wide">
            {resolution}p
          </span>
        )}
      </div>

      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}

      {prompt && (
        <div className="rounded-md bg-background/40 px-3 py-2">
          <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
            Prompt
          </p>
          <p className="mt-1 whitespace-pre-wrap text-foreground text-sm">
            {prompt}
          </p>
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <MediaField
          label="Audio URL"
          missing={hasMissingFields && missingFields.includes("audioUrl")}
          value={audioUrl}
        />
        <MediaField
          label="Image URL"
          missing={hasMissingFields && missingFields.includes("imageUrl")}
          value={imageUrl}
        />
      </div>

      {hasMissingFields && (
        <div className="rounded-md border border-primary/40 border-dashed bg-primary/5 px-3 py-2">
          <p className="font-semibold text-primary text-xs uppercase tracking-wide">
            Missing details
          </p>
          <p className="mt-1 text-primary text-sm">
            Jaznan needs the following before finalizing:{" "}
            {missingFields.join(", ")}. Please share them in the chat.
          </p>
        </div>
      )}
    </div>
  );
}

function MediaField({ label, value, missing }) {
  const baseClasses = "border px-3 py-2 rounded-md text-sm";

  if (!value) {
    return (
      <div
        className={cn(
          baseClasses,
          missing
            ? "border-primary/60 border-dashed bg-transparent text-primary"
            : "border-muted-foreground/20 text-muted-foreground"
        )}
      >
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          {label}
        </p>
        <p className="mt-1 text-sm">
          {missing ? "Waiting for URL" : "Not provided"}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, "border-muted-foreground/20 bg-background/60")}
    >
      <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </p>
      <a
        className="mt-1 break-all text-primary text-sm underline-offset-2 hover:underline"
        href={value}
        rel="noreferrer"
        target="_blank"
      >
        {value}
      </a>
    </div>
  );
}
