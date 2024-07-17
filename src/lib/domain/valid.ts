import { getSpaceIDReverseNameSvc } from '@/services/common'
import { getEnsAddressForEnsName, getEnvSplit } from '../utils'
import { getAddressByLensHandle } from '../web3/lensClient'
import { env } from '../types/env'
import bit from '../bit'

// 一级保留关键字（暂不开放）
let reserves_names = getEnvSplit(env?.reservedFirstNames) || []

// 一级保留路由（业务页面路径相关）
let reserves_routes = getEnvSplit(env?.reservedRouteNames) || []

export const isValidUserName = (
  val: string
): {
  status: boolean
  message?: string
  type?: 'listed_domains'
} => {
  if (val) {
    let val_toLowerCase = val.toLowerCase()
    let listed_domains = isDomainsName(val_toLowerCase)
    if (
      !/^[\w.-]+$/.test(val) ||
      val.startsWith('-') ||
      val.startsWith('.') ||
      val.endsWith('-') ||
      val.endsWith('.') ||
      val.includes('.-') ||
      val.includes('-.')
    ) {
      return { status: false, message: 'illegal character input' }
    } else if (val?.length > 32) {
      return { status: false, message: 'characters are limited to length 32' }
    } else if (reserves_routes.includes(val) || reserves_routes.includes(val_toLowerCase)) {
      return { status: false, message: 'illegal & conflicting route' }
    } else if (!listed_domains && reserves_names.find(row => row && val_toLowerCase.includes(row.toLowerCase()))) {
      return { status: false, message: 'unopened keywords' }
    } else if (listed_domains) {
      return { status: true, type: 'listed_domains' }
    } else {
      return {
        status: true,
      }
    }
  }
  return { status: false, message: 'username can not be empty' }
}
/**
 * 判断用户名是否属于ens/bit/lens/spaceid 类别的域名并验证有效性
 * @param req
 * @param res
 * @returns 返回值 true 有效（未使用ens类别域名或者是验证通过） false 域名无效
 */
export const isValidUserNameForDomain = async ({
  username,
  address,
  chainType,
}: {
  username: string
  address: string
  chainType: string
}): Promise<boolean> => {
  let username_toLowerCase = username.toLowerCase()
  if (
    username_toLowerCase.endsWith('.eth') ||
    username_toLowerCase.endsWith('.bit') ||
    username_toLowerCase.endsWith('.bnb') ||
    username_toLowerCase.endsWith('.lens')
  ) {
    if (chainType !== 'default') return false
    try {
      if (username_toLowerCase.endsWith('.eth')) {
        const addressForEnsName = await getEnsAddressForEnsName(username)
        return addressForEnsName && addressForEnsName == address
      } else if (username_toLowerCase.endsWith('.bnb')) {
        let { name } = await getSpaceIDReverseNameSvc({ address })
        return name && name == username
      } else if (username_toLowerCase.endsWith('.bit')) {
        let res = await bit.reverse({ key: address })
        return res && res.account == username
      } else if (username_toLowerCase.endsWith('.lens')) {
        let lensOwner = await getAddressByLensHandle(username)
        return Boolean(lensOwner) && lensOwner === address
      }
    } catch (error) {
      return false
    }
  } else {
    return true
  }
}

export const isDomainsName = (username: string): boolean => {
  if (!username) return false
  const usernameForLowerCase = username.toLowerCase()
  return (
    usernameForLowerCase.endsWith('.eth') ||
    usernameForLowerCase.endsWith('.bnb') ||
    usernameForLowerCase.endsWith('.bit') ||
    usernameForLowerCase.endsWith('.lens')
  )
}
