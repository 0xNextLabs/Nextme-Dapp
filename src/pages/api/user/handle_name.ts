import type { NextApiRequest, NextApiResponse } from 'next'
import { getOaDBCollection } from '@/lib/api/common'
import { env } from '@/lib/types/env'
import { getOneUserByName } from '@/lib/api/user'
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

export default async function handle_name(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body || !req.body?.username) return
  const { username, address } = req.body
  let response = {
    claim: false,
    errCode: 1030,
  }

  let user = await getOneUserByName(username)
  // 被注册直接返回
  if (user) {
    response['chain'] = user?.chain
    res.status(200).json(response)
    return
  }

  // 1. 是否过短
  if (username?.length < env.domainLength) {
    response.errCode = 1032
  }

  // 2. 是否被注册
  if (!user && response.errCode !== 1032) {
    response.claim = true
    response.errCode = 1029
  }

  // 3. 是否是保留域名
  let reservedSecondNames = await getOaDBCollection('domain_list')

  // 不区分大小写
  let reservedSecondRes = await reservedSecondNames
    .find({ path: username })
    .collation({ locale: 'en', strength: 2 })
    .toArray()
  if (reservedSecondRes.length) {
    response.claim = address ? Boolean(reservedSecondRes.find(item => item.address === address)) : false
    response.errCode = address && Boolean(reservedSecondRes.find(item => item.address === address)) ? 1029 : 1031
  }

  if (user && user?.chain) {
    response['chain'] = user?.chain
  }

  res.status(200).json(response)
}
