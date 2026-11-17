import { PageHeader } from "@/components/page-header";
import type { ReactNode } from "react";

export function TextToSpeechLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PageHeader title="Text to speech" />
      {children}
    </div>
  );
}
