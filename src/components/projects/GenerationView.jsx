"use client";

import { PanelLeftOpen } from "lucide-react";
import { useProjectChat } from "@/components/projects/ChatProvider";
import { GenerationSidebar } from "@/components/projects/GenerationSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function GenerationView() {
  useProjectChat();

  const sections = [
    {
      id: "videos",
      title: "Videos",
      empty: "No videos yet. Ask Jaznan to craft one!",
    },
    {
      id: "image-resources",
      title: "Resources (Image)",
      empty: "Bring your reference images here soon.",
    },
    {
      id: "audio-resources",
      title: "Resources (Audio)",
      empty: "Upload voiceovers or music when you're ready.",
    },
  ];

  return (
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
            <div className="grid h-full grid-rows-3 gap-6">
              {sections.map((section) => (
                <section
                  className="flex min-h-0 flex-col rounded-lg border border-muted bg-muted/30 p-5 shadow-sm"
                  key={section.id}
                >
                  <header className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-foreground">
                      {section.title}
                    </h2>
                  </header>
                  <div className="mt-4 flex flex-1 items-center justify-center rounded-md border border-dashed border-muted-foreground/40 bg-background/80 text-center text-muted-foreground text-sm">
                    {section.empty}
                  </div>
                  <button
                    className="mt-4 text-sm font-medium text-primary transition hover:text-primary/80"
                    type="button"
                  >
                    See all
                  </button>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
