import { fetcher } from '@/lib/fetcher'

export function getWeb3Token() {
  return fetcher({
    url: 'api/web3/store_file',
    method: 'post',
  })
}

export function createNFTSvc(data: any) {
  return fetcher({
    url: 'api/web3/create_nft_html',
    method: 'post',
    data,
  })
}
