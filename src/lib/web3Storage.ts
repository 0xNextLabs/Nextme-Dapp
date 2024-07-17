import { CONTRACT_ADDRESSES } from '@/lib/types/address'

// 根据链id以及tokenID获取链接
export const getOpenSeaUrl = (tokenId: string, chainID: number): string => {
  switch (chainID) {
    case 5:
      return `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESSES}/${tokenId}`
    default:
      return `https://opensea.io/assets/ethereum/${CONTRACT_ADDRESSES}/${tokenId}`
  }
}

export const getCidUrl = (cid: string, fileName: string): string => {
  return `https://${cid}.ipfs.w3s.link/${fileName}`
}
