import { ViewTransition } from "react";
import type { Metadata } from "next";
import ProjectsIndex from "@/sections/ProjectsIndex";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Projects — Hoa Bui",
  description: "What Hoa Bui is building with AI: an intent-to-video pipeline, a multi-agent system and a vision-model dog-cam.",
  openGraph: { url: "/building/", images: [profile.ogImage] },
};

export default function ProjectsPage() {
  return (
    <ViewTransition>
      <ProjectsIndex />
    </ViewTransition>
  );
}
