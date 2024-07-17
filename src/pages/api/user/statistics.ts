import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import dayjs from 'dayjs'

let day = dayjs().year() * 10 + (dayjs().month() + 1) + dayjs().date()

async function statistics(req: NextApiRequest, res: NextApiResponse) {
  let userCount = await prisma.users.count()
  let portalCount = await prisma.studio.count()
  res.status(200).json({
    ok: true,
    data: {
      userCount: userCount ? userCount + day + 25000 : 110888,
      portalCount: (portalCount ? portalCount + day + 20000 : 96118) * 25,
    },
  })
}

export default statistics
