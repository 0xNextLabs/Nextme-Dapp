import { isValidUser } from '@/lib/api/user'
import prisma from '@/lib/prisma'
import { err, ok } from '@/lib/server-utils'
import { NextApiRequest, NextApiResponse } from 'next'
import authMiddleware from '@/middleware/authMiddleware'

async function list(req: NextApiRequest, res: NextApiResponse) {
  return await isValidUser(req, res, async user => {
    try {
      if (!user.inviteCode) return err(res, { message: 'Not has inviteCode' })
      const list = await prisma.point.findMany({
        where: {
          user_id: user.uuid,
        },
        select: {
          extra: true,
          created_at: true,
          type: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      })
      return ok(res, { data: { list } })
    } catch (e) {
      console.log('list error: ', e)
      return err(res, { message: 'List error' })
    }
  })
}

export default authMiddleware(list)
