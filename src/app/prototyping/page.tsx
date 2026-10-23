import { ViewTransition } from "react";
import type { Metadata } from "next";
import Prototyping from "@/sections/Prototyping";
import { copy } from "@/content/prototyping";

export const metadata: Metadata = {
  title: "How I prototype — Hoa Bui",
  description: copy.thesis,
  openGraph: {
    title: "How I prototype — Hoa Bui",
    description: copy.thesis,
    url: "/prototyping/",
    images: ["/prototyping/og.png"],
  },
};

export default function PrototypingPage() {
  return (
    <ViewTransition>
      <Prototyping />
    </ViewTransition>
  );
}
