import utc from 'dayjs/plugin/utc'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { Redis } from '@upstash/redis'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { getPayloadByToken } from '@/lib/server-utils/jwt'
import { userIsMember } from '@/lib/utils'
import prisma from '@/lib/prisma'

import config from '@/config'
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

enum UserFound {
  NOT_FOUND = 0,
  FOUND,
  /**
   * username并未绑定该提供商的认证
   */
  FOUND_INACTIVE,
  /**
   * 提供商认证信息不符
   */
  FOUND_BUT_NOT_SAME,
}

dayjs.extend(utc)

export const filterUser = (user: any) => {
  if (!user) return null
  const { _id, id, ...others } = user
  return { ...others }
}

export async function getOneUserByName(username: string) {
  if (!username || !prisma) return
  // 这么做的原因是prisma的insensitive模式本质是正则表达式，这会导致vitalik.eth中的点是任意字符的匹配
  let response = await prisma.users.findMany({
    where: {
      username: {
        equals: username,
        mode: 'insensitive',
      },
    },
  })

  let rep = response.filter(resp => resp.username.toLowerCase() === username.toLowerCase())

  return filterUser(rep[0])
}

export async function getOneUserByProvider(provider: string, id: string) {
  if (!provider || !id) return

  let response = await prisma.users.findFirst({
    where: {
      oauth: {
        is: {
          [`${provider}`]: {
            is: {
              id,
            },
          },
        },
      },
    },
  })

  return filterUser(response)
}

export async function getOneUserByUuid(id: string) {
  if (!id) return
  let response = await prisma.users.findFirst({
    where: {
      uuid: id,
    },
  })

  return filterUser(response)
}

export async function getOneUserByWallet({ chainType, address }: Record<string, string>) {
  if (!address) return
  let response = await prisma.users.findFirst({
    where: {
      chain: {
        is: {
          [chainType]: {
            is: {
              address,
            },
          },
        },
      },
    },
  })

  return filterUser(response)
}

// https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number#:~:text=Try%20the%20isNan%20function%3A,Otherwise%20it%20returns%20false.
const isNumeric = (num: any) =>
  (typeof num === 'number' || (typeof num === 'string' && num.trim() !== '')) && !isNaN(num as number)

/**
 * 限制某个key的访问次数
 */
const check = async (key: string, redis: Redis) => {
  try {
    const cacheContent = await redis.get(key)
    // 增加IP访问限制：默认为24小时内5次(环境变量设置)
    let hour_unit = Number(process.env.IP_LIMIT_HOUR || 24)
    let limit_count = Number(process.env.IP_LIMIT_COUNT || 5)
    hour_unit = !isNumeric(hour_unit) ? 24 : hour_unit
    limit_count = !isNumeric(limit_count) ? 5 : limit_count
    let count = cacheContent ? Number(cacheContent) : undefined

    if (count && isNumeric(count) && count > 0) {
      if (count + 1 > limit_count) {
        // 访问频率过高
        return false
      } else {
        // 增加一个访问次数
        await redis.incr(key)
      }
    } else {
      await redis.set(key, 1, { ex: 60 * 60 * hour_unit })
    }
  } catch (e) {
    // 对于所有upstash/redis的本身报错，不能阻塞用户注册
    console.log(`${key} error: `, e)
  }
  return true
}

/**
 * 限制单点 IP 的注册新用户的次数
 */
export const limitIP = async (req: NextApiRequest, query: Record<string, any>) => {
  let realIP = req.headers['x-forwarded-for']
  let _fp = (req.query?.['_fp'] as string) || (query?.['_fp'] as string)
  if (!_fp) return false

  try {
    // realIP = Array.isArray(realIP) && realIP.length ? realIP[0] : (realIP as string)
    // if (realIP) {
    const redis = Redis.fromEnv()
    // 因为都走同一个代理，所以暂时不用IP限制
    // const ip_result = await check(realIP, redis)
    // if (ip_result) {
    const fp_result = await check(_fp, redis)
    return fp_result
    // }
    // return false
    // } else {
    //   console.log("x-forwarded-for doesn't exist")
    //   return true
    // }
  } catch {
    return true
  }
}

export const addUser = async (props: { req: NextApiRequest; [key: string]: any }) => {
  const { req, query, ...rest } = props
  if (req && process.env.NODE_ENV !== 'development') {
    const checking = await limitIP(req, query)
    if (!checking) return false
  }

  const uuid = uuidv4()
  let _rest
  if (rest?.oauth_signup_type == 'twitter') {
    _rest = {
      ...rest,
      oauth: {
        twitter: {
          id: rest?.oauth?.twitter?.id,
          name: rest?.oauth?.twitter?.name,
          image: rest?.oauth?.twitter?.image,
        },
      },
    }
  } else {
    _rest = {
      ...rest,
    }
  }

  await prisma.users.create({
    data: {
      uuid,
      created_at: dayjs.utc().format(),
      ...(_rest as any),
    },
  })

  return uuid
}

