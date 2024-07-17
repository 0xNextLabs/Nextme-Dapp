import React from 'react'
import { useAccount } from 'wagmi'
import { Avatar, Button } from '@mui/material'
import { useUserData, useGlobalWalletConnect } from '@/lib/hooks'
import { CONTRACT_ADDRESSES } from '@/lib/types/address'
import { formatObjToArray, getNFTOrScanUrl } from '@/lib/utils'

import config from '@/config'

const { domains } = config
interface IProps {
  customClass?: string
  isHighlightBorder?: boolean //高亮border
}

export default function PayLinks({ customClass = '', isHighlightBorder = false }: IProps) {
  const globalWalletConnect = useGlobalWalletConnect()
  const user = useUserData()
  const { chainId } = useAccount()

  const LinkToOtherSide = (type: 'scan' | 'nft') => {
    let userSbtData = {
      chainId: 1,
      tokenId: '',
      hash: '',
    }
    userSbtData = formatObjToArray(user?.sbt)?.find(res => res.chainId == chainId)
    const scanSide = getNFTOrScanUrl({
      type,
      chainId: userSbtData.chainId,
      contractAddress: CONTRACT_ADDRESSES[userSbtData.chainId],
      tokenId: userSbtData.tokenId,
      hash: userSbtData.hash,
    })
    window.open(scanSide)
  }
  const getBtnClasses = () =>
    `${
      isHighlightBorder ? 'bg-sidebar-deepblue scale-[0.985]' : 'border-white'
    } w-full rounded-3xl text-white text-xs flex justify-around px-2`

  const getRainbowBorderClass = () =>
    isHighlightBorder ? 'bg-gradient-to-r from-blue-500 to-green-400 rounded-3xl' : ''

  if (!globalWalletConnect) return
  return (
    <ul className={`grid grid-cols-2 gap-x-4 justify-between ${customClass}`}>
      <li className={getRainbowBorderClass()}>
        <Button variant="outlined" className={getBtnClasses()} onClick={() => LinkToOtherSide('scan')}>
          Etherscan
          <Avatar className="size-7" src={`${domains.cdn}/status/icon_etherscan.png`} />
        </Button>
      </li>
      <li className={getRainbowBorderClass()}>
        <Button variant="outlined" className={getBtnClasses()} onClick={() => LinkToOtherSide('nft')}>
          <span>OpenSea</span>
          <Avatar className="size-7" src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.svg" />
        </Button>
      </li>
    </ul>
  )
}
