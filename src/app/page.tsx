import { ViewTransition } from "react";
import Hero from "@/sections/Hero";
import Building from "@/sections/Building";
import Work from "@/sections/Work";
import Photos from "@/sections/Photos";
import Contact from "@/sections/Contact";

export default function Home() {
  return (
    <ViewTransition>
      <main>
        <Hero />
        <Building />
        <Work />
        <Photos band />
        <Contact />
      </main>
    </ViewTransition>
  );
}
