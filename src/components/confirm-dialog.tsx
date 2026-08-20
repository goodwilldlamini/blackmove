import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import type { AlertModel } from '#/types/alert'

export function ConfirmDialog({
  open,
  onOpenChange,
  model,
  onConfirm,
  onCancel,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  model: AlertModel
  onConfirm: () => void
  onCancel?: () => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {model.title && (
            <AlertDialogTitle className="capitalize">
              {model.title}
            </AlertDialogTitle>
          )}
          <AlertDialogDescription>{model.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {model.cancelButton !== false && (
            <AlertDialogCancel onClick={onCancel}>
              {model.cancelButtonText || 'No, cancel'}
            </AlertDialogCancel>
          )}
          <AlertDialogAction onClick={onConfirm}>
            {model.confirmButtonText || 'Yes, continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
