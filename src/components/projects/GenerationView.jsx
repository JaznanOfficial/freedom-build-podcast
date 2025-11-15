"use client";

import { PanelLeftOpen } from "lucide-react";
import { useProjectChat } from "@/components/projects/ChatProvider";
import { GenerationSidebar } from "@/components/projects/GenerationSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function GenerationView() {
  useProjectChat();

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
        <div className="flex min-h-0 flex-1 items-center justify-center rounded-lg border bg-background text-muted-foreground text-sm">
          Start a conversation with Jaznan using the chat panel.
        </div>
      </div>
    </div>
  );
}
