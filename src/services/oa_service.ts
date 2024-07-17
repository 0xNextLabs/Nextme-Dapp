import { fetcher } from '@/lib/fetcher'
import { AUTH_SECRET } from '@/config/server/auth-config'
/**
 * @description label分页查询
 * @param data
 * @param method
 * @returns
 */
const apiLabelPageList = (data, method = 'get') => {
  let query = method === 'get' ? { params: data } : { data }
  return fetcher({
    url: `${process.env.NEXT_PUBLIC_OA_SERVICE}/api/label/page`,
    method,
    ...query,
  })
}

const apiExploreList = (data: ExploreSearch): Promise<BaseResult<Array<ExploreRecord>>> => {
  return fetcher({
    url: `${process.env.NEXT_PUBLIC_OA_SERVICE}/api/explore/list`,
    params: data,
  })
}

const apiTypeList = (): Promise<BaseResult<Array<TypeRecord>>> => {
  return fetcher({
    url: `${process.env.NEXT_PUBLIC_OA_SERVICE}/api/type/list`,
  })
}

/**
 * @description 更新label count
 * @param data
 * @returns
 */
const apiUpdateLabelCount = (data: LabelUpdateCount) => {
  return fetcher({
    url: `${process.env.NEXT_PUBLIC_OA_SERVICE}/api/label/batch_update_count`,
    method: 'PUT',
    data,
    headers: {
      Authorization: AUTH_SECRET,
    },
  })
}

/**
 * @description 更新label user
 * @param data
 * @returns
 */
const apiLabelUserChange = (data: LabelUserChange) => {
  return fetcher({
    url: `${process.env.NEXT_PUBLIC_OA_SERVICE}/api/label_user/change`,
    method: 'POST',
    data,
    headers: {
      Authorization: AUTH_SECRET,
    },
  })
}

const apiPointRules = params => {
  return fetcher({
    url: `${process.env.NEXT_PUBLIC_OA_SERVICE}/api/point_rule/page`,
    params,
    headers: {
      Authorization: AUTH_SECRET,
    },
  })
}

const OAService = {
  apiLabelPageList,
  apiUpdateLabelCount,
  apiExploreList,
  apiTypeList,
  apiLabelUserChange,
  apiPointRules,
}

export default OAService
