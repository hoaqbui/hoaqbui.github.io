import type { Metadata } from "next";
import { Geist } from "next/font/google";
import PillNav from "@/ui/PillNav";
import { profile } from "@/content/profile";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});



const DESCRIPTION =
  "Technical Product Manager in Los Angeles for AI creative tools: generative video and agentic AI, after 18 years of film, animation and game pipelines at Lucasfilm, Pixar and Riot Games.";

// schema.org Person for search engines; nothing on screen
const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Technical Product Manager",
  url: "https://hoa.flamme.us",
  sameAs: [profile.linkedin],
  address: { "@type": "PostalAddress", addressLocality: "Los Angeles", addressRegion: "CA", addressCountry: "US" },
  knowsAbout: profile.searchTerms,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hoa.flamme.us"),
  title: "Hoa Bui — Technical Product Manager, AI creative tools",
  description: DESCRIPTION,
  keywords: profile.searchTerms,
  openGraph: {
    description: DESCRIPTION,
    type: "website",
    url: "https://hoa.flamme.us",
    siteName: "Hoa Bui",
    images: [profile.ogImage],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} h-full antialiased scroll-pt-20`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"){document.documentElement.dataset.theme="dark"}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }} />
        <PillNav
          items={[
            { id: "top", label: "About", href: "/#top" },
            { id: "work", label: "Impact", href: "/#work" },
            { id: "how", label: "How I work", href: "/#how" },
            { id: "now", label: "Now", href: "/#now" },
            { id: "contact", label: "Contact", href: "/#contact" },
          ]}
          contact={{ email: profile.email, resumePath: profile.resumePath, linkedin: profile.linkedin }}
        />
        {children}
      </body>
    </html>
  );
}
