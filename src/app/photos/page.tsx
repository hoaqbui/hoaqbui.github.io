import { ViewTransition } from "react";
import type { Metadata } from "next";
import Photos from "@/sections/Photos";
import { DuskFull } from "@/fx/Dusk";

export const metadata: Metadata = {
  title: "Photographs — Hoa Bui",
  openGraph: { url: "/photos/" },
};

export default function PhotosPage() {
  return (
    <ViewTransition>
      <DuskFull />
      <Photos />
    </ViewTransition>
  );
}
