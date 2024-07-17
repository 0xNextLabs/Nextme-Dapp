import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { getOneUserByName } from '@/lib/api/user'
import authMiddleware from '@/middleware/authMiddleware'

async function editor(req: NextApiRequest, res: NextApiResponse) {
  let { uuid, username, status, ...updateData } = req.query
  if (!uuid) {
    return res.status(400).json({
      ok: false,
      message: 'uuid is required',
    })
  }

  let statusNumber: number | undefined
  if (typeof status === 'string') {
    statusNumber = parseInt(status)
  }
  const { status: _, ...restOfUpdateData } = updateData // 使用 _ 丢弃 status 字段

  uuid = Array.isArray(req.query.uuid) ? req.query.uuid[0] : req.query.uuid
  username = Array.isArray(req.query.username) ? req.query.username[0] : req.query.username
  status = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status

  if (username) {
    const existingUser = await getOneUserByName(username)

    if (existingUser) {
      return res.status(400).json({
        ok: false,
        message: 'username already exists',
      })
    }
  }

  try {
    const updatedUser = await prisma.users.update({
      where: { uuid },
      data: {
        ...restOfUpdateData,
        ...(statusNumber !== undefined ? { status: statusNumber } : {}),
      },
    })

    return res.status(200).json({
      ok: true,
      message: 'update success ᵔ◡ᵔ',
      data: updatedUser,
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'update error',
    })
  }
}

export default authMiddleware(editor)
