"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GenerationVideoResourceCard } from "@/components/projects/GenerationVideoResourceCard";
import { demoVideoResources } from "@/data/demoResources";

export function VideoResourcesView({ projectId }) {
  const [activeVideo, setActiveVideo] = useState(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  const handleSelect = (video) => {
    setActiveVideo(video);
    setIsVideoDialogOpen(true);
  };

  const handleDialogChange = (open) => {
    setIsVideoDialogOpen(open);
    if (!open) {
      setActiveVideo(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/50 p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 rounded-xl border bg-background p-4 md:p-6">
        <header className="grid w-full grid-cols-1 items-center gap-3 sm:grid-cols-[auto_1fr_auto]">
          <Button asChild className="justify-self-start" size="sm" variant="ghost">
            <Link href={`/project/${projectId}`}>
              <ArrowLeft className="mr-2 size-4" />
              Back to generation
            </Link>
          </Button>
          <h1 className="text-center text-xl font-semibold md:text-2xl">
            Video resources
          </h1>
          <span className="justify-self-end text-sm text-muted-foreground">
            {demoVideoResources.length} curated clips
          </span>
        </header>

        <section className="grid grid-cols-1 gap-4 items-start sm:grid-cols-2 xl:grid-cols-3">
          {demoVideoResources.map((item) => (
            <GenerationVideoResourceCard key={item.id} item={item} onSelect={handleSelect} />
          ))}
        </section>
      </div>

      <Dialog onOpenChange={handleDialogChange} open={isVideoDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{activeVideo?.title ?? "Preview video"}</DialogTitle>
            {activeVideo?.description ? (
              <DialogDescription>{activeVideo.description}</DialogDescription>
            ) : null}
          </DialogHeader>
          {activeVideo ? (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
                {activeVideo.resolution ? (
                  <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 font-medium text-foreground text-xs">
                    {activeVideo.resolution}
                  </span>
                ) : null}
                {activeVideo.duration ? (
                  <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 font-medium text-foreground text-xs">
                    {activeVideo.duration}
                  </span>
                ) : null}
              </div>
              <video
                className="aspect-video w-full overflow-hidden rounded-xl border border-muted bg-black"
                controls
                poster={activeVideo.thumbnail}
                preload="metadata"
                src={activeVideo.videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
