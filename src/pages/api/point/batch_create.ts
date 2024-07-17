import { NextApiRequest, NextApiResponse } from 'next'
import authMiddleware from '@/middleware/authMiddleware'
import { handlerBatchCreate } from './handler'

function batchCreate(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  if (method === 'POST') {
    return handlerBatchCreate(req, res)
  }
  res.status(404).json({ error: 'Not found' })
}

export default authMiddleware(batchCreate)
