import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useDynamicExampleContract, useNetworkType, useUserData, userMintStatus } from '.'
import { useSnackbar } from '@/components/context/snackbar'
import { getUserProIdentity, getUserProSubmit } from '@/services/user'
import { setUserInfo } from '@/store/slice/user'
import { CONTRACT_ADDRESSES } from '../types/address'
import { useCacheStore } from '../api/cache'
import { userIsMember } from '../utils'

import config from '@/config'

export const useIsMember = (user: any): boolean => useMemo(() => userIsMember(user?.member), [user])

/**
 * 通过给定用户个人信息获得是否为pro权益用户
 * @param user 用户个人信息 传入user是因为落地页可能无法通过redux获取user信息
 * @returns
 */
export const useIsPro = (user?: any): boolean => {
  const { contract } = config
  const { chainId } = contract
  const [isPro, setUserPro] = useState(false)

  user = user || useUserData()

  const DynamicExampleInstance = useDynamicExampleContract(CONTRACT_ADDRESSES, true)
  const isMember = useIsMember(user)
  const dispatch = useAppDispatch()

  const isUserHaveTokenDid = async (): Promise<boolean> => {
    try {
      const userDid: any = Number((await DynamicExampleInstance.tokenOf(user.chain.default?.address))._hex)
      if (userDid) {
        return true
      } else {
        throw Error()
      }
    } catch (error) {
      return false
    }
  }
  useEffect(() => {
    let _isPro = false
    if (user?.pro?.status || user?.pro?.isPro) _isPro = true
    else {
      getUserProIdentity(user.uuid)
        .then(res => {
          if (res?.status || res?.isPro) {
            _isPro = true
          } else if (
            (user?.sbt instanceof Array && user?.sbt.some((sbtItem, _) => sbtItem.chainId == chainId)) ||
            user?.sbt?.chainId == chainId
          ) {
            dispatch(setUserInfo(res.user))
            _isPro = true
          } else if (isMember) {
            _isPro = true
          }
          if (_isPro && !isMember) {
            ;async () => {
              _isPro = await isUserHaveTokenDid()
            }
          }
        })
        .catch(() => {
          _isPro = false
        })
    }
    setUserPro(_isPro)
  }, [])

  return isPro
}

export const useUserProPermission = (user?: any) => {
  const status = useIsPro()
  user = user || useUserData()
  const { showSnackbar } = useSnackbar()
  const cache = useCacheStore()
  const dispatch = useAppDispatch()

  // 处理历史老字段数据
  if (user?.pro?.hasOwnProperty('isPro')) {
    let isPro = user?.pro?.isPro
    delete user?.pro?.isPro
    Object.assign(user?.pro, { status: isPro })
  }
  if (user?.pro?.hasOwnProperty('proConfig')) {
    let proConfig = user?.pro?.proConfig
    delete user?.pro?.proConfig
    Object.assign(user?.pro, { config: proConfig })
  }

  const userProConfig = useMemo(() => user?.pro?.config, [user?.pro])

  const update = async config => {
    let res = await getUserProSubmit(user.uuid, config)
    if (res?.ok) {
      dispatch(
        setUserInfo({
          ...user,
          pro: {
            ...user?.pro,
            config: {
              ...userProConfig,
              ...config,
            },
          },
        })
      )
      cache.refresh('api/studio/dapp')
    }
    showSnackbar({
      snackbar: {
        open: true,
        type: res?.ok ? 'success' : 'error',
        text: res?.data || res?.message,
      },
    })
  }
  return { status, userProConfig, update }
}

/**
 * 获取用户是否已经mint过数据，方式为检查用户是否在合约中已经存在相关的mint数据
 */

export const useUserIsMint = (user?: any): number => {
  const { networkType } = useNetworkType()
  const { contract } = config
  const { chainId } = contract

  user = user || useUserData()
  const cache = useCacheStore()

  const DynamicExampleInstance = useDynamicExampleContract(CONTRACT_ADDRESSES, true)
  const [isMint, setIsMint] = useState(userMintStatus.NOT_GET)
  const dispatch = useAppDispatch()
  //检查用户地址是否曾经进行过mint操作
  const isUserHaveTokenDid = async (): Promise<boolean> => {
    try {
      const userDid: any = Number((await DynamicExampleInstance.tokenOf(user.chain.default.address))._hex)
      if (userDid) {
        return true
      } else {
        throw Error()
      }
    } catch (error) {
      return false
    }
  }
  useEffect(() => {
    if (!user) {
      setIsMint(userMintStatus.NOT_MINT)
      return
    }
    ;(async () => {
      let _mintStatus = userMintStatus.NOT_MINT
      //redux数据未加载完成时不做反应
      try {
        if (!user?.length) {
          _mintStatus = userMintStatus.MINTED
        }
        //用户使用钱包登陆
        if (user?.chain?.default?.address || user?.chain?.sol?.address) {
          //用户在数据库中已存入tokenID 且存储格式为数组 new
          if (
            (user?.sbt instanceof Array && user?.sbt.some((sbtItem, _) => sbtItem.chainId == chainId)) ||
            user?.sbt?.chainId == chainId
          ) {
            _mintStatus = userMintStatus.MINTED
            //用户在数据库中已存入tokenID 存储格式为对象 old
          } else if ((user?.sbt instanceof Object && user?.sbt?.tokenId >= 0) || user?.sbt?.chainId == chainId) {
            _mintStatus = userMintStatus.MINTED
            dispatch(
              setUserInfo({
                sbt: [user?.sbt],
              })
            )
            cache.refresh('api/studio/dapp')
          } else {
            const _isMint = await isUserHaveTokenDid()
            _mintStatus = _isMint ? userMintStatus.MINTED : userMintStatus.NOT_MINT
          }
        } else {
          //在链上进行查询
          //用户未连接过钱包
          _mintStatus = userMintStatus.MINTED
        }
      } catch (error) {
        _mintStatus = userMintStatus.NOT_MINT
      }

      setIsMint(_mintStatus)
    })()
  }, [user, networkType])

  return isMint
}
