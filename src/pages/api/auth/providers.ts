import { providers_front } from '@/config/server'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function providers(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(providers_front())
}
