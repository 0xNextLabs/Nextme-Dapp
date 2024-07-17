import React, { useRef, useState, useEffect } from 'react'
import { Avatar, Box, Chip } from '@mui/material'
import { useCountDown, useDebounceFn } from 'ahooks'
import Image from 'next/image'
import NmIcon from '@/components/nm-icon'
import CropImg from '@/components/nm-crop/crop-img'
import NmNFTSelect from '@/components/nm-nft-select'
import { useModal } from '@/components/nm-modal/ModalContext'
import { useCrop } from '@/components/nm-crop/CropModalContext'
import MobileUpLoad from '@/components/nm-upload/MobileUpload'
import NmAvatarSelect from '@/components/nm-avatar-select'
import { setStudioInfo } from '@/store/slice/studio'
import { useAppDispatch, useAvatar, useScreen, useStudioData, useUserData, useGlobalWalletConnect } from '@/lib/hooks'
import { ICropImg, initImgStyle, IPreviewImgState } from '@/lib/types/crop'
import { getBlurDataURL, getDefaultAvatarUrl } from '@/lib/utils'
import { DESCRIPTION_SIZE, PROFILE_NAME_SIZE } from '@/lib/types/profile'
import { env } from '@/lib/types/env'
import config from '@/config'

const { domains } = config

let sbtEquities = [
  'Nextme Advanced Identity Certified Checks;',
  'Nextme Pay Ticket and Exclusive NFC Card Claim Access;',
  'Nextme Nexts incentive and 2.0 Feeds incentives for membership;',
  'Nextme Meetups and event tickets and derivatives rights, etc.',
]

const BottomBarItemBox = ({ title, children }) => {
  return (
    <section className="text-left my-6 xl:my-4">
      <Box className="text-base sm:text-lg text-white/80">{title}</Box>
      <Box className="relative bg-card-deepblue mt-2 p-2 md:p-4 rounded-xl">{children}</Box>
    </section>
  )
}
const TimeItemBox = ({ timeNum, title }) => {
  return (
    <ul className="bg-sidebar-deepblue size-16 md:w-28 md:h-24 rounded-xl p-0 md:p-2 md:mx-4 text-white text-center flex justify-center flex-col">
      <li className="text-xl md:text-3xl font-black">{timeNum}</li>
      <li className="text-sm md:text-xs text-gray-400 mt-1">{title}</li>
    </ul>
  )
}
//定义在外防止组件内更新导致重新渲染清空数据，因state具有更新延迟，所以选择普通变量
let nftSelect: any

