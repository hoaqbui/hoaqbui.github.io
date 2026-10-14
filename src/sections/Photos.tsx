import { photos } from "@/content/photos";
import Cinemascope from "@/ui/Cinemascope";
import LazyCinemascope from "@/ui/LazyCinemascope";

// band: the home-scroll version (h2, lazy, no full-screen height); default is the /photos page.
export default function Photos({ band = false }: { band?: boolean }) {
  const Heading = band ? "h2" : "h1";
  return (
    <section
      id="photos"
      className={`w-full text-text ${
        band ? "py-20 md:py-24" : "pt-20 md:pt-24 pb-32 md:pb-24 min-h-screen"
      }`}
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <header className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <Heading className="font-mono text-sm tracking-wide text-muted">
              Photographs
            </Heading>
            <p className="mt-2 text-base text-muted">
              A quiet selection of frames from travels in Japan, Czechia and Brazil.
            </p>
          </div>
          <a
            href="https://hoaqbui.myportfolio.com"
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-[44px] items-center text-sm font-medium text-teal hover:underline"
          >
            All photographs →
          </a>
        </header>

        {band ? (
          <LazyCinemascope photos={photos} eager={false} />
        ) : (
          <Cinemascope photos={photos} />
        )}
      </div>
    </section>
  );
}
