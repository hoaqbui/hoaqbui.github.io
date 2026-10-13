import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import PillNav from "@/ui/PillNav";
import { profile } from "@/content/profile";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: "400",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hoa.flamme.us"),
  title: "Hoa Bui — Creative and technology leader, Senior Technical PM",
  description: `${profile.headline} ${profile.roleLine}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased scroll-pt-20`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"){document.documentElement.dataset.theme="dark"}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full">
        <PillNav
          items={[
            { id: "top", label: "HB", href: "/#top" },
            { id: "building", label: "Building", href: "/#building" },
            { id: "work", label: "Work", href: "/#work" },
            { id: "photos", label: "Photos", href: "/photos" },
            { id: "contact", label: "Contact", href: "/#contact" },
            { id: "resume", label: "Résumé", href: profile.resumePath },
          ]}
        />
        {children}
      </body>
    </html>
  );
}
