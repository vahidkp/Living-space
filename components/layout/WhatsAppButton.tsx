import { whatsappHref } from "@/lib/site";

/**
 * Floating WhatsApp enquiry button, fixed to the bottom-right on every page.
 *
 * A plain `<a>` in a Server Component — no client JS. It is a link, not a
 * button, because it navigates somewhere; using a <button> here would lose
 * middle-click, "open in new tab" and the browser's own link affordances.
 *
 * COLOUR: WhatsApp's teal (`--color-whatsapp`), not the more familiar light
 * green #25D366. Measured against this site's cream page that green reaches only
 * 1.81:1, and a light glyph on it 1.98:1 — both far below the 3:1 WCAG 1.4.11
 * requires for a UI component and its icon. The teal is an official WhatsApp
 * brand colour and clears both: 3.77:1 for the button against the page, 3.77:1
 * for the cream glyph on the button, rising to 5.28:1 on hover. Recognisably
 * WhatsApp, and actually visible.
 *
 * Z-INDEX: 30, deliberately below the overlays (50). The mobile filter sheet,
 * the nav drawer and the PDP lightbox must cover this button, not fight it.
 *
 * The button is 56px — comfortably past the 44px touch target minimum — and
 * sits inside the iOS safe area so it clears the home indicator.
 */
export function WhatsAppButton() {
  const href = whatsappHref();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      // The accessible name says both what it does and that it leaves the site,
      // since a new tab opening unannounced is disorienting.
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      className="fixed z-30 flex size-14 items-center justify-center rounded-full bg-whatsapp text-ink-inverse shadow-sm transition-colors duration-150 hover:bg-whatsapp-hover"
      style={{
        // Clear the iOS home indicator / notch without affecting other platforms.
        bottom: "max(1.25rem, env(safe-area-inset-bottom))",
        right: "max(1.25rem, env(safe-area-inset-right))",
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.25-4.36c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.21-8.26 8.21Z" />
      </svg>
    </a>
  );
}
