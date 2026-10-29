"use client";

import { useState } from "react";
import { ANNOUNCEMENTS } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Thin dark promo strip above the header, running the announcements as a
 * continuous marquee.
 *
 * Scrolling text is the classic accessibility failure, so this one carries the
 * mitigations that make it legitimate rather than merely tolerated:
 *
 *   · an explicit pause/play button — WCAG 2.2.2 requires a real mechanism to
 *     stop content that moves automatically for more than five seconds, and
 *     hover alone does not count (it is unreachable by keyboard and touch).
 *     This button is that mechanism: Tab reaches it, Enter/Space operate it.
 *   · pauses on hover, so a mouse user can stop a line to finish reading it
 *   · no animation whatsoever under prefers-reduced-motion, where it degrades
 *     to a single static line
 *
 * There is deliberately no pause-on-focus: the bar holds no focusable content
 * besides this button, so such a rule could only fire on the button itself —
 * and then pressing "Resume" would leave the marquee visibly stopped while it
 * still had focus, which reads as a broken control.
 *
 * The message list is rendered twice and the track translates by exactly -50%,
 * which makes the loop seamless without measuring anything in JS. The second
 * copy is aria-hidden: it is the same sentences again, and a screen reader
 * reading them twice is pure noise.
 *
 * Client component only because the pause button owns state. It is a few
 * hundred bytes and no data crosses the boundary.
 */
export function AnnouncementBar() {
  const [paused, setPaused] = useState(false);

  const group = (duplicate: boolean) => (
    <ul className="marquee-group flex shrink-0 items-center" aria-hidden={duplicate || undefined}>
      {ANNOUNCEMENTS.map((line) => (
        <li key={line} className="marquee-item flex shrink-0 items-center">
          <span className="eyebrow whitespace-nowrap text-ink-inverse">{line}</span>
          {/* Decorative separator between messages. */}
          <span aria-hidden="true" className="mx-6 text-muted-inverse sm:mx-10">
            &#9670;
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="on-dark relative bg-surface-dark text-ink-inverse">
      <div className="flex h-9 items-center sm:h-10">
        <div className="marquee flex-1">
          <div
            className="marquee-track"
            data-paused={paused ? "true" : undefined}
            // Duration scales with the number of messages so adding a fourth
            // doesn't silently speed the whole thing up.
            style={{ ["--marquee-duration" as string]: `${ANNOUNCEMENTS.length * 14}s` }}
          >
            {group(false)}
            {group(true)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "Resume scrolling announcements" : "Pause scrolling announcements"}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center sm:size-10",
            "text-muted-inverse transition-colors duration-150 hover:text-ink-inverse",
          )}
        >
          {paused ? (
            <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden="true" focusable="false">
              <path d="M1 1l9 5-9 5V1Z" fill="currentColor" />
            </svg>
          ) : (
            <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true" focusable="false">
              <path d="M1 1h2.5v10H1zM6.5 1H9v10H6.5z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
