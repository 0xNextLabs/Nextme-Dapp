import { fetcher } from '@/lib/fetcher'

export const proxyLabelPageListSvc = (data, method = 'get') => {
  let query = method === 'get' ? { params: data } : { data }
  return fetcher({
    url: `/api/user/label/page`,
    method,
    ...query,
  })
}

export const proxyExploreListSvc = (data?: ExploreSearch): Promise<BaseResult<Array<ExploreRecord>>> => {
  let tempData
  if (data) {
    tempData = { ...data }
    tempData.labels = JSON.stringify(data.labels)
  }
  return fetcher({
    url: `/api/explore/list`,
    params: tempData,
  })
}

export const proxyTypeListSvc = (): Promise<BaseResult<Array<TypeRecord>>> => {
  return fetcher({
    url: `/api/explore/type_list`,
  })
}
