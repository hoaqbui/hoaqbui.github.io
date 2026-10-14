import { ViewTransition } from "react";
import Hero from "@/sections/Hero";
import Building from "@/sections/Building";
import Work from "@/sections/Work";
import Photos from "@/sections/Photos";
import Letterbox from "@/fx/Letterbox";
import Contact from "@/sections/Contact";

export default function Home() {
  return (
    <ViewTransition>
      <main>
        <Hero />
        <Building />
        <Work />
        <Letterbox>
          <Photos band />
        </Letterbox>
        <Contact />
      </main>
    </ViewTransition>
  );
}
