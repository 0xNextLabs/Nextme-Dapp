import { NextApiRequest, NextApiResponse } from 'next'
import authMiddleware from '@/middleware/authMiddleware'
import OAService from '@/services/oa_service'

async function rules(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { ok, data } = await OAService.apiPointRules({ pageNumber: 1, pageSize: 1000 })
    if (ok) {
      res.status(200).json({ ok: true, data: data.records })
    } else {
      res.status(200).json({ ok: true, data: [] })
    }
  } catch (error) {
    res.status(200).json({ ok: false, message: 'proxy error' })
  }
}

export default authMiddleware(rules)
