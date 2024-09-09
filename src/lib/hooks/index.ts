/*
 * Copyright (c) 2022 Next Labs. All rights reseved.
 * @fileoverview | 一些自建hooks库
 * @version 0.1 | 2022-07-18 // Initial version.
 * @Date: 2022-07-16 12:33:20
 * @Last Modified by: 0x3Anthony
 * @Last Modified time: 2024-06-28 23:57:20
 */
import { RefObject, useEffect, useMemo, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { Breakpoint, Theme, useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import { useAccount, useChains, useDisconnect } from 'wagmi'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'
import { Network } from 'alchemy-sdk'
import { jwtVerify } from 'jose'
import { setStudioInfo } from '@/store/slice/studio'
import { getSpaceIDReverseNameSvc } from '@/services/common'
import { deepClone, generateId, generateRandomString, getDefaultAvatarUrl, getRandomIntNum } from '@/lib/utils'
import { chainIdToNetWork, payChains } from '@/lib/chains'
import { IShareProps } from '@/lib/types/share'
import { env } from '@/lib/types/env'
import type { AppDispatch, AppState } from '../store'
import { createDynamicContract } from '../web3'
import contract_abi from '../web3/abi.json'
import bit from '../bit'

import { AUTH_SECRET, tokenName } from '@/config/server/auth-config'
import config from '@/config'

const { prefix } = config

type BreakpointOrNull = Breakpoint | null

export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export const useUserData = () => useAppSelector((state: any) => state.user)
export const useStudioData = () => useAppSelector((state: any) => state.studio)
export const useStudioServerData = () => useAppSelector((state: any) => state.studioServer)

export const useMobile = () => useMediaQuery('(max-width:640px)')

export const useScreen = () => {
  const theme: Theme = useTheme()
  const keys: readonly Breakpoint[] = [...theme.breakpoints.keys].reverse()
  return (
    keys.reduce((output: BreakpointOrNull, key: Breakpoint) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key))
      return !output && matches ? key : output
    }, null) || 'xs'
  )
}

export const useLocation = (type = 'host') => {
  const [locationKey, setLocationValue] = useState('')
  useEffect(() => {
    setLocationValue(typeof window !== 'undefined' && window.location[type] ? window.location[type] : '')
  }, [])
  return locationKey
}

export const useRouterStudio = () => sessionStorage.getItem(`${prefix}.bio.create`)

export const useIsUserLogin = () => {
  const [loginLoading, setLoading] = useState(true)
  const [loginStatus, setIsLogin] = useState(false)
  const [uuid, setUUID] = useState('')

  useEffect(() => {
    ;(async () => {
      const userToken = document.cookie.match(new RegExp('(^| )' + tokenName + '=([^;]+)'))
      if (userToken) {
        const token = userToken[2]
        try {
          const verified = await jwtVerify(token, new TextEncoder().encode(AUTH_SECRET))
          if (verified?.payload?.id) {
            setUUID(verified?.payload?.id as string)
            setIsLogin(true)
          } else {
            setIsLogin(false)
          }
        } catch (error) {
          setIsLogin(false)
        }
      }
      setLoading(false)
    })()
  }, [document.cookie])

  return { loginLoading, loginStatus, uuid }
}

/**
 * Dapp内置已支持的Network
 * @returns { networkType,scan }
 */
export const useNetworkType = (id?: number) => {
  const chains = useChains()
  const { sol } = useChainConnect()
  const { chain, chainId } = useAccount()
  let networks = useMemo(() => {
    if (sol) {
      return {
        networkType: 'sol',
        scan: 'https://explorer.solana.com',
      }
    } else if (id) {
      const chainValue = chains.find(item => item.id == id)
      return {
        networkType: chainIdToNetWork(chainId) || Network.ETH_MAINNET,
        scan:
          chainValue?.blockExplorers?.default?.url ||
          chainValue?.blockExplorers?.etherscan?.url ||
          'https://etherscan.io',
      }
    } else {
      return {
        networkType: chainIdToNetWork(chainId) || Network.ETH_MAINNET,
        scan: chain?.blockExplorers?.default?.url || chain?.blockExplorers?.etherscan?.url || 'https://etherscan.io',
      }
    }
  }, [chainId])
  return networks
}

