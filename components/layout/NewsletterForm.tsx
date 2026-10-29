"use client";

import { useId, useState } from "react";
import { CheckIcon } from "@/components/ui/Icon";

/**
 * Newsletter capture.
 *
 * There is no mailing-list backend in this phase, so submission is handled
 * locally: validate, then show a confirmation in place of the form. It uses
 * native `type="email"` + `required` validation rather than a bespoke regex, so
 * the browser's own messaging and localisation apply.
 *
 * TO WIRE UP: replace the `onSubmit` body with a POST to the list provider (or
 * a Server Action) and keep the same three states — idle, error, submitted.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const id = useId();

  if (submitted) {
    return (
      <p
        className="flex items-center gap-2.5 text-sm text-ink-inverse"
        role="status"
        aria-live="polite"
      >
        <CheckIcon size={18} className="shrink-0 text-olive-on-dark" />
        Thank you — we&rsquo;ll be in touch.
      </p>
    );
  }

  return (
    <form
      noValidate={false}
      onSubmit={(event) => {
        event.preventDefault();
        if (!email.trim()) return;
        setSubmitted(true);
      }}
      className="flex w-full max-w-md items-stretch border-b border-muted-inverse/50 transition-colors duration-150 focus-within:border-ink-inverse"
    >
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <input
        id={id}
        type="email"
        name="email"
        required
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email address"
        className="min-h-11 w-full bg-transparent py-2.5 pr-3 text-sm text-ink-inverse placeholder:text-muted-inverse"
      />
      <button
        type="submit"
        className="shrink-0 self-stretch px-1 text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-ink-inverse transition-opacity duration-150 hover:opacity-70"
      >
        Subscribe
      </button>
    </form>
  );
}
