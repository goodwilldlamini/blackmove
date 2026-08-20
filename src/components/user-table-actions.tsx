import { Check, X } from 'lucide-react'
import { TableAction } from '#/components/data-table/table-action-btn'
import { basicUserDetails } from '#/lib/helpers'
import { toast } from '#/lib/toast'
import { NotificationType } from '#/types/core/notification'
import type { EdUser } from '#/types/user'

export function UserTableActions({ user }: { user: EdUser }) {
  async function onToggleVerification() {
    const dbWrite = (await import('#/services/db-write.service')).default
    try {
      await dbWrite.updateUser({
        uid: user.uid,
        verified: !user.verified,
        verification: !user.verified
          ? null
          : { createdAt: new Date(), by: basicUserDetails(user) },
      })
      await dbWrite.createNotification(user.uid!, {
        createdAt: new Date(),
        type: user.verified
          ? NotificationType.accountDeVerification
          : NotificationType.accountVerification,
      })
      toast.success(`${user.firstname} ${user.verified ? "'s verification revoked" : 'verified'}`)
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <TableAction
      variant={user.verified ? 'default' : 'secondary'}
      tooltip={user.verified ? 'revoke verification' : 'verify'}
      onClick={onToggleVerification}
      icon={user.verified ? X : Check}
    />
  )
}
