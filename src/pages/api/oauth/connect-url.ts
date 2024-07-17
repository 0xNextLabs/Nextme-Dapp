import type { NextApiRequest, NextApiResponse } from 'next'
import { connectOAuth } from '@/lib/server-utils'
import { setCookie } from '@/lib/server-utils/cookie'
import { appendToUser } from '@/lib/api/user'

export default async function OAuthUrl(req: NextApiRequest, res: NextApiResponse) {
  const { name, ...rest } = req.query

  if (rest.isConnect == 'false') {
    const { url, cookies } = await connectOAuth.getAuthUrl(name as string, rest as { username: string })
    cookies.forEach(cookie => setCookie(res, cookie))

    res.status(200).json({
      url,
      ok: true,
    })
  } else {
    try {
      await appendToUser({
        user: { uuid: rest.uuid as string },
        isWallet: false,
        data: {
          [name as string]: null,
        },
      })
      res.status(200).json({
        url: '',
        ok: true,
      })
    } catch (error) {
      res.status(200).json({
        url: 'unconnect error',
        ok: false,
      })
    }
  }
}
