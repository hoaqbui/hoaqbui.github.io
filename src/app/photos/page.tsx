import type { Metadata } from "next";
import Photos from "@/sections/Photos";

export const metadata: Metadata = {
  title: "Photographs — Hoa Bui",
};

export default function PhotosPage() {
  return <Photos />;
}
