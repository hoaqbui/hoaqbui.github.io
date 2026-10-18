import { profile } from "@/content/profile";
import Link from "next/link";
import Reveal from "@/fx/Reveal";

export default function Contact() {
  return (
    <Reveal>
      <section
        id="contact"
        className="mx-auto min-h-[70svh] max-w-[1120px] border-t border-border px-6 pt-24 pb-32 md:pb-24"
      >
        <blockquote className="mb-16 max-w-[720px]">
          <p className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-medium leading-[1.25] tracking-[-0.025em] text-text">
            “{profile.quote.text}”
          </p>
          <footer className="mt-3 font-mono text-[13px] text-muted">{profile.quote.by}, on the map tools</footer>
        </blockquote>
        <p className="font-mono text-sm text-muted">{profile.openTo}</p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-4 inline-block text-[clamp(1.75rem,5vw,3rem)] font-medium tracking-[-0.03em] text-text break-all"
        >
          {profile.email}
        </a>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-[44px] items-center font-medium text-teal"
          >
            LinkedIn
          </a>
          <a
            href={profile.vcardPath}
            download="hoa-bui.vcf"
            className="inline-flex min-h-[44px] items-center font-medium text-teal"
          >
            Save contact
          </a>
          <a
            href={profile.resumePath}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-[44px] items-center font-medium text-teal"
          >
            Résumé
          </a>
          <Link href="/building/" className="inline-flex min-h-[44px] items-center font-medium text-teal">
            Projects
          </Link>
        </div>
      </section>
    </Reveal>
  );
}
