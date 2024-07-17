import { NextApiRequest, NextApiResponse } from 'next'
import { isValidUser } from '@/lib/api/user'
import { err, ok } from '@/lib/server-utils'
import { checkPoint } from '@/lib/api/point'

export default async function Check(req: NextApiRequest, res: NextApiResponse) {
  return await isValidUser(req, res, async user => {
    try {
      const { types } = req.body
      for (const type of types) {
        await checkPoint({ uuid: user.uuid, type })
      }
      return ok(res)
    } catch (e) {
      return err(res, { message: 'Check error' })
    }
  })
}
