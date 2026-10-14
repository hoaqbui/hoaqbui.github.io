import { ViewTransition } from "react";
import Hero from "@/sections/Hero";
import Building from "@/sections/Building";
import Work from "@/sections/Work";
import Photos from "@/sections/Photos";
import Dusk from "@/fx/Dusk";
import Contact from "@/sections/Contact";

export default function Home() {
  return (
    <ViewTransition>
      <main>
        <Hero />
        <Building />
        <Work />
        <Dusk>
          <Photos band />
        </Dusk>
        <Contact />
      </main>
    </ViewTransition>
  );
}
