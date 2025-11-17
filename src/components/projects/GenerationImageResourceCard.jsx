"use client";

import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export function GenerationImageResourceCard({ item }) {
  return (
    <article className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-primary/20 shadow-sm transition-all duration-200 hover:border-primary hover:shadow-lg">
      <Image
        alt={item.title}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        fill
        priority={false}
        sizes="(min-width: 1280px) 20vw, (min-width: 768px) 40vw, 80vw"
        src={item.url}
        unoptimized
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/75 via-background/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <span className="flex w-fit items-center gap-2 rounded-full bg-background/85 px-3 py-1 font-medium text-foreground text-xs shadow-sm">
          <ImageIcon className="size-3.5 text-primary" />
          {item.resolution ?? "High-resolution"}
        </span>
        <div className="flex translate-y-3 flex-col gap-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="font-semibold text-primary text-sm">{item.title}</p>
          {item.description ? (
            <p className="text-black text-xs">{item.description}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
