import { toast as sonnerToast } from 'sonner'

export const toast = {
  success: (message: string, id?: string) =>
    sonnerToast.success(message, { id }),
  error: (message: string, id?: string) => sonnerToast.error(message, { id }),
  warning: (message: string, id?: string) =>
    sonnerToast.warning(message, { id }),
  info: (message: string, id?: string) => sonnerToast.info(message, { id }),
}
