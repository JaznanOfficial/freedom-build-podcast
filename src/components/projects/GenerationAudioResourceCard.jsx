"use client";

import { Music4, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function GenerationAudioResourceCard({ item }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
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
      className={`group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background p-5 text-left transition-all duration-200 hover:border-primary hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${isPlaying ? "border-primary" : ""}`}
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
              <p className="text-muted-foreground text-xs">{item.duration}</p>
            ) : null}
          </div>
        </div>
        <span
          className={`flex size-9 items-center justify-center rounded-full border border-primary/40 bg-background transition-colors ${isPlaying ? "bg-primary text-background" : "text-primary"}`}
        >
          {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-end gap-1">
          {bars.map((height, index) => (
            <span
              className={`w-1.5 rounded-full bg-primary/30 transition-all duration-300 ${isPlaying ? "animate-pulse bg-primary" : ""}`}
              key={`${item.id}-bar-${index}`}
              style={{ height: `${height}px`, animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
        <p className="text-muted-foreground text-xs">
          Tap to {isPlaying ? "pause" : "play"} this audio theme.
        </p>
      </div>
      <audio aria-hidden preload="none" ref={audioRef} src={item.url} />
    </button>
  );
}
