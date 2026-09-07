import type { SVGProps } from 'react'

/** South Indian filter: lid, upper chamber, perforated plate, tapered tumbler. */
export default function CoffeeFilterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 1.6v1.5" />
      <rect x="6.3" y="3.1" width="11.4" height="2.3" rx="1.15" />
      <path d="M7.7 5.4h8.6v6.2H7.7z" />
      <path d="M9.7 8.5h4.6" />
      <path d="M7.7 11.6h8.6l-.9 8.1a1.7 1.7 0 0 1-1.7 1.5h-3.4a1.7 1.7 0 0 1-1.7-1.5z" />
    </svg>
  )
}
