import { Gavel, Hash } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { EmptyWidget } from '#/components/empty'
import { SectionCard } from '#/components/section-card'
import { APP_MESSAGES } from '#/lib/app-messages'
import { currencyFormat, dateFormatTime } from '#/lib/helpers'
import type { Listing } from '#/types/auction'
import type { Bid } from '#/types/bid'

export function AuctionBids({ auction }: { auction: Listing }) {
  const bids = auction.bids
    ? ([...(auction.bids as Bid[])].sort((a, b) =>
        a.createdAt > b.createdAt ? -1 : 1,
      ) as Bid[])
    : []
  const leadingAmount = bids.reduce((max, bid) => (bid.amount > max ? bid.amount : max), 0)

  return (
    <SectionCard
      icon={Gavel}
      title="bids"
      height="h-full"
      rightElement={
        <div className="flex items-center gap-1 text-muted-foreground">
          <Hash className="size-3" />
          <span className="text-base font-semibold sm:text-lg">
            {auction.bids?.length || 0}
          </span>
        </div>
      }
    >
      {bids.length < 1 && <EmptyWidget text={APP_MESSAGES.empty.bids} />}
      <div className="flex max-h-92 w-full flex-1 flex-col gap-2 overflow-y-auto">
        {bids.map((bid, index) => {
          const isLeading = bid.amount === leadingAmount
          return (
            <div
              key={`${index}_${bid.uid}_${bid.amount}`}
              className={`flex w-full items-center gap-3 rounded-xl border p-2.5 ${
                isLeading ? 'border-primary bg-primary/10' : 'border-border'
              }`}
            >
              <Avatar>
                <AvatarImage src={bid.user.photoURL} alt={bid.user.name} />
                <AvatarFallback>{bid.user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="truncate text-xs font-semibold sm:text-sm">
                    {bid.user.name}
                  </span>
                  {isLeading && (
                    <Badge className="bg-primary text-primary-foreground">
                      leading
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {dateFormatTime(bid.createdAt)}
                </span>
              </div>
              <span
                className={`text-sm font-semibold sm:text-base ${
                  isLeading ? 'text-primary' : 'text-foreground'
                }`}
              >
                {currencyFormat(bid.amount)}
              </span>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}
