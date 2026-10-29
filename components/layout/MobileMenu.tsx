"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NAV_LINKS } from "@/lib/site";
import { CloseIcon, MenuIcon } from "@/components/ui/Icon";
import { useFocusTrap } from "@/components/ui/useFocusTrap";

/**
 * Mobile navigation drawer. Client-side because it owns open/closed state.
 *
 * Focus handling (trap, Escape, restore, scroll lock) is shared with the shop
 * page's filter sheet via `useFocusTrap` — one implementation, two consumers.
 *
 * ── WHY THE OVERLAY IS PORTALLED TO <body> ────────────────────────────────
 * The trigger lives inside <header>, which carries `backdrop-blur-sm`. A
 * non-`none` `backdrop-filter` makes an element a CONTAINING BLOCK for
 * fixed-position descendants — exactly like `transform`, `filter`, `perspective`,
 * `will-change` and `contain` do.
 *
 * So while the drawer was a DOM child of the header, `fixed inset-0` resolved
 * against the header's box rather than the viewport, and the panel rendered
 * 375×64 tucked inside the header instead of filling the screen (measured on a
 * 375×800 viewport: y=36, height=64).
 *
 * Portalling to <body> takes the overlay out of that containing block entirely.
 * It also means no future ancestor picking up a transform or a filter can break
 * this again — which is worth more than the one-line alternative of dropping the
 * header's blur.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  // `document` does not exist during the server render, so the portal target is
  // only resolved after mount. The drawer can only open on a click, which is
  // always post-mount, so this never delays anything the user sees.
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useFocusTrap({
    active: open,
    containerRef: panelRef,
    onDismiss: () => setOpen(false),
    restoreFocusTo: triggerRef,
  });

  // Close the drawer when a link navigates, so returning via the back button
  // doesn't reveal a still-open panel.
  //
  // Also close it if the viewport grows past `lg`, where the trigger itself is
  // hidden and the full nav is visible in the header. Now that the overlay is
  // portalled to <body> it no longer sits under the trigger's `lg:hidden`, so
  // without this a drawer left open while resizing would strand a modal over the
  // desktop layout with no visible way to dismiss it but Escape.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const desktop = window.matchMedia("(min-width: 1024px)");
    window.addEventListener("popstate", close);
    desktop.addEventListener("change", close);
    return () => {
      window.removeEventListener("popstate", close);
      desktop.removeEventListener("change", close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="-m-2 flex size-11 items-center justify-center p-2 text-ink lg:hidden"
      >
        <MenuIcon size={22} />
      </button>

      {open &&
        mounted &&
        createPortal(
          // `lg:hidden` is intentionally NOT on this element any more. Portalled
          // to <body>, it no longer inherits the trigger's responsive context,
          // and the drawer is only ever opened by a button that is itself
          // lg:hidden — so a viewport resize while open is the only way to see
          // it on desktop, which the resize listener below handles directly.
          <div className="fixed inset-0 z-50">
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="absolute inset-0 size-full cursor-default bg-ink/40"
            />
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-bg"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <span className="eyebrow text-muted">Menu</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="-m-2 flex size-11 items-center justify-center p-2 text-ink"
                >
                  <CloseIcon size={20} />
                </button>
              </div>

              <nav aria-label="Main" className="flex-1 overflow-y-auto px-5 py-2">
                <ul>
                  {NAV_LINKS.map((link) => (
                    <li key={link.label} className="border-b border-line/70">
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex min-h-14 items-center font-display text-xl font-light text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/shop"
                  onClick={() => setOpen(false)}
                  className="mt-6 inline-flex min-h-11 items-center text-xs font-medium uppercase tracking-[0.08em] text-ink underline underline-offset-4"
                >
                  Shop everything
                </Link>
              </nav>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
