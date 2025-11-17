"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenerationAudioResourceCard } from "@/components/projects/GenerationAudioResourceCard";
import { demoAudioResources } from "@/data/demoResources";

export function AudioResourcesView({ projectId }) {
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
            Audio resources
          </h1>
          <span className="justify-self-end text-sm text-muted-foreground">
            {demoAudioResources.length} curated tracks
          </span>
        </header>

        <section className="grid grid-cols-1 gap-4 items-start sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {demoAudioResources.map((item) => (
            <GenerationAudioResourceCard key={item.id} item={item} />
          ))}
        </section>
      </div>
    </div>
  );
}
