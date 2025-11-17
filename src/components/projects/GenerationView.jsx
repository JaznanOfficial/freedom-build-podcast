"use client";

import Link from "next/link";
import { PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { useProjectChat } from "@/components/projects/ChatProvider";
import { GenerationSidebar } from "@/components/projects/GenerationSidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GenerationAudioResourceCard } from "@/components/projects/GenerationAudioResourceCard";
import { GenerationImageResourceCard } from "@/components/projects/GenerationImageResourceCard";
import { GenerationVideoResourceCard } from "@/components/projects/GenerationVideoResourceCard";
import {
  demoAudioResources,
  demoImageResources,
  demoVideoResources,
} from "@/data/demoResources";

export function GenerationView({ projectId }) {
  useProjectChat();

  const [activeVideo, setActiveVideo] = useState(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  const audioResources = demoAudioResources;

  const handleVideoSelect = (video) => {
    setActiveVideo(video);
    setIsVideoDialogOpen(true);
  };

  const handleVideoDialogChange = (open) => {
    setIsVideoDialogOpen(open);
    if (!open) {
      setActiveVideo(null);
    }
  };

  const videoResources = demoVideoResources;

  const sections = [
    {
      id: "videos",
      title: "Videos",
      empty: "No videos yet. Ask Jaznan to craft one!",
      items: videoResources,
      href: projectId ? `/project/${projectId}/resources/videos` : undefined,
    },
    {
      id: "image-resources",
      title: "Resources for video (Image)",
      empty: "Bring your reference images here soon.",
      items: demoImageResources,
      href: projectId ? `/project/${projectId}/resources/images` : undefined,
    },
    {
      id: "audio-resources",
      title: "Resources for video (Audio)",
      empty: "Upload voiceovers or music when you're ready.",
      items: audioResources,
      href: projectId ? `/project/${projectId}/resources/audio` : undefined,
    },
  ];

  return (
    <>
      <div className="flex h-full min-h-0 flex-1 flex-col gap-4 lg:grid lg:grid-cols-[420px_1fr]">
        <GenerationSidebar className="hidden lg:block" />
        <div className="flex h-full min-h-0 flex-col">
          <div className="mb-4 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className="rounded-full bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/50 dark:hover:bg-input/50"
                  size="icon"
                  variant="outline"
                >
                  <PanelLeftOpen className="size-4" />
                  <span className="sr-only">Open panel</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                className="w-full max-w-md gap-0 p-0"
                hideClose
                side="left"
              >
                <div className="h-full overflow-auto">
                  <GenerationSidebar className="p-4" />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto rounded-lg border bg-background p-6">
              <div className="flex flex-col gap-6">
                {sections.map((section) => {
                  const items = Array.isArray(section.items)
                    ? section.items
                    : [];
                  const isAudioSection = section.id === "audio-resources";
                  const isVideoSection = section.id === "videos";
                  const isImageSection = section.id === "image-resources";
                  const hasItems = items.length > 0;
                  const showPlaceholder = !hasItems;

                  return (
                    <section
                      className="flex min-h-0 flex-col rounded-lg border border-muted bg-muted/30 p-5 shadow-sm"
                      key={section.id}
                    >
                      <header className="flex items-center justify-between">
                        <h2 className="font-semibold text-base text-foreground">
                          {section.title}
                        </h2>
                      </header>
                      {isVideoSection && hasItems ? (
                        <div className="mt-4 grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          {items.map((item) => (
                            <GenerationVideoResourceCard
                              item={item}
                              key={item.id}
                              onSelect={handleVideoSelect}
                            />
                          ))}
                        </div>
                      ) : null}
                      {isImageSection && hasItems ? (
                        <div className="mt-4 grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {items.map((item) => (
                            <GenerationImageResourceCard item={item} key={item.id} />
                          ))}
                        </div>
                      ) : null}
                      {isAudioSection && hasItems ? (
                        <div className="mt-4 grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {items.map((item) => (
                            <GenerationAudioResourceCard item={item} key={item.id} />
                          ))}
                        </div>
                      ) : null}
                      {showPlaceholder ? (
                        <div className="mt-4 flex flex-1 items-center justify-center rounded-md border border-muted-foreground/40 border-dashed bg-background/80 text-center text-muted-foreground text-sm">
                          {section.empty}
                        </div>
                      ) : null}
                      {section.href ? (
                        <Button asChild className="mt-4 w-fit" size="sm" variant="ghost">
                          <Link href={section.href}>See all</Link>
                        </Button>
                      ) : null}
                    </section>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog onOpenChange={handleVideoDialogChange} open={isVideoDialogOpen}>
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
    </>
  );
}