export default function PayInfo() {
  const screen = useScreen()
  const globalWalletConnect = useGlobalWalletConnect()
  const desInputRef = useRef(null)
  const { type: avatarType } = useAvatar()
  const [imgInfo, setImgInfo] = useState<IPreviewImgState>()
  const [avatarSelect, setAvatarSelect] = useState({
    //0:image，1:nft
    type: 0,
    customValue: {
      ...initImgStyle,
    },
    nftValue: {
      ...initImgStyle,
    },
  })
  const modal = useModal()
  const crop = useCrop({})
  const dispatch = useAppDispatch()
  const user = useUserData()
  const { profile } = useStudioData()
  //倒计时
  const [countdown, formattedRes] = useCountDown({
    targetDate: env.sbtBillingDate || '2023-11-11 00:00:00',
  })
  const { days, hours, minutes, seconds } = formattedRes

  const { run: handleInputChange } = useDebounceFn(
    (value, type) => {
      switch (type) {
        case 'name':
          dispatch(
            setStudioInfo({
              profile: {
                ...profile,
                name: value,
              },
            })
          )
          break
        case 'description':
          dispatch(
            setStudioInfo({
              profile: {
                ...profile,
                description: value,
              },
            })
          )
          break

        default:
          break
      }
    },
    { wait: 350 }
  )

  const onCrop = (cropValue: ICropImg) => {
    setAvatarSelect({
      ...avatarSelect,
      customValue: cropValue,
    })
    setImgInfo({
      ...imgInfo,
      avatarImg: {
        ...cropValue,
      },
    })
    changeAvatar('custom', cropValue)
  }
  const changeAvatar = (type?: 'nft' | 'custom', cropValue?: ICropImg) => {
    if (type == 'custom') {
      dispatch(
        setStudioInfo({
          profile: {
            ...profile,
            avatar: cropValue
              ? {
                  ...cropValue,
                  type: 'custom',
                }
              : {
                  ...avatarSelect.customValue,
                  type: 'custom',
                },
          },
        })
      )
    } else {
      dispatch(
        setStudioInfo({
          profile: {
            ...profile,
            avatar: {
              ...initImgStyle,
              url: nftSelect[0]?.image || nftSelect[0]?.url,
              type: 'nft',
            },
          },
        })
      )
    }
  }
  const handleNFTChoose = () => {
    if (!nftSelect?.length) modal.close()
    setAvatarSelect({
      ...avatarSelect,
      type: 1,
      nftValue: {
        ...avatarSelect.nftValue,
        url: nftSelect[0]?.image || nftSelect[0]?.url,
      },
    })
    changeAvatar()
    modal.close()
  }

  const modelWrapped = () => (
    <NmNFTSelect
      showSearchBar
      type="only"
      pageSize={screen !== 'xs' ? 6 : 4}
      isVertical={false}
      onSelected={val => (nftSelect = val)}
    />
  )
  const handleAvatarDelete = (type: string) => {
    if (type == 'avatar') {
      dispatch(
        setStudioInfo({
          profile: {
            ...profile,
            avatar: {
              type: 'default',
              url: '',
            },
          },
        })
      )
    } else {
      dispatch(
        setStudioInfo({
          profile: {
            ...profile,
            cover: {
              type: 'default',
              url: '',
            },
          },
        })
      )
    }
  }

  const handleAvatarSelect = () => {
    let picID
    modal.setModalState({
      open: true,
      title: 'Please select your AI avatar',
      content: <NmAvatarSelect id={profile?.avatar?.url} onAvatarSelect={e => (picID = e)} />,
      onOk: () => {
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
        setTimeout(_ => {
          modal.close()
        }, 200)
      },
    })
  }

  const modalOpen = () => {
    modal.setModalState({
      open: true,
      content: modelWrapped(),
      title: 'Please select your NFT PFP',
      onOk: handleNFTChoose,
    })
  }
  const handleReCropImg = url => {
    setImgInfo({
      ...imgInfo,
      uploadImg: {
        ...profile.avatar,
      },
    })
    crop.open({
      isReserveOrigin: false,
      onOk: cropValue => onCrop(cropValue),
      imageUrl: profile?.avatar?.type == 'custom' ? profile?.avatar?.url : url || '',
      aspectRatio: 1,
    })
  }
  useEffect(() => {
    if (profile?.avatar?.type == 'nft') {
      setAvatarSelect({
        ...avatarSelect,
        nftValue: {
          ...avatarSelect.nftValue,
          url: profile.avatar.url,
        },
        type: 1,
      })
    } else {
      if (!profile?.avatar?.type || profile?.avatar?.type == 'default') {
        setAvatarSelect({
          ...avatarSelect,
          customValue: {
            ...profile.avatar,
            url: profile?.avatar?.url || getDefaultAvatarUrl(1),
          },
          type: 0,
        })
      } else {
        setAvatarSelect({
          ...avatarSelect,
          customValue: profile.avatar,
          type: 0,
        })
      }
    }
  }, [profile?.avatar])

  return (
    <>
      <BottomBarItemBox
        title={
          <ul className="-mt-2 flex items-center flex-wrap max-sm:flex-col text-white sm:text-xl">
            <li>
              <NmIcon type="icon-alarm_clock" className="text-5xl sm:text-3xl -mt-2 mr-2" />
            </li>
            <li className="max-sm:py-2">Limited time free mint Nextme Social Pay</li>
            <li className="flex items-center">
              <span className="mx-2 line-through">0.01ETH</span>
              <Chip size="small" color="success" variant="outlined" label="100% OFF" />
            </li>
          </ul>
        }
      >
        <ul className="pl-6 list-disc text-gray-400 leading-6 text-sm">
          {sbtEquities.map((row, index) => (
            <li key={`sbt-equities-${index}`}>{row}</li>
          ))}
        </ul>
        <Box className="text-center mt-1 lg:absolute top-1 right-2">
          <Chip label="more to be announced" variant="outlined" size="small" color="primary" />
        </Box>

        {/* 倒计时先在公测期间下掉 */}
        {/* <div className="flex justify-between">
          <TimeItemBox title="Days" timeNum={days} />
          <TimeItemBox title="Hours" timeNum={hours} />
          <TimeItemBox title="Minutes" timeNum={minutes} />
          <TimeItemBox title="Seconds" timeNum={seconds} />
        </div> */}
      </BottomBarItemBox>
      <BottomBarItemBox title="1. Add your avatar or NFT PFP">
        <ul className="md:flex md:justify-between">
          <li className="w-full md:w-1/2 px-4 flex justify-between">
            <Box className="flex">
              <input
                type="checkbox"
                onChange={() => {
                  setAvatarSelect({
                    ...avatarSelect,
                    type: 0,
                  })
                  changeAvatar('custom')
                }}
                checked={avatarSelect.type == 0}
                className="checkbox focus:ring-0 focus:border-none mt-2.5"
              />
              <p className="ml-4 text-sm md:text-md text-gray-400 leading-[2.7rem]">Basic Avatar</p>
            </Box>
            <Box className="relative cursor-pointer">
              {avatarType === 'default' ? (
                <Avatar
                  className="bg-white/70 size-4 rounded-full absolute bottom-0 right-0 z-10 hover:bg-theme-success  hover:text-white transition-all"
                  onClick={handleAvatarSelect}
                >
                  <NmIcon type="icon-rotate" className="text-black text-xs mb-0.5 hover:text-white" />
                </Avatar>
              ) : (
                <Avatar
                  className="bg-white/70 size-4 rounded-full absolute botton-0 right-0 z-10 hover:bg-theme-error hover:text-white transition-all"
                  onClick={() => handleAvatarDelete('avatar')}
                >
                  <NmIcon type="icon-close_bold" className="text-xs text-black mb-0.5 hover:text-white" />
                </Avatar>
              )}
              <Box className="size-10 md:size-12 overflow-hidden text-center flex relative rounded-full cursor-pointer">
                <MobileUpLoad onUpload={handleReCropImg}>
                  <CropImg
                    src={avatarSelect?.customValue?.url}
                    imgStyle={(avatarSelect.customValue as any).imgStyle}
                    customClass="rounded-full"
                  />
                </MobileUpLoad>
              </Box>
            </Box>
          </li>
          <li className="w-full pt-2 md:pt-0 md:w-1/2 px-4 flex justify-between">
            <div className="flex">
              <input
                type="checkbox"
                onChange={() => {
                  if (!globalWalletConnect || !avatarSelect?.nftValue?.url) {
                    modalOpen()
                    return
                  }
                  setAvatarSelect({
                    ...avatarSelect,
                    type: 1,
                  })
                  changeAvatar('nft')
                }}
                checked={avatarSelect.type == 1}
                className={`checkbox focus:ring-0 focus:border-none mt-2.5`}
              />
              <p className="ml-4 text-sm md:text-md text-gray-400 leading-[2.7rem]">NFT Avatar</p>
            </div>
            <div className="relative cursor-pointer">
              <Box className="size-10 md:size-12 overflow-hidden text-center flex relative rounded-full cursor-pointer">
                {avatarSelect?.nftValue?.url ? (
                  <CropImg src={avatarSelect.nftValue.url} type="nft" onClick={modalOpen} customClass="rounded-full" />
                ) : (
                  <Image
                    alt=""
                    src={`${domains.cdn}/avatars/default_nft.png`}
                    width="48"
                    height="48"
                    className="rounded-xl"
                    onClick={modalOpen}
                    blurDataURL={getBlurDataURL(48, 48)}
                  />
                )}
              </Box>
              <Avatar className="bg-white/70 text-black text-xs size-4 absolute bottom-0 right-0 z-10">
                <NmIcon type={avatarSelect.nftValue ? 'icon-camera' : 'icon-upload'} />
              </Avatar>
            </div>
          </li>
        </ul>
      </BottomBarItemBox>
      <BottomBarItemBox title="2. Personalize your Name">
        <div className="w-full rounded-md">
          <input
            maxLength={PROFILE_NAME_SIZE}
            ref={desInputRef}
            defaultValue={profile?.name || user?.username}
            onChange={e => handleInputChange(e.target.value, 'name')}
            placeholder="username"
            className="w-full text-white bg-card-deepblue/0 focus:outline-none focus:shadow-none focus:ring-0 border-none outline-none resize-none"
          />
        </div>
      </BottomBarItemBox>
      <BottomBarItemBox title="3. Update your Bio">
        <div className="w-full rounded-md p-1">
          <textarea
            maxLength={DESCRIPTION_SIZE}
            ref={desInputRef}
            defaultValue={profile?.description}
            onChange={e => handleInputChange(e.target.value, 'description')}
            placeholder="your description"
            className="w-full text-white bg-card-deepblue/0 focus:outline-none focus:shadow-none focus:ring-0 border-none outline-none resize-none"
          />
        </div>
      </BottomBarItemBox>
    </>
  )
}
