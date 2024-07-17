import { NextApiRequest, NextApiResponse } from 'next'
import authMiddleware from '@/middleware/authMiddleware'
import { getListByType } from './handler'

// OA调用
function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  if (method === 'GET') {
    return getListByType(req, res)
  }
  res.status(404).json({ error: 'Not found' })
}

export default authMiddleware(handler)
