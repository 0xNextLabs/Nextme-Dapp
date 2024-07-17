import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Backdrop, Box, Button, Avatar, Alert } from '@mui/material'
import { useAccount, useSwitchChain } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import NmIcon from '@/components/nm-icon'
import { useModal } from '@/components/nm-modal/ModalContext'
import NmFireWorks from '@/components/nm-firework'
import { TokenHistory } from '@/components/profile/header'
import { useStudioContext } from '@/components/context/studio'
import { useSnackbar } from '@/components/context/snackbar'
import NmGlobalWallet from '@/components/nm-global-wallet'
import { useTempContext } from '@/components/context/temp'
import PayInfo from '../pay-info'
import PayLinks from '../pay-links'
import QrCode from '../qr-code'
import NFTCard from '..'
import {
  useDynamicExampleContract,
  useAvatar,
  useAppDispatch,
  useUserData,
  useGlobalWalletConnect,
  userMintStatus,
  useStudioServerData,
  useChainConnect,
} from '@/lib/hooks'
import { setUserInfo } from '@/store/slice/user'
import { updatePaySvc } from '@/services/user'
import { useUserIsMint } from '@/lib/hooks/identity'
import { useCanvasImg } from '@/lib/hooks/canvas'
import { CONTRACT_ADDRESSES } from '@/lib/types/address'
import { formatObjToArray, ListProps } from '@/lib/utils'
import { progressCounter, ProgressItem, ProgressView, useProgressStore } from '@/components/widgets/progress'
import { callDropDown } from '@/components/widgets/modal'
import { allowMint } from '@/lib/mint'
import { useCacheStore } from '@/lib/api/cache'
import { env } from '@/lib/types/env'

import config from '@/config'

const { title, prefix, pay, contract, domains } = config

const AllowMintPreview = ({ router, user, onClose, onBottomCardClose, behavior }) => {
  const context = useTempContext()
  let publish_active = !behavior.includes?.('publish'),
    twitter_active = !behavior.includes?.('twitter'),
    coins_active = !behavior.map(beh => (typeof beh === 'object' ? beh.type : undefined)).includes?.('coins')
  return (
    <article className="w-120 min-h-50 p-4 px-5 rounded-2xl max-sm:w-full max-sm:rounded-none bg-white">
      <header>
        <span className="font-bold text-theme-primary">{behavior.length}</span>{' '}
        <span className="text-theme-primary">{behavior?.length == 1 ? 'task' : 'tasks'}</span> to complete to claim your
        Social<span className="text-theme-primary"> Pay</span> for free.
      </header>
      <ul className="flex gap-2 py-4">
        <li>
          <Avatar
            className={classNames(
              'size-6 text-sm',
              publish_active ? 'bg-theme-success/20 text-theme-success' : 'bg-theme-primary/15 text-theme-primary'
            )}
          >
            {publish_active ? <NmIcon type="icon-tick" /> : 1}
          </Avatar>
        </li>
        <li className="flex-1 flex flex-col gap-1">
          <div className={`font-bold text-sm ${publish_active ? 'text-theme-success' : 'text-theme-primary'}`}>
            Personalize and publish your portal
          </div>
          <div className="text-gray-400 text-xs">Enrich your Blocks contents</div>
        </li>
      </ul>
      <ul className="flex items-center gap-2 pb-4">
        <li>
          <Avatar
            className={classNames(
              'size-6 text-sm',
              twitter_active ? 'bg-theme-success/20 text-theme-success' : 'bg-theme-primary/15 text-theme-primary'
            )}
          >
            {twitter_active ? <NmIcon type="icon-tick" /> : 2}
          </Avatar>
        </li>
        <li className="flex-1">
          <div className={`font-bold text-sm ${twitter_active ? 'text-theme-success' : 'text-theme-primary'}`}>
            Copy and place your portal link in your Twitter Profile
          </div>
        </li>
      </ul>
      <ul className="flex items-center gap-2 pb-4">
        <li>
          <Avatar
            className={classNames(
              'size-6 text-sm',
              coins_active ? 'bg-theme-success/20 text-theme-success' : 'bg-theme-primary/15 text-theme-primary'
            )}
          >
            {coins_active ? <NmIcon type="icon-tick" /> : 3}
          </Avatar>
        </li>
        <li className="flex-1">
          <div className={`font-bold text-sm ${coins_active ? 'text-theme-success' : 'text-theme-primary'}`}>
            {`Accumulate Nexts >= 35`}
          </div>
        </li>
      </ul>
      <footer className="w-full flex justify-center items-center">
        <Button
          color="primary"
          variant="contained"
          className="rounded-3xl px-7 py-2 shadow-sm animate__animated animate__tada animate__infinite animate__slower"
          startIcon={<NmIcon type="icon-gift" />}
          onClick={() => {
            if (router?.pathname !== '/[username]') router.push(`/${user?.username}?tab=blocks`)
            onClose?.()
            onBottomCardClose()
            context.contextCall('task', contextProps => {
              callDropDown({
                dom: contextProps?.ref?.current,
                align: 'center',
                content: props => {
                  return <TokenHistory {...props} {...contextProps} />
                },
              })
            })
          }}
        >
          Earn more Nexts
        </Button>
      </footer>
    </article>
  )
}

