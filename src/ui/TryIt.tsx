import { profile } from "@/content/profile";

const passwordHref = `mailto:${profile.email}?subject=${encodeURIComponent("Compo password")}`;

export default function TryIt({ href, className = "" }: { href: string; className?: string }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 text-sm text-muted ${className}`}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[44px] items-center font-medium text-teal"
      >
        Try it in Compo ↗
      </a>
      <a
        href={passwordHref}
        className="inline-flex min-h-[44px] items-center underline underline-offset-2 hover:text-text"
      >
        Password on request
      </a>
    </p>
  );
}
