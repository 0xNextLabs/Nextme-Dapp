import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import authMiddleware from '@/middleware/authMiddleware'

async function twitter_user(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query || !req.query?.username) return
  const { query } = req
  try {
    let source = await axios.get(`https://mee6.xyz/api/plugins/twitter/search?q=${query.username}`, {
      headers: {
        authorization: process.env.MEE6_AUTHORIZATION,
      },
    })

    if (source?.data && source?.data?.length) {
      res.status(200).json({
        ok: true,
        data: source?.data,
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'request status error:' + error,
    })
  }
}

export default authMiddleware(twitter_user)
