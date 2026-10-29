"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Shared modal behaviour for the three overlays in this app: the mobile nav
 * drawer, the shop filter sheet, and the PDP image lightbox.
 *
 * Handles the four things the accessibility-audit skill requires of a dialog:
 *   1. focus moves into the panel on open
 *   2. Tab / Shift+Tab cycle within the panel and cannot escape it
 *   3. Escape dismisses
 *   4. focus returns to the element that opened it
 *
 * Also locks background scroll, compensating for the scrollbar width so the
 * page behind doesn't shift horizontally as it locks.
 */
export function useFocusTrap({
  active,
  containerRef,
  onDismiss,
  restoreFocusTo,
}: {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
  onDismiss: () => void;
  restoreFocusTo?: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Captured now rather than read during cleanup: by teardown the ref may
    // already point at a detached node, and focusing that silently does nothing.
    const explicitRestoreTarget = restoreFocusTo?.current ?? null;

    // Move focus into the panel — its first focusable child, or the panel.
    const focusFirst = () => {
      if (!container) return;
      const first = container.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? container).focus();
    };
    if (container && !container.hasAttribute("tabindex")) {
      container.setAttribute("tabindex", "-1");
    }
    focusFirst();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss();
        return;
      }
      if (event.key !== "Tab" || !container) return;

      const focusable = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (focusable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      const activeEl = document.activeElement;
      if (event.shiftKey && (activeEl === first || activeEl === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    // Scroll lock without a horizontal jump.
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      const restoreTarget = explicitRestoreTarget ?? previouslyFocused;
      // Only restore if the element is still in the document — otherwise leave
      // focus alone rather than dumping it on <body>.
      if (restoreTarget?.isConnected) restoreTarget.focus();
    };
  }, [active, containerRef, onDismiss, restoreFocusTo]);
}
