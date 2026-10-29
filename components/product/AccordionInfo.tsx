"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "@/components/ui/Icon";

export type AccordionSection = {
  title: string;
  /** Blank-line-separated paragraphs. */
  body: string;
};

/**
 * Product info accordion: Description, Materials & Care, Dimensions, Shipping.
 *
 * "Description" is expanded by default and the rest collapsed, per the
 * pdb-gallery-builder skill's default. Sections open independently — closing one
 * to read another would be irritating when comparing dimensions to materials.
 *
 * Built on real `<button>` elements with `aria-expanded` / `aria-controls`
 * wiring, so Enter and Space work natively.
 *
 * The panel animates on `grid-template-rows` rather than `height`, which lets
 * the content size itself without measuring it in JS.
 */
export function AccordionInfo({ sections }: { sections: AccordionSection[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  const toggle = (index: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="divide-y divide-line border-y border-line">
      {sections.map((section, index) => {
        const isOpen = open.has(index);
        const headingId = `${baseId}-heading-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={section.title}>
            <h3>
              <button
                type="button"
                id={headingId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="text-[0.875rem] font-medium text-ink">
                  {section.title}
                </span>
                <span className="shrink-0 text-ink-soft" aria-hidden="true">
                  {isOpen ? <MinusIcon size={17} /> : <PlusIcon size={17} />}
                </span>
              </button>
            </h3>

            {/*
              Animating `grid-template-rows` from 0fr to 1fr lets the panel slide
              open at its natural content height with no JS measurement.

              `hidden` would be the obvious way to hide the collapsed content,
              but display:none cannot transition — so `inert` does that job
              instead: it takes the collapsed panel out of the tab order and the
              accessibility tree while leaving it rendered and animatable.
            */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={headingId}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div
                className={cn(
                  "overflow-hidden transition-opacity duration-200 ease-out",
                  isOpen ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="pb-5">
                  {section.body.split("\n\n").map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="text-[0.875rem] leading-relaxed text-ink-soft [&:not(:first-child)]:mt-3"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
