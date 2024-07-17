import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { getDefaultAvatarUrl } from '@/lib/utils'
import authMiddleware from '@/middleware/authMiddleware'

async function detail(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req
  try {
    const uuid = (query?.uuid as string) || ''
    const forPay = query?.forPay || ''
    const result = await prisma.studio.findUnique({
      where: {
        uuid,
      },
    })
    const userInfo = await prisma.users.findUnique({
      where: {
        uuid,
      },
    })

    if (result) {
      if (forPay) {
        let avatar = ''
        let { profile } = result
        if (profile.avatar?.type == 'default') {
          avatar = getDefaultAvatarUrl(profile?.avatar?.url as number)
        } else if (profile.avatar?.url as string) {
          avatar = profile.avatar?.url as string
        }
        return res.status(200).json({
          ok: true,
          data: {
            cover: profile?.cover,
            avatar,
            username: profile?.name || userInfo.username || '',
            desc: profile?.description || '',
          },
        })
      } else {
        const obj = {
          uuid: result.uuid,
          avatar: result.profile.avatar?.url || '',
          profileUserName: result.profile?.name || '',
        }
        return res.status(200).json({ ok: true, data: obj })
      }
    } else {
      return res.status(200).json({ message: 'studio not found', ok: true, data: {} })
    }
  } catch (error) {
    return res.status(200).json({ message: 'request error', ok: false, code: 500 })
  }
}

export default authMiddleware(detail)
