import { SESSION_DELAY } from '@/config/server/auth-config'
import { generateRandom, getExpires, setCookie, _cookies } from '@/lib/server-utils'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const nonce = generateRandom()
  setCookie(res, {
    name: _cookies['nonce'].name,
    value: nonce,
    options: {
      sameSite: 'lax',
      path: '/',
      expires: getExpires(SESSION_DELAY),
    },
  })
  res.status(200).json({
    value: nonce,
  })
}
