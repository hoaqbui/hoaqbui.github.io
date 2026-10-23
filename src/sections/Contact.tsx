import { magic } from "@/fx/magic";
import { LinkedInIcon, ResumeIcon, SaveContactIcon } from "@/ui/Icons";
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
          <p className="text-title text-text">
            “{profile.quote.text}”
          </p>
          <footer className="mt-3 text-label text-muted">{profile.quote.by}, on the map tools</footer>
        </blockquote>
        <p className="text-body text-muted">{profile.openTo}</p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-4 inline-flex min-h-[44px] items-center text-title text-text break-all"
        >
          {profile.email}
        </a>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={profile.resumePath}
            target="_blank"
            rel="noopener"
            className={`inline-flex min-h-[48px] items-center gap-2 rounded-full bg-teal px-5 text-body font-medium text-surface shadow-sm transition-[transform,box-shadow] motion-safe:hover:scale-[1.03] ${magic.shimmer}`}
          >
            <ResumeIcon />
            Résumé
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener"
            aria-label="LinkedIn"
            className="inline-flex size-12 items-center justify-center rounded-full bg-[#0a66c2] text-white shadow-sm transition-transform motion-safe:hover:scale-[1.06]"
          >
            <LinkedInIcon size={22} />
          </a>
          <a
            href={profile.vcardPath}
            download="hoa-bui.vcf"
            aria-label="Save contact"
            title="Save contact"
            className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-surface text-text shadow-sm transition-transform motion-safe:hover:scale-[1.06]"
          >
            <SaveContactIcon size={22} />
          </a>
          <Link href="/building/" className="ml-2 inline-flex min-h-[44px] items-center text-body font-medium text-teal">
            Projects
          </Link>
        </div>
      </section>
    </Reveal>
  );
}
