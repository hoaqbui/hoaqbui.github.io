import type { Shot as ShotData } from "@/content/projects";

// A screenshot in the site's current theme. With `link`, tapping it opens the full-size
// image, which is how a phone reader gets to read a wide desktop screenshot.
export default function Shot({
  shot,
  sizes,
  link = false,
  className = "",
}: {
  shot: ShotData;
  sizes: string;
  link?: boolean;
  className?: string;
}) {
  return (
    <>
      {(["light", "dark"] as const).map((theme) => {
        const src = `${shot.src}-${theme}.webp`;
        const img = (
          <img
            src={src}
            sizes={sizes}
            width={shot.width}
            height={shot.height}
            alt={shot.alt}
            loading="lazy"
            decoding="async"
            // 2x captures: never shown larger than the app drew them, so every shot reads at one scale
            style={{ maxWidth: shot.width / 2 }}
            className={`block h-auto w-full rounded-xl border border-border ${className}`}
          />
        );
        return link ? (
          <a key={theme} href={src} target="_blank" rel="noopener" className={`shot-${theme}`} data-shot>
            {img}
          </a>
        ) : (
          <div key={theme} className={`shot-${theme}`} data-shot>
            {img}
          </div>
        );
      })}
    </>
  );
}
