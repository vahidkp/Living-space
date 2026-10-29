import Link from "next/link";

export type Crumb = { label: string; href?: string };

/**
 * Breadcrumb trail. The current page is the last item and carries no link, with
 * `aria-current="page"` so assistive tech announces it as the current location.
 */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem] text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  // py-1 lifts the target from 16px to 24px tall, meeting
                  // WCAG 2.5.8 without changing the trail's visual rhythm.
                  className="block py-1 transition-colors duration-150 hover:text-ink"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-ink-soft">
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-line">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
