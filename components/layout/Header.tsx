import Link from "next/link";
import { NAV_LINKS } from "@/lib/site";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { BagIcon, HeartIcon, SearchIcon, UserIcon } from "@/components/ui/Icon";

/**
 * Sticky two-row header, following the reference layout: utility row (search /
 * centred wordmark / account icons) above a category nav row.
 *
 * This is a Server Component — the only interactive island is `MobileMenu`.
 * Stickiness is pure CSS, so there is no scroll listener anywhere.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur-sm">
      {/* ── Utility row ────────────────────────────────────────────────── */}
      <div className="shell flex h-16 items-center gap-3 sm:h-[4.5rem]">
        {/* Left: menu (mobile) + search (desktop) */}
        <div className="flex flex-1 items-center gap-1">
          <MobileMenu />

          {/*
            Search is visually present but not yet wired to a results page —
            PRD §9 lists the search results page as out of scope for this phase.
            Rather than ship a dead input, the form GETs to /shop, which ignores
            the unknown `q` param and lands the shopper on the full catalogue.
            When search ships, /shop reads `q` and nothing here changes.
          */}
          <form
            action="/shop"
            method="get"
            role="search"
            className="hidden items-center gap-2 rounded-sm border border-line bg-bg-alt/60 px-3 py-2 transition-colors duration-150 focus-within:border-ink/40 lg:flex lg:w-60 xl:w-72"
          >
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <SearchIcon size={16} className="shrink-0 text-muted" />
            <input
              id="site-search"
              name="q"
              type="search"
              placeholder="What are you looking for?"
              className="w-full bg-transparent text-[0.8125rem] text-ink placeholder:text-muted"
            />
          </form>
        </div>

        {/*
          Centre: wordmark. Deliberately NOT `priority` — that is reserved for the
          one true LCP element per page (the hero / first product image), and
          spending it here would make the logo compete with it for bandwidth.
          Being in the initial viewport, the browser fetches it immediately
          anyway; it just doesn't carry a high-priority hint.
        */}
        {/*
          28px on phones, not 36: the lockup is 5.41:1, so at 36px it is 195px
          wide and, beside the menu, search and bag buttons, overflows a 375px
          viewport by 8px. At 28px (152px wide) it fits down to 360px.
        */}
        <Logo className="h-7 shrink-0 sm:h-10" />

        {/* Right: utility icons */}
        <div className="flex flex-1 items-center justify-end gap-0.5 sm:gap-1">
          <span className="mr-1 hidden text-[0.8125rem] text-ink-soft xl:inline">
            العربية
          </span>

          <Link
            href="/shop"
            aria-label="Search"
            className="flex size-11 items-center justify-center text-ink lg:hidden"
          >
            <SearchIcon size={19} />
          </Link>
          <Link
            href="/shop"
            aria-label="Account"
            className="hidden size-11 items-center justify-center text-ink sm:flex"
          >
            <UserIcon size={19} />
          </Link>
          <Link
            href="/shop"
            aria-label="Wishlist"
            className="hidden size-11 items-center justify-center text-ink sm:flex"
          >
            <HeartIcon size={19} />
          </Link>
          <Link
            href="/shop"
            aria-label="Shopping bag, 0 items"
            className="flex size-11 items-center justify-center text-ink"
          >
            <BagIcon size={19} />
          </Link>
        </div>
      </div>

      {/* ── Category nav row ───────────────────────────────────────────── */}
      <nav
        aria-label="Product categories"
        className="hidden border-t border-line/70 lg:block"
      >
        <ul className="shell flex h-11 items-center justify-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              {/* Fills the 44px nav row so the pointer target isn't just the
                  16px text box (WCAG 2.5.8). */}
              <Link
                href={link.href}
                className="flex h-11 items-center text-[0.8125rem] text-ink-soft transition-colors duration-150 hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
          {/* Everything is made to order, so there is no sale to link to; the
              accent slot goes to the full range instead. */}
          <li>
            <Link
              href="/shop"
              className="flex h-11 items-center text-[0.8125rem] font-medium text-terracotta transition-colors duration-150 hover:text-ink"
            >
              All Furniture
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
