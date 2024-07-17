import { NextApiRequest, NextApiResponse } from 'next'
import { isValidUser } from '@/lib/api/user'
import { err, ok } from '@/lib/server-utils'
import { getPoint } from '@/lib/api/point'
import authMiddleware from '@/middleware/authMiddleware'

async function Get(req: NextApiRequest, res: NextApiResponse) {
  return await isValidUser(req, res, async user => {
    try {
      if (!user.inviteCode) return err(res, { message: 'No inviteCode, Please to login again' })
      await getPoint({ user_id: user.uuid })
      return ok(res)
    } catch (e) {
      return err(res, { message: 'Server error' })
    }
  })
}

export default authMiddleware(Get)
