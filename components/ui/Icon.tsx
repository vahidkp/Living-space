import type { SVGProps } from "react";

/**
 * Hand-rolled 1.25px-stroke line icons.
 *
 * A dedicated icon package would be the obvious move, but the performance
 * skill flags icon packs as bundle weight and we need eleven glyphs. These are
 * inline SVG in a Server Component, so they cost zero client JS.
 *
 * All are decorative by default (`aria-hidden`), because every icon in this
 * design sits beside a visible text label. The one exception is the header's
 * icon-only controls, which carry their own `aria-label` on the button.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
  </Svg>
);

export const BagIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Svg>
);

export const HeartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20s-7-4.4-7-9.3A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.7c0 4.9-7 9.3-7 9.3Z" />
  </Svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 5l7 7-7 7" />
  </Svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 9l7 7 7-7" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const MinusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 13 4 4L19 7" />
  </Svg>
);

export const ExpandIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5" />
  </Svg>
);

export const FilterIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M7 12h10M10 17h4" />
  </Svg>
);

// ── Trust-row icons, keyed to TRUST_ITEMS[].icon ────────────────────────────

export const DeliveryIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </Svg>
);

export const ReturnsIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 10a8 8 0 0 1 14-4" />
    <path d="M4 5v5h5" />
    <path d="M20 14a8 8 0 0 1-14 4" />
    <path d="M20 19v-5h-5" />
  </Svg>
);

export const WarrantyIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Svg>
);

export const ShowroomIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s7-5.6 7-11a7 7 0 0 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
);

export const TRUST_ICONS = {
  delivery: DeliveryIcon,
  returns: ReturnsIcon,
  warranty: WarrantyIcon,
  showroom: ShowroomIcon,
} as const;

export const InstagramIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="16.8" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
  </Svg>
);

export const FacebookIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.5 8.5h2V5.6h-2.3c-2 0-3.2 1.3-3.2 3.4v1.6H9v2.9h2v8h3v-8h2.2l.4-2.9H14v-1.3c0-.6.2-.8.5-.8Z" />
  </Svg>
);

export const LinkedInIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2.5" />
    <path d="M8 10.5v6M8 7.6v.01M11.6 16.5v-3.4a2 2 0 0 1 4 0v3.4" />
  </Svg>
);

export const PinterestIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M10 17.5 12.2 9M9.8 11.4c0-1.7 1.3-2.9 2.9-2.9 1.7 0 2.8 1.1 2.8 2.7 0 2-1.1 3.5-2.7 3.5-.8 0-1.4-.6-1.2-1.4" />
  </Svg>
);
