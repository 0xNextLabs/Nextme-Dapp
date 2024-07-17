import { fetcher } from '@/lib/fetcher'

export function getPaymentOrderSvc(data, method = 'get') {
  let query = method == 'get' ? { params: data } : { data }
  return fetcher({
    method,
    url: 'api/payment/landing',
    ...query,
  })
}
