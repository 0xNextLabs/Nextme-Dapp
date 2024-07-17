import { fetcher } from '@/lib/fetcher'

/**
 * 查询name对应的twitter数据
 * @param data
 * @returns
 */
export function getTwitterUserSvc(data) {
  return fetcher({
    url: 'api/studio/twitter_user',
    params: data,
  })
}

export function getPointRulesSvc() {
  return fetcher({
    url: '/api/point/rules',
    method: 'post',
  })
}

export function addPointDataSvc(data) {
  return fetcher({
    url: '/api/point/add',
    method: 'post',
    data,
  })
}

export function updatePointRuleSvc(data) {
  return fetcher({
    url: '/api/point/rule/update',
    method: 'post',
    data,
  })
}

export function deletePointRuleSvc(data) {
  return fetcher({
    url: '/api/point/rule/delete',
    method: 'post',
    data,
  })
}

export function addPointRuleSvc(data) {
  return fetcher({
    url: '/api/point/rule/add',
    method: 'post',
    data,
  })
}

export const checkPointSvc = data => {
  return fetcher({
    url: 'api/point/record/check',
    method: 'post',
    data,
  })
}
