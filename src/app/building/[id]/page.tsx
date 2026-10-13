import { ViewTransition } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import Project from "@/sections/Project";

export const dynamicParams = false;

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) {
    return {};
  }
  return {
    title: `${project.title} — Hoa Bui`,
    openGraph: { url: `/building/${id}/` },
    description: project.body,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) {
    notFound();
  }
  return (
    <ViewTransition>
      <Project id={id} />
    </ViewTransition>
  );
}
