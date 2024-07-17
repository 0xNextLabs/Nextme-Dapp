import { goerli, mainnet } from 'wagmi/chains'

export const CONTRACT_ADDRESSES = {
  //测试
  [goerli.id]: process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS,
  [mainnet.id]: process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS,
}