/**
 * 全局wallet连接时链类型及地址，仅适用于唯一钱包连接，如 NmWallet组件，不可用于多个链钱包共存的页面或模块
 */
export const useChainConnect = () => {
  const account = useAccount()
  const { solAddress } = useSolAccount()
  if (account?.address) {
    return {
      address: account.address,
      chainType: 'default',
      chainId: account.chainId,
      evm: true,
    }
  } else if (solAddress) {
    return {
      address: solAddress,
      chainType: 'sol',
      sol: true,
    }
  }
  return { address: null }
}

/**
 * 全局wallet连接状态 包含多链
 * @returns boolean
 */
export const useGlobalWalletConnect = () => {
  const { address, chainType } = useChainConnect()
  const [globalWalletConnect, setWalletConnect] = useState<boolean>()
  useEffect(() => {
    return setWalletConnect(Boolean(address && chainType))
  }, [globalWalletConnect, address, chainType])
  return globalWalletConnect
}

/**
 * EVM Wallet 连接状态
 * @returns
 */
export const useEVMWalletConnect = () => {
  const account = useAccount()
  const chains = useChains()
  const [evmWalletConnect, setEVMWalletConnect] = useState<boolean>()
  useEffect(() => {
    return setEVMWalletConnect(Boolean(account && chains.find(row => row.id === account?.chainId)))
  }, [evmWalletConnect, account?.address, account?.chainId])
  return evmWalletConnect
}

/**
 * Solana链连接状态
 */
export const useSolAccount = () => {
  const { wallet, publicKey, disconnect } = useWallet()
  if (wallet && publicKey) {
    return {
      solDisconnect: disconnect,
      solAddress: publicKey.toBase58(),
    }
  } else {
    return {
      solAddress: '',
    }
  }
}
/**
 * 用户 address list
 */
export const useUserAddress = ({ chain = null }) => {
  let address = []
  if (chain?.default?.address) address.push({ type: 'default', address: chain?.default?.address })
  if (chain?.sol?.address) address.push({ type: 'sol', address: chain?.sol?.address })
  return { addressList: address }
}
/**
 *
 * @param propImage 传入自定义头像
 * @returns
 * @avatar 头像url
 * @isOauth 是否来自于ouath,true是,false不是
 */
type TAvatar = 'default' | 'oauth' | 'custom' | 'nft' | ''

export const useAvatar = (propImage?: string) => {
  const user = useUserData()
  const dispatch = useDispatch()
  const { profile } = useStudioData()
  const [avatar, setAvatar] = useState<string>('')
  const [type, setType] = useState<TAvatar>('default')

  useEffect(() => {
    let picID: number
    if (propImage) {
      setAvatar(typeof propImage == 'number' ? getDefaultAvatarUrl(propImage) : propImage)
      return
    }
    if (profile?.avatar?.type == 'default' || !profile?.avatar?.type) {
      if (profile?.avatar?.url) {
        picID = profile?.avatar?.url
      } else {
        picID = getRandomIntNum(1, env?.avatarTotal)
        dispatch(
          setStudioInfo({
            profile: {
              ...profile,
              avatar: {
                type: 'default',
                url: picID,
              },
            },
          })
        )
      }
      let image = getDefaultAvatarUrl(picID)
      setAvatar(image)
      setType('default')
      return
    } else {
      if (profile?.avatar?.url) {
        let image = profile?.avatar?.url
        setAvatar(image)
        setType(profile?.avatar?.type)
      } else if (user?.oauth && (profile?.avatar?.type == '' || 'oauth')) {
        let image = user.oauth[Object.keys(user?.oauth)[0]]?.image
        image && setAvatar(image)
        setType('oauth')
      }
    }
  }, [avatar, propImage, user.avatar, user.oauth, profile?.avatar?.url, profile?.avatar, profile, dispatch])
  return { avatar, type }
}

/**
 * 查询bit账户
 * @param {address}
 * @returns bit account
 */
