import { getOneUserByUuid } from '@/lib/api/user'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query as { userId: string }
  if (userId) {
    const user = await getOneUserByUuid(userId)
    if (user) {
      return res.status(200).json({
        status: user.did !== undefined,
      })
    } else {
      return res.status(200).json({
        status: false,
      })
    }
  } else {
    return res.status(200).json({ status: false })
  }
}