export default function BottomCard() {
  const router = useRouter()
  const { bottomCardShow, setBottomCardShow, setShareCardShow } = useStudioContext()
  const { showSnackbar } = useSnackbar()
  const dispatch = useAppDispatch()
  const account = useAccount()
  const { chainId } = account
  const cache = useCacheStore()

  const studioServer = useStudioServerData()
  const { switchChain } = useSwitchChain()
  const { openConnectModal } = useConnectModal()
  const modal = useModal()
  const globalWalletConnect = useGlobalWalletConnect()
  const { address } = useChainConnect()
  const { avatar } = useAvatar()
  const [spin, setSpin] = useState(false)
  const [fireWorkOn, setFireWorkOn] = useState(false)
  const userInfo = useUserData()
  const isMint = useUserIsMint()
  const claimPay = useCanvasImg(true)
  const DynamicExampleInstance = useDynamicExampleContract(CONTRACT_ADDRESSES, true)
  const mintRef = useRef(null)
  const progressStore = useProgressStore()
  const [progress, setProgress] = useState(null)
  const [mintChecking, setMinChecking] = useState(true)
  const [isAllowMint, setAllowMint] = useState<string[]>([])

  useEffect(() => {
    const init = async () => {
      setMinChecking(true)
      try {
        const results = await Promise.all([
          cache.post<{ data: { list: ListProps } }>({
            url: '/api/point/list',
          }),
          cache.post<{ data: { type: number; score: number; desc: string }[] }>({
            url: '/api/point/rules',
          }),
        ])
        if (results) {
          const [listResult, ruleResult] = results

          if (listResult && ruleResult) {
            setAllowMint(
              allowMint({ user_points: listResult?.data?.list || [], scores: ruleResult.data || [], studioServer })
            )
          }
        }
      } finally {
        setMinChecking(false)
      }
    }
    init()
  }, [cache, studioServer])

  const getMintBtnClass = useMemo(
    () =>
      `${
        globalWalletConnect
          ? 'bg-gradient-to-r from-green-400 to-blue-500 border-none max-sm:h-14'
          : 'border-white max-sm:h-12'
      } text-lg text-white rounded-xl w-full max-sm:mt-4`,
    [globalWalletConnect]
  )

  const onBottomCardClose = () => {
    progress?.abort()
    localStorage.setItem(`${prefix}.bottom_card.show`, '0')
    setBottomCardShow(2)
    setTimeout(() => {
      setBottomCardShow(0)
    }, 300)
  }

  const onBottomShare = () => {
    onBottomCardClose()
    setShareCardShow(1)
  }

  const onMint = async () => {
    if (!globalWalletConnect) return openConnectModal()
    // 主网 Upcoming
    if (address) {
      return modal.open({
        title: 'Upcoming mainnet network',
        footer: null,
        keyboard: false,
        maskClosable: false,
        content: (
          <article className="text-center pt-12">
            <Image
              alt=""
              width="252"
              height="208"
              src={`${domains.cdn}/status/icon_emoji_animation.webp`}
              className="inline-block"
            />
            <footer className="pt-4">
              <Alert severity="info" className="flex items-center">
                The test network has been shut down and the main network will be deployed soon. Stay tuned with us
                <Link
                  href="//x.com/NextmeOne"
                  target="_blank"
                  underline="none"
                  rel="noopener noreferrer nofollow"
                >{`@${title}`}</Link>
              </Alert>
            </footer>
          </article>
        ),
      })
    }
    setSpin(true)
    let progress: ProgressItem | undefined
    try {
      if (isMint == userMintStatus.NOT_MINT) {
        try {
          const container = progressStore.createProgress({
            steps: [
              {
                id: 'mint',
                label: 'Minting',
              },
              {
                id: 'chain',
                label: 'On-Chain Communication',
              },
              {
                id: 'update',
                label: 'Update Pay Card',
              },
            ],
          })
          if (container && mintRef.current) {
            progress = container.item
            setProgress(progress)
            callDropDown({
              dom: mintRef.current,
              align: 'top',
              content: ({ onClose, isMobile }) => {
                return <ProgressView onClose={onClose} progress={progress} isMobile={isMobile} />
              },
              overlayClickDisable: true,
            })
          }
          let remove = progressCounter(progress, 'mint')
          const mintValue = await claimPay()
          remove()
          progress?.finish('mint')
          remove = progressCounter(progress, 'chain')
          const tokenid: any = await DynamicExampleInstance._tokenIds()
          remove()
          progress?.finish('chain')
          remove = progressCounter(progress, 'update')
          try {
            await updatePaySvc({ tokenId: Number(tokenid._hex), hash: mintValue?.hash, chainId })
            remove()
            progress.finish('update')
          } catch (error) {
            remove()
            progress?.abort()
            throw Error('already_have')
          }
          if (mintValue?.hash) {
            let _sbt = formatObjToArray(userInfo?.sbt)
            _sbt.push({
              tokenId: Number(tokenid._hex),
              hash: mintValue?.hash,
              chainId,
            })
            dispatch(
              setUserInfo({
                sbt: _sbt,
              })
            )
            cache.refresh('api/studio/dapp')
            showSnackbar({
              snackbar: { open: true, text: `🎉 Congratulations on getting ${pay.name} ᵔ◡ᵔ` },
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
            })
            setFireWorkOn(true)
            setSpin(false)
          }
        } catch (error) {
          progress?.abort()
          showSnackbar({
            snackbar: {
              open: true,
              type: 'error',
              text: (() => {
                switch (error) {
                  case 'avatar_error':
                    return 'Your nft avatar is not currently open, please change the avatar'
                  case 'already_have':
                    return 'You have claimed, please do not repeat the claiming'
                  default:
                    return error?.response?.data?.message || 'Server error, please try again.'
                }
              })(),
            },
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
          })
        }
      } else {
        setSpin(false)
        progress?.abort()
      }
    } catch (error) {
      setSpin(false)
      progress?.abort()
    }
    setSpin(false)
    progress?.abort()
  }

  useEffect(() => {
    if (chainId == (Number(env.payChainId) || contract.chainId)) {
      modal.close()
    }
  }, [chainId])

  return (
    <>
      <Backdrop className="z-50 backdrop-blur-sm" open={bottomCardShow === 1} />
      <Box
        className={`scrollbar-hide overflow-y-auto fixed z-50 left-0 bottom-0 size-full lg:h-auto lg:max-h-screen p-4 md:p-8 xl:px-16 bg-sidebar-deepblue animate__animated ${
          bottomCardShow == 2 ? 'animate__fadeOutDownBig' : 'animate__fadeInUpBig'
        }`}
      >
        <NmIcon
          type="icon-close_outline"
          className="sticky top-0 left-0 lg:absolute lg:left-auto lg:right-4 lg:top-4 text-white text-3xl leading-0"
          onClick={onBottomCardClose}
        />
        <ul className="flex flex-col lg:flex-row items-center justify-between 2xl:justify-around">
          <li className="w-full order-1 lg:max-w-2.5xl 2xl:max-w-4xl pt-6 lg:pt-0">
            <PayInfo />
            <footer className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 justify-between">
              <NmGlobalWallet
                containerClass="flex items-center justify-center p-2 rounded-xl bg-card-deepblue"
                connectClass="bg-none bg-transparent"
                commonClass="w-full py-2.5 text-lg rounded-lg"
                walletClass="bg-gradient-to-r from-green-400 to-blue-500"
              />
              {isMint == userMintStatus.NOT_MINT && (
                <Button
                  variant="outlined"
                  disabled={spin || mintChecking}
                  onClick={event => {
                    if (isAllowMint?.length) {
                      callDropDown({
                        dom: event.currentTarget,
                        content: props => {
                          return (
                            <AllowMintPreview
                              {...props}
                              user={userInfo}
                              router={router}
                              onBottomCardClose={onBottomCardClose}
                              behavior={isAllowMint}
                            />
                          )
                        },
                        align: 'top',
                        arrow: true,
                      })
                      return
                    }
                    if (!spin) {
                      onMint()
                    }
                  }}
                  className={getMintBtnClass}
                  ref={ele => {
                    if (ele) {
                      mintRef.current = ele
                    }
                  }}
                >
                  {spin && <NmIcon type="icon-spin" className="animate-spin mr-2" />}
                  {spin ? 'Minting...' : `Claim ${title} Pay`}
                  {!spin && (
                    <Image
                      alt=""
                      src={`${domains.cdn}/status/icon_coin.png`}
                      width="28"
                      height="28"
                      className="ml-4 animate__animated animate__infinite animate__swing animate__slower"
                    />
                  )}
                </Button>
              )}
              {isMint == userMintStatus.MINTED && (
                <Button variant="outlined" onClick={onBottomShare} className={getMintBtnClass}>
                  Share to Earn
                  <Image
                    alt=""
                    src={`${domains.cdn}/status/icon_coin.png`}
                    width="28"
                    height="28"
                    className="ml-4 animate__animated animate__infinite animate__swing animate__slower"
                  />
                </Button>
              )}
            </footer>
          </li>
          <li className="flex flex-1 flex-col lg:order-1 lg:ml-4 xl:ml-14 justify-center items-center">
            <Box className="scale-60 md:scale-90 lg:scale-75 lg:-mb-12 max-sm:-mt-12 max-sm:-mb-20">
              <NFTCard avatar={avatar} cardId="bottom-card" />
            </Box>
            {/* {isMint == userMintStatus.MINTED && <PayLinks customClass="w-full lg:w-72" />} */}
          </li>
        </ul>
      </Box>
      <QrCode />
      {fireWorkOn && (
        <NmFireWorks
          onClick={() => {
            setFireWorkOn(false)
          }}
        />
      )}
    </>
  )
}
