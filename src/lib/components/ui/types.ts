export type Size = 'sm' | 'md' | 'lg'

export type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface DropdownItem {
  value: string
  label: string
  disabled?: boolean
}

export interface NavItem {
  id: string
  label: string
  href?: string
  disabled?: boolean
  badge?: string
}

export interface ToastItem {
  id: string
  title: string
  description?: string
  tone?: Tone
  duration?: number
}
