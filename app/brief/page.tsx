import { Suspense } from "react";
import type { Metadata } from "next";
import { BriefView } from "@/components/BriefView";

export const metadata: Metadata = {
  title: "Market Entry Brief — Market Pulse",
};

export default function BriefPage() {
  return (
    <Suspense>
      <BriefView />
    </Suspense>
  );
}
