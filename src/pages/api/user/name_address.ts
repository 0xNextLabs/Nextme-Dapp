import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function name_address(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body || !req?.body?.address) return
  const { address } = req.body
  const chainType = req?.body?.chainType

  const response = await prisma.users.findFirst({
    where: {
      chain: {
        is: {
          [chainType]: {
            is: {
              address,
            },
          },
        },
      },
    },
  })
  res.status(200).json({
    claimed: response?.username || null,
  })
}
