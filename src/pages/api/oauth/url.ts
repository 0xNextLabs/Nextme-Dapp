import type { NextApiRequest, NextApiResponse } from 'next'
import { oauth } from '@/lib/server-utils'
import { setCookie } from '@/lib/server-utils/cookie'

export default async function OAuthUrl(req: NextApiRequest, res: NextApiResponse) {
  const { name, ...rest } = req.query
  const { url, cookies } = await oauth.getAuthUrl(name as string, rest as { username: string })
  cookies.forEach(cookie => setCookie(res, cookie))
  res.status(200).json({
    url,
  })
}
