// https://nextjs.org/docs/basic-features/data-fetching/client-side
import { fetcher } from '@/lib/fetcher'

/**
 * 查询当前username是否被认领
 * @param data
 * @returns
 */
export function getUserHandleNameSvc(data) {
  return fetcher({
    url: 'api/user/handle_name',
    method: 'post',
    data,
  })
}
/**
 * 获取对应钱包地址认领的username
 * @param data
 * @returns
 */
export function getUserNameAddressSvc(data) {
  return fetcher({
    url: 'api/user/name_address',
    method: 'post',
    data,
  })
}
/**
 * 更新用户钱包、oauth等信息
 * @param data
 * @returns
 */
export function getUserAccountSvc(data) {
  return fetcher({
    url: 'api/user/account',
    method: 'post',
    data,
  })
}

/**
 * 查询/更新当前用户的studio信息
 * @param data
 * @returns
 */
export function getUserStudioSvc(data, method = 'get') {
  let query = method === 'get' ? { params: data } : { data }
  return fetcher({
    url: 'api/user/studio',
    method,
    ...query,
  })
}

export function getUserInfoSvc(data, method = 'get') {
  let query = method === 'get' ? { params: data } : { data }
  return fetcher({
    url: 'api/user/info',
    method,
    ...query,
  })
}

export function updatePaySvc(data: { tokenId: number; hash: string; chainId: number; url?: string }) {
  return fetcher({
    url: 'api/user/pay',
    method: 'post',
    data,
  })
}

export function getUserStatisticsSvc() {
  return fetcher({
    url: 'api/user/statistics',
  })
}

export function getUserProIdentity(uuid: string) {
  return fetcher({
    url: 'api/user/pro/user_pro_info',
    method: 'post',
    data: {
      uuid,
    },
  })
}

export function getUserProSubmit(uuid: string, config: IUserProPermissionConfig) {
  return fetcher({
    url: 'api/user/pro/user_pro_post',
    method: 'post',
    data: {
      uuid,
      config,
    },
  })
}

export function getUserNameClaimed({ username }: { username: string }) {
  return fetcher({
    url: 'api/user/name_claimed',
    params: {
      username,
    },
  })
}
