"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

export function RootProviders({ children }) {
  return (
    <ClerkProvider>
      <QueryProvider>
        {children}
        <Toaster richColors />
      </QueryProvider>
    </ClerkProvider>
  );
}
