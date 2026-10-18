import { ViewTransition } from "react";
import Hero from "@/sections/Hero";
import HowIWork from "@/sections/HowIWork";
import Work from "@/sections/Work";
import InMotion from "@/sections/InMotion";
import { photos } from "@/content/photos";
import Dusk from "@/fx/Dusk";
import Contact from "@/sections/Contact";

const motionPhotos = photos.flatMap((photo) => {
  if (!photo.shot) return [];
  const { id, src, width, height, title, alt, focusY } = photo;
  const { webm, mp4 } = photo.shot;
  return [{ id, src, width, height, title, alt, focusY, shot: { webm, mp4 } }];
});

export default function Home() {
  return (
    <ViewTransition>
      {/* clip, not hidden: no sideways scroll, and shadows are only cut at the screen edge */}
      <main className="overflow-x-clip">
        <Hero />
        {/* the story, top to bottom: the claim, the proof, the pattern, the pattern now with AI */}
        <Work />
        <HowIWork />
        <Dusk>
          <InMotion takes={motionPhotos} />
        </Dusk>
        <Contact />
      </main>
    </ViewTransition>
  );
}
