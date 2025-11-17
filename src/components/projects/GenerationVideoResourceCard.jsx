"use client";

import { Clapperboard } from "lucide-react";
import Image from "next/image";

export function GenerationVideoResourceCard({ item, onSelect }) {
  const handleClick = () => {
    if (typeof onSelect === "function") {
      onSelect(item);
    }
  };

  return (
    <button
      aria-label={`Open video preview: ${item.title}`}
      className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-primary/20 bg-background text-left shadow-sm transition-all duration-200 hover:border-primary hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      onClick={handleClick}
      type="button"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          alt={item.title}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          fill
          priority={false}
          sizes="(min-width: 1280px) 28vw, (min-width: 768px) 40vw, 90vw"
          src={item.thumbnail}
          unoptimized
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <span className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 font-medium text-foreground text-xs shadow-sm">
          <Clapperboard className="size-3.5 text-primary" />
          {item.resolution}
        </span>
        {item.duration ? (
          <span className="absolute right-3 bottom-3 rounded-full bg-background/90 px-2.5 py-1 font-semibold text-foreground text-xs shadow-sm">
            {item.duration}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-base text-foreground">{item.title}</h3>
        {item.description ? (
          <p className="text-muted-foreground text-sm">{item.description}</p>
        ) : null}
      </div>
    </button>
  );
}
