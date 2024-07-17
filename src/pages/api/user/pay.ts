import type { NextApiRequest, NextApiResponse } from 'next'
import { getDBCollection } from '@/lib/api/common'
import { getOneUserByUuid } from '@/lib/api/user'
import { err, ok, _cookies } from '@/lib/server-utils'
import { addPoint } from '@/lib/api/point'
import { formatObjToArray } from '@/lib/utils'
import authMiddleware from '@/middleware/authMiddleware'
import { getPayloadByToken } from '@/lib/server-utils/jwt'

async function Pay(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body) return
  const result = await getPayloadByToken(req)
  if (!result) return err(res, { message: 'Please login again' })
  const { id } = result
  if (!id) return err(res, { message: 'Please login again' })
  const { tokenId, hash, chainId, url } = req.body
  const user = await getOneUserByUuid(id)
  try {
    if (user) {
      if (user.sbt && formatObjToArray(user?.sbt)[0].tokenId) {
        return err(res, { message: 'Current user has already minted minted pay card' })
      }
      let users = await getDBCollection()
      await users.updateOne(
        { uuid: id },
        {
          $set: {
            sbt: {
              tokenId,
              hash,
              chainId,
              url,
            },
          },
        },
        { upsert: true }
      )
      await addPoint({ type: 3, uuid: user.uuid, opt: user.uuid })
      return ok(res)
    } else {
      return err(res, { message: 'User not found' })
    }
  } catch (e) {
    return err(res, { message: 'Update Pay Card error' })
  }
}

export default authMiddleware(Pay)
