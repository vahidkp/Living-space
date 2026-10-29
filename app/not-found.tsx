import { ButtonLink } from "@/components/ui/Button";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * 404. Reached by an unknown product slug via `notFound()` on the PDP, as well
 * as by any unmatched route.
 */
export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow text-muted">Error 404</p>
      <h1 className="mt-4 max-w-lg">We couldn&rsquo;t find that piece</h1>
      <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
        The page you were looking for has moved or no longer exists. The full
        collection is still where you left it.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/shop" variant="solid-dark" size="lg">
          Shop all furniture
        </ButtonLink>
        <ButtonLink href="/" variant="outline" size="lg">
          Back to homepage
        </ButtonLink>
      </div>
    </div>
  );
}
