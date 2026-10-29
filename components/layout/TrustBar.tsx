import { TRUST_ITEMS } from "@/lib/site";
import { TRUST_ICONS } from "@/components/ui/Icon";

/**
 * Service-promise band sitting between the page content and the footer.
 *
 * It used to be a row inside the dark footer. Moved out on request: these are
 * reassurances that belong with the shopping experience, and they read far more
 * strongly on the light tinted panel than as one more grey row buried in the
 * footer alongside the link columns.
 *
 * `bg-bg-alt` gives a three-tone step down the page — cream content, tinted
 * band, dark footer — so the band separates the two without needing a rule.
 * Muted text on that tint measures 4.50:1, which still clears AA (see the
 * contrast table in globals.css).
 *
 * Rendered once in the root layout, so it appears above the footer on all three
 * pages rather than being repeated per page.
 */
export function TrustBar() {
  return (
    <section aria-label="Our service promises" className="bg-bg-alt">
      <div className="shell py-10 lg:py-12">
        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {TRUST_ITEMS.map((item) => {
            const TrustIcon = TRUST_ICONS[item.icon];
            return (
              <li key={item.title} className="flex items-start gap-3.5">
                <TrustIcon size={26} className="mt-0.5 shrink-0 text-olive" />
                <div>
                  <p className="text-[0.8125rem] font-medium text-ink">{item.title}</p>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
