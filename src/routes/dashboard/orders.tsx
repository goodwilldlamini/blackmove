import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { ConfirmDialog } from '#/components/confirm-dialog'
import { EmptyWidget } from '#/components/empty'
import { PageTitle } from '#/components/page-title'
import {
  ORDER_PAYMENT_METHODS,
  ORDER_PAYMENT_METHOD_IDS,
  ORDER_STATUSES,
  ORDER_STATUS_IDS,
  USER_TYPE_IDS,
} from '#/lib/app-data'
import { currencyFormat, dateFormat } from '#/lib/helpers'
import { toast } from '#/lib/toast'
import { appStore } from '#/state/app.store'
import { mainStore } from '#/state/main.store'
import { userStore } from '#/state/user.store'
import type { EdOrder } from '#/types/order'

export const Route = createFileRoute('/dashboard/orders')({
  component: OrdersPage,
})

function OrdersPage() {
  const user = userStore((s) => s.user)
  const myPurchaseOrders = userStore((s) => s.myPurchaseOrders)
  const mySaleOrders = userStore((s) => s.mySaleOrders)
  const allOrders = mainStore((s) => s.orders)

  const isAdmin = user?.type === USER_TYPE_IDS.admin

  // an admin oversees every order, everyone else sees their own two sides
  const orders = isAdmin
    ? allOrders
    : [
        ...mySaleOrders,
        ...myPurchaseOrders.filter(
          (order) => !mySaleOrders.some((el) => el.id === order.id),
        ),
      ].sort(
        (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0),
      )

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <PageTitle text="orders" />
      {orders.length < 1 ? (
        <EmptyWidget text="You have no orders yet" />
      ) : (
        <div className="flex w-full flex-col gap-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

function OrderCard({ order }: { order: EdOrder }) {
  const user = userStore((s) => s.user)
  const setLoading = appStore((s) => s.setLoading)
  const isLoading = appStore((s) => s.isLoading)
  const [showConfirm, setShowConfirm] = useState(false)

  const status = ORDER_STATUSES.find((el) => el.value === order.status)
  const method = ORDER_PAYMENT_METHODS.find(
    (el) => el.value === order.paymentMethod,
  )
  const isAdmin = user?.type === USER_TYPE_IDS.admin
  const isSeller = user?.uid === order.sellerUid
  const isBuyer = user?.uid === order.buyerUid
  const isPaid = order.status === ORDER_STATUS_IDS.paid

  // only the seller or an admin may confirm that an EFT actually landed
  const canConfirmEft =
    order.status === ORDER_STATUS_IDS.awaitingEftConfirmation &&
    order.paymentMethod === ORDER_PAYMENT_METHOD_IDS.eft &&
    (isSeller || isAdmin)

  async function onConfirmPayment() {
    setLoading(true)
    const dbWrite = (await import('#/services/db-write.service')).default
    try {
      await dbWrite.markOrderPaid({
        orderId: order.id!,
        listingId: order.listingId,
        confirmedBy: user?.uid,
      })
      toast.success('Payment confirmed, the listing is marked sold')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full rounded-xl bg-white p-4 shadow-sm">
      <div className="flex w-full items-start gap-3">
        <Avatar className="size-12">
          <AvatarImage src={order.listingCover} alt={order.listingTitle} />
          <AvatarFallback>{order.listingTitle?.[0]}</AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold capitalize">{order.listingTitle}</h3>
            <Badge
              variant="outline"
              className={
                isPaid ? 'border-teal-400 text-teal-700' : 'border-blue-400 text-blue-700'
              }
            >
              {status?.label}
            </Badge>
            <Badge variant="outline">{isSeller ? 'sale' : 'purchase'}</Badge>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>{currencyFormat(order.amount)}</span>
            <span className="capitalize">{method?.label}</span>
            <span>{order.createdAt ? dateFormat(order.createdAt) : ''}</span>
            {order.eftReference && <span>ref: {order.eftReference}</span>}
          </div>

          {order.eftProofUrl && (
            <a
              href={order.eftProofUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-info underline"
            >
              view proof of payment
            </a>
          )}

          {canConfirmEft && (
            <div className="mt-2">
              <Button
                size="sm"
                disabled={isLoading}
                onClick={() => setShowConfirm(true)}
              >
                Confirm EFT payment
              </Button>
            </div>
          )}

          {isBuyer &&
            order.status === ORDER_STATUS_IDS.pendingPayment &&
            order.paymentMethod === ORDER_PAYMENT_METHOD_IDS.eft && (
              <p className="mt-1 text-xs text-warning">
                Awaiting your proof of payment
              </p>
            )}
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        model={{
          title: 'Confirm payment',
          message: `Only confirm once ${currencyFormat(
            order.amount,
          )} has actually reflected. This marks the listing sold and cannot be undone.`,
        }}
        onConfirm={onConfirmPayment}
      />
    </div>
  )
}