/**
 * 追加一些信息到user
 * 钱包信息或者oauth中新增的三方登录
 */
export const appendToUser = async (props: any) => {
  const { user: originUser, data, isWallet } = props
  const { oauth } = await prisma.users.findFirst({
    where: {
      uuid: originUser?.uuid,
    },
    select: {
      oauth: true,
    },
  })
  if (isWallet) {
    await prisma.users.update({
      where: {
        uuid: originUser?.uuid,
      },
      data: {
        chain: {
          set: data.chain,
        },
      },
    })
  } else {
    await prisma.users.update({
      where: {
        uuid: originUser?.uuid,
      },
      data: {
        oauth: {
          set: {
            ...(oauth || {}),
            ...data,
          },
        },
      },
    })
  }
}

export const appendOathDataToUser = async (props: any) => {
  const { user: originUser, data } = props
  await prisma.users.update({
    where: {
      uuid: originUser?.uuid,
    },
    data: {
      oauth: {
        set: {
          ...(originUser.oauth || {}),
          ...data,
        },
      },
    },
  })
}

export const appendDataToUser = async (props: any) => {
  const { user: originUser, data } = props

  // await users.updateOne(
  //   {
  //     uuid: originUser?.uuid,
  //   },
  //   {
  //     $set: {
  //       ...data,
  //     },
  //   }
  // )
  await prisma.users.update({
    where: {
      uuid: originUser?.uuid,
    },
    data,
  })
}

export async function isValidUser(
  req: NextApiRequest,
  res: NextApiResponse,
  callback: (user: {
    username: string
    uuid: string
    chain?: {
      default: {
        address: string
      }
    }
    inviteCode?: string
    from?: string
  }) => Promise<unknown>,
  edge = false
) {
  const token = await getPayloadByToken(req)
  if (token && token.id) {
    const user = await getOneUserByUuid(token.id)
    if (user && user.uuid && user.username) {
      return await callback(user)
    } else {
      return edge
        ? new Response('Your account is illegal', { status: 400 })
        : res.status(400).json({ message: 'Your account is illegal' })
    }
  } else {
    return edge
      ? new Response('You have to login', { status: 401 })
      : res.status(401).json({ message: 'You have to login' })
  }
}

/**
 * 当用户没有pro字段时 用于初始化
 * @param status 是否为pro用户的初始化
 * @param uuid 用户的uuid
 * @returns boolean 更新是否成功
 */
export const initUserPermission = async (status = false, uuid: string): Promise<Boolean> => {
  const pro_config = {
    hiddenAddress: false,
  }
  try {
    await prisma.users.update({
      where: {
        uuid,
      },
      data: {
        pro: {
          status,
          config: pro_config,
        },
      },
    })
    return true
  } catch (error) {
    return false
  }
}
/**
 * 检测用户是否为pro用户
 * @param uuid 用户uuid
 * @returns status：是否为pro用户 | user：user data
 */
export const checkUserIsPro = async (
  uuid: string
): Promise<{
  status: boolean
  user?: any
}> => {
  const user = await getOneUserByUuid(uuid)
  const { contract } = config
  const { chainId } = contract
  if (user?.pro?.status || user?.pro?.isPro) {
    return {
      status: true,
      user,
    }
  } else {
    if (
      userIsMember(user) ||
      (user?.sbt instanceof Array && user?.sbt.some((sbtItem, _) => sbtItem.chainId == chainId)) ||
      user?.sbt?.chainId == chainId
    ) {
      await initUserPermission(true, uuid)
      return {
        status: true,
        user,
      }
    } else {
      await initUserPermission(false, uuid)
      return {
        status: false,
        user,
      }
    }
  }
}
/**
 * 更新用户pro状态
 * @param uuid 用户uuid
 * @param config 额外配置
 */
export const updateUserProPermisson = async (uuid: string, config): Promise<Boolean> => {
  try {
    const { status, user = {} } = await checkUserIsPro(uuid)
    if (!status) return false
    // 处理历史老字段数据
    if (user?.pro?.hasOwnProperty('isPro')) {
      let isPro = user?.pro?.isPro
      delete user?.pro?.isPro
      Object.assign(user?.pro, { status: isPro })
    }
    if (user?.pro?.hasOwnProperty('proConfig')) {
      let proConfig = user?.pro?.proConfig
      delete user?.pro?.proConfig
      Object.assign(user?.pro, { config: proConfig })
    }
    //
    await prisma.users.update({
      where: {
        uuid,
      },
      data: {
        pro: {
          ...user?.pro,
          config: {
            ...(user?.config || user?.proConfig),
            ...config,
          },
        },
      },
    })
    return true
  } catch (error) {
    return false
  }
}
