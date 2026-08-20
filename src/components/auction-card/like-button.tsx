import { arrayRemove, arrayUnion } from 'firebase/firestore'
import { Heart } from 'lucide-react'
import { toast } from '#/lib/toast'
import { userStore } from '#/state/user.store'
import type { Listing } from '#/types/auction'
import { ActionIconButton } from './action-btn'

export function LikeButton({
  auction,
  hideText,
}: {
  auction: Listing
  hideText?: boolean
}) {
  const user = userStore((s) => s.user)
  const isLiked = user ? Boolean(auction.likes?.includes(user.uid)) : false

  async function onToggle() {
    if (!user) {
      toast.error('Login or create an account to save this auction')
      return
    }
    const dbWrite = (await import('#/services/db-write.service')).default
    await dbWrite.updateAuction({
      id: auction.id,
      likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
    })
    toast.success(`Auction ${isLiked ? 'removed from ' : 'added to '} bookmarks`)
  }

  return (
    <ActionIconButton
      text={hideText ? '' : isLiked ? 'saved' : 'save'}
      onClick={onToggle}
      icon={Heart}
      className={isLiked ? 'text-destructive' : undefined}
    />
  )
}
