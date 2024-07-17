import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getAppCookies, verifyToken } from '@/lib/server-utils/jwt'

import { AUTH_SECRET, tokenName } from '@/config/server/auth-config'

const authMiddleware = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authorization = req.headers?.authorization
    const cookies = getAppCookies(req)
    if (authorization) {
      if (authorization !== AUTH_SECRET) {
        res.status(200).json({ ok: false, message: 'Authentication failed', code: 403 })
        return // 确保函数在调用 res.json 后结束
      }
    } else {
      if (!cookies || !cookies?.[tokenName]) {
        res.status(200).json({ ok: false, message: 'Token not found', code: 401 })
        return
      }
      const payload = verifyToken(cookies[tokenName])
      if (!payload) {
        res.status(200).json({ ok: false, message: 'Token error', code: 401 })
        return
      }
    }

    return handler(req, res)
  }
}

export default authMiddleware
