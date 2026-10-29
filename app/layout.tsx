import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TrustBar } from "@/components/layout/TrustBar";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SITE } from "@/lib/site";

/**
 * Fonts are self-hosted by next/font at build time — no render-blocking request
 * to Google, and `display: swap` by default (performance-lighthouse skill).
 *
 * Fraunces is the PRD's first-choice display serif (§5.3). ONLY weight 300 is
 * pulled: the base h1–h4 rule sets font-weight 300, and every explicit
 * `font-display` usage in the app pairs it with `font-light`, so weight 400 was
 * downloaded on every page and never rendered a single glyph.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Custom-Made Furniture, Abu Dhabi & UAE`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "custom made furniture Abu Dhabi",
    "custom furniture UAE",
    "majlis sofa Abu Dhabi",
    "TV unit UAE",
    "bed wall design UAE",
    "villa furniture UAE",
  ],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: `${SITE.name} — Custom-Made Furniture, Abu Dhabi & UAE`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Custom-Made Furniture, Abu Dhabi & UAE`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

/**
 * Scroll-reveal bootstrap.
 *
 * Runs during head parse — before the body paints — so marking elements hidden
 * can never cause a flash of already-visible content. If JS is disabled or
 * fails, `data-reveal-ready` is never set, the CSS rules that hide content never
 * match, and every section renders plainly visible. Progressive enhancement, so
 * a script failure cannot blank the page.
 *
 * ── WHY THERE IS A MutationObserver HERE ──────────────────────────────────
 * The first version observed only the elements present at DOMContentLoaded.
 * That is fine until the App Router swaps pages on the client: navigating to
 * /shop and back rebuilds the homepage with fresh `data-reveal="pending"`
 * nodes that no IntersectionObserver is watching, while `data-reveal-ready` is
 * still set on <html> — so the CSS hid them and nothing ever un-hid them. Every
 * revealing section on the page came back blank (measured: 6 of 6 invisible
 * after a back-navigation).
 *
 * A MutationObserver picks up any pending element added to the DOM, whatever
 * put it there — router navigation, back/forward, or future dynamic content.
 * That fixes the whole class of bug rather than the one route that exposed it,
 * and needs no coupling to the router.
 *
 * Rescans are batched into a single animation frame, and the query only matches
 * elements still marked pending (revealed ones are switched to "shown" and
 * unobserved), so the work per mutation burst stays trivial.
 */
const REVEAL_BOOTSTRAP = `
(function () {
  var r = document.documentElement;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;
  r.setAttribute("data-reveal-ready", "true");

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.setAttribute("data-reveal", "shown");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

  var queued = false;
  function scan() {
    queued = false;
    var pending = document.querySelectorAll('[data-reveal="pending"]');
    for (var i = 0; i < pending.length; i++) io.observe(pending[i]);
  }
  function queueScan() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(scan);
  }

  function start() {
    scan();
    if (!("MutationObserver" in window) || !document.body) return;
    new MutationObserver(queueScan).observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${fraunces.variable} ${inter.variable}`}
      // The bootstrap script below stamps `data-reveal-ready` onto this element
      // during head parse — before React hydrates — so the client DOM
      // deliberately carries an attribute the server HTML does not, and React
      // reports a hydration mismatch.
      //
      // The divergence is the entire point: the attribute must only exist when
      // JS has actually run, which is what keeps the reveal a progressive
      // enhancement rather than something that can blank the page. Server-
      // rendering the attribute would defeat that, since the server cannot know
      // whether the script will execute.
      //
      // `suppressHydrationWarning` is React's documented escape hatch for
      // exactly this case (a pre-hydration script mutating an element React
      // owns). It applies one level deep — to this element's own attributes —
      // so it silences the html-tag warning without masking mismatches anywhere
      // else in the tree.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOTSTRAP }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2.5 focus:text-xs focus:uppercase focus:tracking-[0.08em] focus:text-ink-inverse"
        >
          Skip to content
        </a>
        <AnnouncementBar />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        {/* Outside <main>: these are site furniture repeated on every page, not
            part of any one page's content. */}
        <TrustBar />
        <Footer />
        {/* Last in the DOM so it is also last in the tab order — a persistent
            floating control should not sit between the header and the content
            every time someone tabs through the page. */}
        <WhatsAppButton />
      </body>
    </html>
  );
}
