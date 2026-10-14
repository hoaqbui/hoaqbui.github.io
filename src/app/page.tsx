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
      {/* clip, not hidden: no sideways scroll from the tilted Building cards, and shadows are
          only cut at the screen edge (a wrapper that clipped them showed a hard grey box) */}
      <main className="overflow-x-clip">
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