export const useBitName = ({ address }) => {
  const [bitName, setBitName] = useState(null)
  useEffect(() => {
    ;(async () => {
      if (!address) return
      let res = await bit.reverse({ key: address })
      if (res && res?.account) setBitName(res?.account)
    })()
  }, [address])
  return bitName
}
/**
 * 查询bnb账户
 * @param {address}
 * @returns bnb account
 */
export const useBNBName = ({ address }) => {
  const [bnbName, setBNBName] = useState(null)
  useEffect(() => {
    ;(async () => {
      if (!address) return
      let res = await getSpaceIDReverseNameSvc({ address })
      if (res?.ok && res?.name) {
        setBNBName(res?.name)
      }
    })()
  }, [address])
  return bnbName
}

export const useBlocksData = () => {
  const studio = useStudioData()
  const blocks = useMemo(
    () => (studio?.blocks && Array.isArray(studio?.blocks) ? (deepClone(studio?.blocks) as Array<any>) : []),
    [studio, studio.blocks]
  )
  return blocks as Record<string, any>[]
}
/**
 * @param key blocks模块key（对应value data类型social[]、link{}、card{}、group[]、career_xxx等4种[]、nft[]、badge[]）
 * @returns 对应模块的数据
 */
export const useFilterBlocksData = <T>(key: string): T | undefined => {
  const blocks = useBlocksData()
  if (Array.isArray(blocks)) {
    const filterItems = blocks.filter(block => block.type === key)
    if (filterItems.length === 0) return undefined
    return filterItems as T
  }
}

/**
 * 更新blocks的data，link,card,group都是可多次添加的
 */
export const useDispatchBlocks = (index?: number) => {
  const dispatch = useAppDispatch()
  let blocks = [...useBlocksData()]
  return (key: string, newData: Record<string, any>, refresh = false) => {
    refresh && (index = blocks.findIndex(block => block.type === key))
    if (index !== undefined && index > -1) {
      blocks[index] = {
        type: key,
        id: blocks[index].id || key + '_' + generateId(),
        ...newData,
      }
    } else {
      blocks.push({
        id: key + '_' + generateId(),
        type: key,
        ...newData,
      })
    }
    dispatch(
      setStudioInfo({
        blocks: [...blocks],
      })
    )
  }
}

export const useRemoveBlocks = () => {
  const dispatch = useAppDispatch()
  let { blocks } = useSelector<any, { blocks: Record<string, any>[] }>((state: any) => state.studio)
  blocks = [...blocks]
  return (key: string, index: number, refresh = false) => {
    refresh && (index = blocks.findIndex(block => block.type === key))
    if (index > -1) {
      blocks.splice(index, 1)
    }
    dispatch(
      setStudioInfo({
        blocks: [...blocks],
      })
    )
  }
}

/**
 * NOT_GET 未获得状态
 * MINTED 已mint
 * NOT_MINT 未mint
 */
export enum userMintStatus {
  NOT_GET,
  MINTED,
  NOT_MINT,
}

//需要钱包连接的方法用此方法调用
export const useDynamicExampleContract = createDynamicContract(contract_abi)

export const useShareLink = () => {
  const routerStudio = useRouterStudio()
  const isMobile = useMobile()
  const onSocialAppShare = async ({ type, url, text }: IShareProps) => {
    const randomSymbol = generateRandomString(4)
    let hashtagsStr = 'Nextme,Web3,Social,Creator,Crypto,NFT,EVM,Solana,Portfolio'
    switch (type) {
      case 'twitter':
        let shareText =
          text ||
          (routerStudio
            ? `I claimed my ultimate all-in-one Social Portal on @NextmeOne %0a%0aCome see and Follow me on Nextme %0a${url}?x_code=${randomSymbol}%0a%0aThanks so much Nextme team 😘%0a%0a`
            : `I found a ultimate all-in-one Social Portal on @NextmeOne %0a%0aCome see and Follow me on Nextme %0a${url}?x_code=${randomSymbol}%0a%0aThanks so much Nextme team 😘%0a%0a`)
        if (isMobile) {
          location.href = `https://twitter.com/intent/tweet?text=${shareText}&hashtags=${hashtagsStr}`
        } else {
          window.open(`https://twitter.com/intent/tweet?text=${shareText}&hashtags=${hashtagsStr}`)
        }
        break
      case 'discord':
        window.open('https://discord.gg/wjBYSyWUXC')
        break
      case 'imessage':
        window.open(`sms://?&body=${url}`)
        break
      case 'telegram':
        window.open(`https://t.me/share/url?url=${url}`)
        break
      default:
        break
    }
  }
  return { onSocialAppShare }
}

