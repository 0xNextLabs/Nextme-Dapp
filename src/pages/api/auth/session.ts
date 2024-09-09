import type { NextApiRequest, NextApiResponse } from 'next'
import { err, getExpires, ok, setCookie } from '@/lib/server-utils'
import authMiddleware from '@/middleware/authMiddleware'
import { getPayloadByToken, signToken } from '@/lib/server-utils/jwt'
import { SESSION_DELAY, tokenName } from '@/config/server/auth-config'

async function session(req: NextApiRequest, res: NextApiResponse) {
  const token = await getPayloadByToken(req)
  if (token && token.id) {
    setCookie(res, {
      name: tokenName,
      value: signToken({ id: token.id }),
      options: {
        sameSite: 'lax',
        path: '/',
        expires: getExpires(SESSION_DELAY),
      },
    })
    return ok(res, {
      redirect: true,
    })
  }
  return err(res, { path: '/gateway/auth-middleware?errorType=1023' })
}

export default authMiddleware(session)
