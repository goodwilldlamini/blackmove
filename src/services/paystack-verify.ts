import { createServerFn } from '@tanstack/react-start'

/**
 * Confirms with Paystack that a transaction really succeeded.
 *
 * The client SDK's `onSuccess` callback is not proof of payment on its own, so
 * every purchase is verified here - server side, with the secret key - before
 * an order is allowed to move to `paid`. PAYSTACK_SECRET_KEY deliberately has
 * no VITE_ prefix so vite never inlines it into the browser bundle.
 *
 * The handler body is stripped from the client bundle by the start plugin and
 * reached over RPC, so this file must NOT use the `.server.ts` suffix - that
 * would block client components from importing the bridge at all.
 */
export const verifyPaystackPayment = createServerFn({ method: 'POST' })
  .validator((data: { reference: string; expectedAmount: number }) => {
    if (!data?.reference) throw new Error('A payment reference is required')
    return data
  })
  .handler(async ({ data }) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY
    if (!secretKey) {
      throw new Error('Payments are not configured, please contact support')
    }

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(data.reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } },
    )
    const body = await res.json().catch(() => null)

    if (!res.ok || !body?.status || body.data?.status !== 'success') {
      throw new Error(
        body?.data?.gateway_response ||
          body?.message ||
          'We could not verify this payment',
      )
    }

    // paystack works in cents
    const paidAmount = (body.data.amount ?? 0) / 100
    if (paidAmount + 0.001 < data.expectedAmount) {
      throw new Error(
        `This payment of R${paidAmount.toFixed(2)} is less than the amount due`,
      )
    }

    return {
      reference: body.data.reference as string,
      amount: paidAmount,
      verifiedAt: new Date().toISOString(),
    }
  })