function syncScroller(targets, tabIndex) {
  let nodes = Array.prototype.filter.call(targets, item => item instanceof HTMLElement)

  let max = nodes.length
  if (!max || max === 1 || tabIndex !== 2) return
  let sign = 0 // 用于标注

  function event() {
    if (!sign) {
      // 标注为 0 时 表示滚动起源
      sign = max - 1
      // 找到当前滚动index
      const container = this.querySelector('#scrollBlocks')?.children?.[1]

      let currentIndex = 0
      if (container?.children) {
        ;[...container?.children].forEach((sectionRef, index) => {
          const { offsetTop, clientHeight } = sectionRef
          if (this.scrollTop >= offsetTop - clientHeight * (1 / 5)) {
            currentIndex = index
          }
        })
      }

      for (let node of nodes) {
        // 同步所有除自己以外节点 (todo  先屏蔽掉preview的同步滚动 屏蔽编辑页面)
        if (
          node !== this &&
          node.id === 'preview' &&
          !this.querySelector('#scrollBlocks')?.classList?.contains('hidden')
        ) {
          node.scrollTop =
            node.querySelector('#previewSection')?.children?.[currentIndex === 0 ? 0 : currentIndex + 1]?.offsetTop -
            node.offsetTop
        }
      }
    } else --sign // 其他节点滚动时 标注减一
  }

  nodes.forEach(ele => {
    ele.addEventListener('scroll', event)
  })

  return () => {
    nodes.forEach(ele => {
      ele.removeEventListener('scroll', event)
    })
  }
}

export const useSyncScrollerEffect = (refs, tabIndex) => {
  const targets = refs.map(item => item.current ?? item)

  useEffect(() => {
    // @ts-ignore
    return syncScroller(targets, tabIndex)
  }, [targets])
}

export const useRouteEndPath = () => {
  const router = useRouter()
  let routerMaps = {
    explore: { name: 'Gallery' },
  }
  let paths = (router?.pathname && router?.pathname.split('/')) || [],
    end = paths[paths.length - 1]
  if (routerMaps?.[end]?.name) end = routerMaps?.[end]?.name
  return end && !end.includes('[username]') ? ` ${end.replace(end[0], end[0].toUpperCase())}` : ''
}

interface Args extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false }: Args
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  const frozen = entry?.isIntersecting && freezeOnceVisible

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry)
  }

  useEffect(() => {
    const node = elementRef?.current // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node)

    return () => observer.disconnect()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef, JSON.stringify(threshold), root, rootMargin, frozen])

  return entry
}

// 通过路由去获取invitekey，并在本地进行存储持久化，当进入studio之后，将会被删除
export const useInviteKey = () => {
  const router = useRouter()
  const [inviteKey, setInviteKey] = useState(
    String(router?.query?.from || '') || localStorage.getItem(`${prefix}_inviteKey`) || ''
  )
  const removeInviteKey = () => localStorage.removeItem(`${prefix}_inviteKey`)
  useEffect(() => {
    if (router?.query?.from) {
      setInviteKey(String(router?.query?.from || ''))
      localStorage.setItem(`${prefix}_inviteKey`, String(router?.query?.from))
    }
  }, [router?.query?.from])
  return { inviteKey, removeInviteKey }
}

/**
 * payment chain switch
 */

export const useInitPayChainIndex = () => {
  const router = useRouter()

  const getInitialChainIndex = () => {
    let chainName = router.query.chain

    if (Array.isArray(chainName)) {
      chainName = chainName[0] // 如果是数组，取第一个元素
    }

    chainName = chainName?.replace(/_/g, ' ').toLowerCase() // 将下划线替换为空格

    const index = payChains.findIndex(chain => chain.name.toLowerCase() == chainName)
    return index !== -1 ? index : 0 // 如果找不到匹配的 chain，默认返回 0
  }

  return getInitialChainIndex()
}
