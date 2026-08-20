import { Share2 } from 'lucide-react'
import { ActionIconButton } from './action-btn'

export function ShareButton() {
  function onShare() {}

  return <ActionIconButton text="share" icon={Share2} onClick={onShare} />
}
