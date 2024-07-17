import { NextApiRequest, NextApiResponse } from 'next'
import { getOneUserByName } from '@/lib/api/user'
import { getOaDBCollection } from '@/lib/api/common'
import { isDomainsName } from '@/lib/domain/valid'
import { env } from '@/lib/types/env'

interface CheckUserNAmeProps extends NextApiRequest {
  query: {
    username: string
  }
}

async function name_claimed(req: CheckUserNAmeProps, res: NextApiResponse) {
  const { username } = req?.query
  if (!username) return res.status(503).json({ of: false, message: 'must have username' })
  const user = await getOneUserByName(username)

  if (user) {
    return res.status(200).json({
      ok: true,
      claimed: Boolean(user),
      errCode: 1030,
      message: user,
    })
  } else {
    // 是否为doamins域名
    let listed_domains = isDomainsName(username.toLowerCase())

    if (listed_domains) {
      return res.status(200).json({
        ok: true,
        errCode: 1029,
        claimed: Boolean(user),
        message: user,
      })
    }

    //是否过短
    if (username?.length < ((env.domainLength as number) || 8)) {
      return res.status(200).json({
        ok: false,
        errCode: 1032,
        message: user,
      })
    }
    //是否被注册
    else if (!user) {
      let reservedSecondNames = await getOaDBCollection('domain_list')
      // 不区分大小写
      let reservedSecondRes = await reservedSecondNames
        .find({ path: username })
        .collation({ locale: 'en', strength: 2 })
        .toArray()
      if (reservedSecondRes.length) {
        return res.status(200).json({
          ok: false,
          errCode: 1031,
          message: user,
        })
      }
      return res.status(200).json({
        ok: true,
        errCode: 1029,
        claimed: Boolean(user),
        message: user,
      })
    }
  }
}

export default name_claimed
