import { NextApiRequest, NextApiResponse } from 'next'
import { checkUserIsPro } from '@/lib/api/user'
import { err, ok } from '@/lib/server-utils'
import authMiddleware from '@/middleware/authMiddleware'
interface IProIdendityProps extends NextApiRequest {
  body: {
    uuid: string
  }
}

async function user_pro_info(req: IProIdendityProps, res: NextApiResponse) {
  const { uuid } = req.body
  try {
    const userProResult = await checkUserIsPro(uuid)
    if (userProResult.status) {
      return ok(res, { ...userProResult })
    } else {
      return ok(res, { ...userProResult })
    }
  } catch (error) {
    res.status(502).json({ ok: false, message: 'user role check error' })
  }
}

export default authMiddleware(user_pro_info)
