import type { NextApiRequest, NextApiResponse } from 'next'
import { fetcher } from '@/lib/fetcher'
import { err, ok } from '@/lib/server-utils'
import { getAPIsOrigin } from '@/lib/utils'
import authMiddleware from '@/middleware/authMiddleware'

async function restore(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddr } = req.query
  if (!walletAddr) return err(res)
  let did_host = getAPIsOrigin('did', req.headers.origin)
  try {
    await fetcher({
      url: `api/restore/${walletAddr}`,
      baseURL: did_host,
    })
    ok(res)
  } catch (e) {
    err(res)
  }
}

export default authMiddleware(restore)
