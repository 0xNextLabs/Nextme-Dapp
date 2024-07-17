import { NextApiRequest, NextApiResponse } from 'next'
import { updateUserProPermisson } from '@/lib/api/user'
import { err, ok } from '@/lib/server-utils'
import authMiddleware from '@/middleware/authMiddleware'

interface IProIdendityProps extends NextApiRequest {
  body: {
    uuid: string
    config: IUserProPermissionConfig
  }
}

async function user_pro_post(req: IProIdendityProps, res: NextApiResponse) {
  const { uuid, config } = req.body
  if (!uuid || !config) return err(res, { message: 'user uuid error ˙◠˙' })
  try {
    const updateUserProConfigResult = await updateUserProPermisson(uuid, config)
    return updateUserProConfigResult
      ? ok(res, {
          data: 'user pro config update success ᵔ◡ᵔ',
        })
      : err(res, {
          message: 'user pro config update error ˙◠˙',
        })
  } catch (error) {
    return err(res, {
      message: 'user pro config update error ˙◠˙',
    })
  }
}

export default authMiddleware(user_pro_post)
