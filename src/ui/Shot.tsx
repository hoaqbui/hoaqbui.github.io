import type { Shot as ShotData } from "@/content/projects";

// A screenshot in the site's current theme (or one image, for an app with no dark theme).
// With `link`, tapping it opens the full-size image, which is how a phone reader gets to
// read a wide desktop screenshot.
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
  const variants = shot.themed === false ? ([[null, `${shot.src}.webp`]] as const) : (["light", "dark"] as const).map((t) => [t, `${shot.src}-${t}.webp`] as const);
  return (
    <>
      {variants.map(([theme, src]) => {
        const img = (
          <img
            src={src}
            sizes={sizes}
            width={shot.width}
            height={shot.height}
            alt={shot.alt}
            loading="lazy"
            decoding="async"
            // never shown larger than the app drew it, so every shot reads at one scale
            style={{ maxWidth: shot.width / (shot.scale ?? 2) }}
            className={`block h-auto w-full rounded-xl border border-border ${className}`}
          />
        );
        const cls = theme ? `shot-${theme}` : undefined;
        return link ? (
          <a key={src} href={src} target="_blank" rel="noopener" className={cls} data-shot>
            {img}
          </a>
        ) : (
          <div key={src} className={cls} data-shot>
            {img}
          </div>
        );
      })}
    </>
  );
}
