import { fetcher } from '@/lib/fetcher'

export const checkOrCreateDIDSvc = data => {
  return fetcher({
    url: 'api/did/check',
    method: 'post',
    data,
  })
}
