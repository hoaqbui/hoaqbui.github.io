import SectionLabel from "@/ui/SectionLabel";
import { photos } from "@/content/photos";
import Cinemascope from "@/ui/Cinemascope";

// The gallery needs captions and image paths, not the video prompts attached to four photos.
const galleryPhotos = photos.map(({ shot, ...photo }) => photo);

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
            <SectionLabel as={Heading}>
              Photographs
            </SectionLabel>
            <p className="mt-3 text-body text-muted">
              A quiet selection of frames from travels in Japan, Czechia, Taiwan, Ireland, Vietnam and Brazil.
            </p>
          </div>
          <a
            href="https://hoaqbui.myportfolio.com"
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-[44px] items-center text-body font-medium text-teal hover:underline"
          >
            All photographs →
          </a>
        </header>

        <Cinemascope photos={galleryPhotos} eager={!band} />
      </div>
    </section>
  );
}
