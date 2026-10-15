import { ViewTransition } from "react";
import Hero from "@/sections/Hero";
import Building from "@/sections/Building";
import Work from "@/sections/Work";
import Photos from "@/sections/Photos";
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
      {/* clip, not hidden: no sideways scroll from the tilted Building cards, and shadows are
          only cut at the screen edge (a wrapper that clipped them showed a hard grey box) */}
      <main className="overflow-x-clip">
        <Hero />
        <Building />
        <Work />
        <Dusk>
          <Photos band />
          <InMotion takes={motionPhotos} />
        </Dusk>
        <Contact />
      </main>
    </ViewTransition>
  );
}
