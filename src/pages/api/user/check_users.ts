import type { NextApiRequest, NextApiResponse } from 'next'
import authMiddleware from '@/middleware/authMiddleware'
import prisma from '@/lib/prisma'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req
  const hasUserPaths = Object.hasOwn(query, 'userPaths')
  if (!hasUserPaths) {
    res.status(200).json({
      ok: false,
      message: 'user paths is required',
      code: 400,
    })
  }
  try {
    const userPaths: Array<string> = JSON.parse(query?.userPaths as string)
    if (!Array.isArray(userPaths) || !userPaths.length) {
      res.status(200).json({
        ok: false,
        message: 'user paths must be array',
        code: 400,
      })
    }

    let userList = await prisma.users.findMany({
      where: {
        username: {
          in: userPaths,
          mode: 'insensitive',
        },
      },
      select: {
        username: true,
        uuid: true,
      },
    })

    const userMaps = {}

    userList.forEach(item => {
      userMaps[item.username.toLocaleLowerCase()] = item
    })
    const result = {
      userList: [],
      errorList: [],
    }

    userPaths.forEach(user => {
      if (userMaps[user.toLocaleLowerCase()]) {
        result.userList.push(userMaps[user.toLocaleLowerCase()])
      } else {
        result.errorList.push(user)
      }
    })

    res.status(200).json({
      ok: true,
      data: result,
    })
  } catch (error) {
    console.log(error)
    res.status(200).json({
      ok: false,
      message: 'request error',
      code: 500,
    })
  }
}

export default authMiddleware(handler)
