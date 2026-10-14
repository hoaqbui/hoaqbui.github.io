import { photos } from "@/content/photos";
import Cinemascope from "@/ui/Cinemascope";

export default function Photos() {
  return (
    <section
      id="photos"
      className="w-full bg-photo text-[#ecefee] pt-20 md:pt-24 pb-32 md:pb-24 min-h-screen"
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <header className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h1 className="font-mono text-sm tracking-wide text-[#9aa4a8]">
              Photographs
            </h1>
            <p className="mt-2 text-base text-[#a3adab]">
              A quiet selection of frames from travels in Japan, Czechia and Brazil.
            </p>
          </div>
          <a
            href="https://hoaqbui.myportfolio.com"
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-[44px] items-center text-sm font-medium text-[#3cc9b4] hover:underline"
          >
            All photographs →
          </a>
        </header>

        <Cinemascope photos={photos} />
      </div>
    </section>
  );
}
