import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'
import { getOneUserByUuid } from '@/lib/api/user'
import { getUserStudioByUuid } from '@/lib/api/studio'
import authMiddleware from '@/middleware/authMiddleware'
import { getPayloadByToken } from '@/lib/server-utils/jwt'
import { tokenName } from '@/config/server/auth-config'
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

async function dapp(req: NextApiRequest, res: NextApiResponse) {
  const token = await getPayloadByToken(req)
  if (!token || !token?.id) {
    res.setHeader(
      'set-cookie',
      serialize(tokenName, null, {
        path: '/',
      })
    )
    // tea.report('校验未通过')
    return res.status(400).json({ message: 'token illegal' })
  }

  //   tea.report(`开始获取用户信息: ${token.id || ''}`)
  const user = await getOneUserByUuid(token.id)
  if (!user) {
    res.setHeader(
      'set-cookie',
      serialize(tokenName, null, {
        path: '/',
      })
    )
    // tea.report('找不到该用户')
    return res.status(400).json({ message: 'user not found' })
  }

  if (user?.uuid) {
    const studio = await getUserStudioByUuid(user.uuid)

    return res.status(200).json({
      ok: true,
      data: {
        user,
        studio,
      },
    })
  }

  return res.status(400).json({ message: 'user not found' })
}

export default authMiddleware(dapp)
