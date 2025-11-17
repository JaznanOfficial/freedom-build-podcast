"use client";

import { useEffect, useRef, useState } from "react";
import { Music4, PanelLeftOpen, Pause, Play } from "lucide-react";
import { useProjectChat } from "@/components/projects/ChatProvider";
import { GenerationSidebar } from "@/components/projects/GenerationSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function GenerationView() {
  useProjectChat();

  const audioResources = [
    {
      id: "audio-1",
      title: "Focus Loop",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      duration: "3:21",
    },
    {
      id: "audio-2",
      title: "Calm Ambience",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      duration: "2:58",
    },
    {
      id: "audio-3",
      title: "Uplift Beat",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      duration: "3:34",
    },
    {
      id: "audio-4",
      title: "Soft Piano",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      duration: "4:02",
    },
  ];

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
      items: audioResources,
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
              {sections.map((section) => {
                const items = Array.isArray(section.items) ? section.items : [];
                const isAudioSection = section.id === "audio-resources";
                const hasItems = items.length > 0;

                return (
                  <section
                    className="flex min-h-0 flex-col rounded-lg border border-muted bg-muted/30 p-5 shadow-sm"
                    key={section.id}
                  >
                    <header className="flex items-center justify-between">
                      <h2 className="text-base font-semibold text-foreground">
                        {section.title}
                      </h2>
                    </header>
                    {isAudioSection && hasItems ? (
                      <div className="mt-4 grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {items.map((item) => (
                          <AudioPreview key={item.id} item={item} />
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-1 items-center justify-center rounded-md border border-dashed border-muted-foreground/40 bg-background/80 text-center text-muted-foreground text-sm">
                        {section.empty}
                      </div>
                    )}
                    <button
                      className="mt-4 text-sm font-medium text-primary transition hover:text-primary/80"
                      type="button"
                    >
                      See all
                    </button>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AudioPreview({ item }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return undefined;
    }

    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("ended", handlePause);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("ended", handlePause);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
      return;
    }

    audio.pause();
  };

  const bars = [8, 14, 10, 16, 12];

  return (
    <button
      aria-label={`Play preview: ${item.title}`}
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background p-5 text-left transition-all duration-200 hover:border-primary hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${isPlaying ? "border-primary" : ""}`}
      onClick={togglePlayback}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Music4 className="size-5" />
          </span>
          <div>
            <p className="font-semibold text-foreground">{item.title}</p>
            {item.duration ? (
              <p className="text-xs text-muted-foreground">{item.duration}</p>
            ) : null}
          </div>
        </div>
        <span
          className={`flex size-9 items-center justify-center rounded-full border border-primary/40 transition-colors ${isPlaying ? "bg-primary text-background" : "bg-background text-primary"}`}
        >
          {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
        </span>
      </div>
      <div className="mt-6 flex items-end gap-1">
        {bars.map((height, index) => (
          <span
            key={`${item.id}-bar-${index}`}
            className={`w-1.5 rounded-full bg-primary/30 transition-all duration-300 ${isPlaying ? "animate-pulse bg-primary" : ""}`}
            style={{ height: `${height}px`, animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Tap to {isPlaying ? "pause" : "play"} this audio theme.</p>
      <audio aria-hidden ref={audioRef} preload="none" src={item.url} />
    </button>
  );
}
