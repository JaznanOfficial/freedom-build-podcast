"use client";

import { PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useProjectChat } from "@/components/projects/ChatProvider";
import { GenerationAudioResourceCard } from "@/components/projects/GenerationAudioResourceCard";
import { GenerationImageResourceCard } from "@/components/projects/GenerationImageResourceCard";
import { GenerationSidebar } from "@/components/projects/GenerationSidebar";
import { GenerationVideoResourceCard } from "@/components/projects/GenerationVideoResourceCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  demoAudioResources,
  demoImageResources,
  demoVideoResources,
} from "@/data/demoResources";

export function GenerationView({ projectId }) {
  useProjectChat();

  const MAX_RESOURCE_ITEMS = 3;

  const sections = useMemo(() => (
    [
      {
        id: "videos",
        title: "Videos",
        items: demoVideoResources,
        href: projectId ? `/project/${projectId}/resources/videos` : undefined,
        renderItem: (item) => (
          <GenerationVideoResourceCard item={item} key={item.id} />
        ),
      },
      {
        id: "image-resources",
        title: "Resources for video (Image)",
        items: demoImageResources,
        href: projectId ? `/project/${projectId}/resources/images` : undefined,
        renderItem: (item) => (
          <GenerationImageResourceCard item={item} key={item.id} />
        ),
      },
      {
        id: "audio-resources",
        title: "Resources for video (Audio)",
        items: demoAudioResources,
        href: projectId ? `/project/${projectId}/resources/audio` : undefined,
        renderItem: (item) => (
          <GenerationAudioResourceCard item={item} key={item.id} />
        ),
      },
    ].filter(Boolean)
  ), [projectId]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 lg:flex-row">
      <GenerationSidebar className="hidden w-full lg:flex lg:w-[420px] lg:flex-col" />
      <div className="flex h-full min-h-0 flex-1 flex-col">
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
              {sections.map((section) => (
                <section
                  className="flex flex-col gap-4 rounded-lg border border-muted bg-muted/30 p-5 shadow-sm"
                  key={section.id}
                >
                  <header className="flex items-center justify-between gap-4">
                    <h2 className="font-semibold text-base text-foreground">
                      {section.title}
                    </h2>
                    {section.href ? (
                      <Button asChild size="sm" variant="ghost">
                        <Link href={section.href}>See all</Link>
                      </Button>
                    ) : null}
                  </header>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {section.items.slice(0, MAX_RESOURCE_ITEMS).map(section.renderItem)}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
