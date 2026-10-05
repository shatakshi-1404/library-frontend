import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Base({ size = 18, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const SearchIcon = (p: IconProps) => (
  <Base {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Base>
)
export const PlusIcon = (p: IconProps) => (
  <Base {...p}><path d="M12 5v14M5 12h14" /></Base>
)
export const CameraIcon = (p: IconProps) => (
  <Base {...p}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></Base>
)
export const UploadIcon = (p: IconProps) => (
  <Base {...p}><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></Base>
)
export const RefreshIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 11a8 8 0 0 0-14.5-4M4 4v4h4" />
    <path d="M4 13a8 8 0 0 0 14.5 4M20 20v-4h-4" />
  </Base>
)
export const PencilIcon = (p: IconProps) => (
  <Base {...p}><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></Base>
)
export const TrashIcon = (p: IconProps) => (
  <Base {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Base>
)
export const StarIcon = (p: IconProps) => (
  <Base {...p}><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" /></Base>
)
export const XIcon = (p: IconProps) => (
  <Base {...p}><path d="M6 6l12 12M18 6 6 18" /></Base>
)
export const LogOutIcon = (p: IconProps) => (
  <Base {...p}><path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9" /></Base>
)
export const SunIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Base>
)
export const MoonIcon = (p: IconProps) => (
  <Base {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" /></Base>
)
export const BookIcon = (p: IconProps) => (
  <Base {...p}><path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" /><path d="M5 17a3 3 0 0 1 3-3h10" /></Base>
)
export const EyeIcon = (p: IconProps) => (
  <Base {...p}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Base>
)
export const EyeOffIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    <path d="M3 3l18 18" />
  </Base>
)
