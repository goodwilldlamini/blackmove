// SweetAlert2-specific styling fields (icon, iconColor, confirmButtonColor,
// cancelButtonColor) were dropped — the shadcn AlertDialog that replaces
// SweetAlert2 is styled with Tailwind/theme tokens, not per-call JS config.
export interface AlertModel {
  message: string
  title?: string
  confirmButtonText?: string
  cancelButtonText?: string
  cancelButton?: boolean
}
