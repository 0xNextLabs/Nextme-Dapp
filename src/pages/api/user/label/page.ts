import OAService from '@/services/oa_service'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * 代理接口
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await OAService.apiLabelPageList(req.query)
    res.status(200).json(result)
  } catch (error) {
    res.status(200).json({ ok: false, message: 'proxy error' })
  }
}
