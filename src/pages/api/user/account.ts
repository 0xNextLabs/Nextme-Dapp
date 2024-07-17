import type { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'
import { getDBCollection } from '@/lib/api/common'
import { getOneUserByUuid } from '@/lib/api/user'
import authMiddleware from '@/middleware/authMiddleware'

async function account(req: NextApiRequest, res: NextApiResponse) {
  if (!req?.body?.uuid) {
    res.status(502).json({ ok: false, message: 'did parameter could not be found' })
  }
  const { uuid, address, chainId = 1, chainType = 'default' } = req.body
  const user = await getOneUserByUuid(uuid)
  try {
    if (user) {
      if (user?.chain?.[chainType]?.address) {
        res.status(502).json({ ok: false, message: 'current wallet connected other did' })
      } else {
        let users = await getDBCollection()

        await users.updateOne(
          {
            uuid,
          },
          {
            $set: {
              updated: dayjs.utc().unix(),
              chain: {
                ...user.chain,
                [chainType]: {
                  id: chainId,
                  address,
                },
              },
            },
          },
          { upsert: true }
        )
        res.status(200).json({ ok: true, message: 'wallet connected success ᵔ◡ᵔ' })
      }
    } else {
      res.status(502).json({ ok: false, message: 'user not found' })
    }
  } catch (e) {
    res.status(502).json({
      ok: false,
      message: 'current user can not update address',
    })
  }
}

export default authMiddleware(account)
