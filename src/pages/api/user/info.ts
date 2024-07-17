import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import authMiddleware from '@/middleware/authMiddleware'

/**
 * @description 查询用户信息
 * @param req
 * @param res
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req
  try {
    let uuid = (query?.uuid as string) || ''
    let user = await prisma.users.findFirst({
      where: {
        uuid,
      },
    })
    res.status(200).json({
      ok: true,
      data: user ?? {},
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      message: 'request error',
    })
  }
}

export default authMiddleware(handler)
