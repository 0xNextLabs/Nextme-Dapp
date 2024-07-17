import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function landing(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { chain, chainId, amount, symbol, contract, username, message, signature, payer } = req.body

    if (!chain || !amount || !contract || !username || !signature || !payer) {
      res.status(502).json({
        ok: false,
        message: 'Invalid payment request',
      })
    }

    try {
      let payee = await prisma.payee.findUnique({
        where: {
          username,
        },
      })

      // 如果未找到与提供的 username 相关的 payee，则创建一个新的 payee 记录
      if (!payee) {
        payee = await prisma.payee.create({
          data: {
            username,
          },
        })
      }

      const payment = await prisma.payment.create({
        data: {
          chain,
          chainId,
          amount,
          contract,
          symbol,
          message,
          payeeId: payee.id,
          payer,
          signature,
        },
      })

      res.status(201).json({
        ok: true,
        message: 'Payment submitted success ᵔ◡ᵔ',
        paymentId: payment.id,
      })
    } catch (error) {
      console.error('Error submitting payment:', error)
      res.status(500).json({
        ok: false,
        error: 'Failed to submit payment ˙◠˙',
      })
    }
  } else if (req.method === 'GET') {
    const { username } = req?.query

    if (!username) {
      res.status(400).json({
        ok: false,
        message: 'Invalid payment request ˙◠˙',
      })
    }
    try {
      const payments = await prisma.payment.findMany({
        where: {
          payee: {
            username: String(username),
          },
        },
        orderBy: {
          createdAt: 'desc', // 或者 'asc'，以指定升序或降序排列
        },
      })
      res.status(200).json({ ok: true, data: payments })
    } catch (error) {
      console.error('Error fetching payments:', error)
      res.status(500).json({ ok: false, error: 'Server error' })
    }
  } else {
    res.status(405).json({
      ok: false,
      error: 'Method not allowed',
    })
  }
}
