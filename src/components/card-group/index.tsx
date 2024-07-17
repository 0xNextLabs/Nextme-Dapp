/* eslint-disable react/no-unknown-property */
import { useCallback, useEffect, useMemo, useState } from 'react'
import NextImage from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { Box } from '@mui/material'
import classNames from 'classnames'
import CropImg from '@/components/nm-crop/crop-img'
import { getShortenEndDots } from '@/lib/utils'
import { useLocation, useStudioData, useUserData } from '@/lib/hooks'

import config from '@/config'

const { pay, logo, domains } = config

interface IProps {
  customName?: string
  username?: string
  avatar?: any
  intro?: string
  svgRef?: any
  cardId?: string
  animated?: boolean
  did?: string
}

export default function NFTCard(
  {
    cardId = '', // did card 唯一id
    customName = '', // 卡片用户名，自定义 profile?.name || username
    username = '', // 用户唯一用户域名用户名
    avatar: defaultAvatar, // 用户头像，3种类型
    intro, // 用户简介，默认为空
    svgRef,
    animated = true,
    did = '',
  }: IProps,
  ...props
) {
  const Snap = require('snapsvg-cjs')
  const mina = (window as any).mina
  const host = useLocation()
  const user = useUserData()
  const { profile } = useStudioData()

  const [bgLoading, setBgLoading] = useState(true)
  const { name, avatar, description } = profile
  // 卡片链接
  const cardURL = process.env.NODE_ENV === 'development' ? `dev.${config.host}` : host
  // 卡片用户名，落地页个性化数据 > 用户唯一域名用户名id
  const cardUserName = username || user?.username
  // 卡片昵称，落地页个性化数据 > 工作台 profile name > 用户唯一域名用户名id
  const cardName = customName || name || user?.username
  // 用户唯一身份did
  const cardDID = useMemo(
    () => did || (user?.did as string) || 'did:next:0xFEBC175548cDEf35...C78DEe853DB5183e54',
    [user?.did]
  )
  useEffect(() => {
    let path =
      'M60 18 H 290 Q 320 18 320 69 V 530 Q 320 581 290 581 H 80 Q 20 581 20 530 V 58 Q 20 18 60 18H 290 Q 320 18 320 69 V 530 Q 320 581 290 581 H 80 Q 20 581 20 530 V 58 Q 20 18 60 18H 290 Q 320 18 320 69 V 530 Q 320 581 290 581 H 80 Q 20 581 20 530 V 58 Q 20 18 60 18H 290 Q 320 18 320 69 V 530 Q 320 581 290 581 H 80 Q 20 581 20 530 V 58 Q 20 18 60 18H 290 Q 320 18 320 69 V 530 Q 320 581 290 581 H 80 Q 20 581 20 530 V 58 Q 20 18 60 18H 290 Q 320 18 320 69 V 530 Q 320 581 290 581 H 80 Q 20 581 20 530 V 58 Q 20 18 60 18H 290 Q 320 18 320 69 V 530 Q 320 581 290 581 H 80 Q 20 581 20 530 V 58 Q 20 18 60 18H 290 Q 320 18 320 69 V 530 Q 320 581 290 581 H 80 Q 20 581 20 530 V 58 Q 20 18 60 18H 290 Q 320 18 320 69 V 530 Q 320 581 290 581 H 80 Q 20 581 20 530 V 58 Q 20 18 60 18H 290 Q 320 18 320 69 V 530 Q 320 581 290 581 H 80 Q 20 581 20 530 V 58 Q 20 18 60 18'
    let path2 =
      'M290 581 H 60 Q 20 581 20 530 V 60 Q 20 18 60 18 H 290 Q 320 18 320 69V 530 Q 320 581 290 581 H 60 Q 20 581 20 530 V 60 Q 20 18 60 18 H 290 Q 320 18 320 69V 530 Q 320 581 290 581H 60 Q 20 581 20 530 V 60 Q 20 18 60 18 H 290 Q 320 18 320 69V 530 Q 320 581 290 581H 60 Q 20 581 20 530 V 60 Q 20 18 60 18 H 290 Q 320 18 320 69V 530 Q 320 581 290 581H 60 Q 20 581 20 530 V 60 Q 20 18 60 18 H 290 Q 320 18 320 69V 530 Q 320 581 290 581H 60 Q 20 581 20 530 V 60 Q 20 18 60 18 H 290 Q 320 18 320 69V 530 Q 320 581 290 581H 60 Q 20 581 20 530 V 60 Q 20 18 60 18 H 290 Q 320 18 320 69V 530 Q 320 581 290 581H 60 Q 20 581 20 530 V 60 Q 20 18 60 18 H 290 Q 320 18 320 69V 530 Q 320 581 290 581H 60 Q 20 581 20 530 V 60 Q 20 18 60 18 H 290 Q 320 18 320 69V 530 Q 320 581 290 581H 60 Q 20 581 20 530 V 60 Q 20 18 60 18 H 290 Q 320 18 320 69V 530 Q 320 581 290 581'
    const s = Snap(`#${cardId}-svg`)
    const s2 = Snap(`#${cardId}-svg2`)
    path = s.path(path).attr({ fill: 'none', strokeWitdh: '1', stroke: '', 'stroke-dasharray': '5 5' })
    path2 = s.path(path2).attr({ fill: 'none', strokeWitdh: '1', stroke: '', 'stroke-dasharray': '5 5' })
    const path3 = s2.path(path).attr({ fill: 'none', strokeWitdh: '1', stroke: '', 'stroke-dasharray': '5 5' })
    const path4 = s2.path(path2).attr({ fill: 'none', strokeWitdh: '1', stroke: '', 'stroke-dasharray': '5 5' })

    const pathLength = Snap.path.getTotalLength(path)
    const txt = s.text(0, 0, cardDID)
    const txt2 = s.text(0, 0, cardDID)
    const txt3 = s2.text(0, 0, cardDID)
    const txt4 = s2.text(0, 0, cardDID)
    const txtLength = txt.node.clientWidth
    const buildText = (buildTxt, buildPath) => {
      return buildTxt
        .attr({ fontSize: '10.5', textpath: buildPath, fill: `url(#${cardId}-grad1)` })
        .textPath.attr({ startOffset: -txtLength })
        .animate({ startOffset: pathLength - txtLength }, 150000, mina.linear, function () {
          moveOnControl(buildTxt, buildPath)
        })
    }
    buildText(txt, path)
    buildText(txt2, path2)
    buildText(txt3, path3)
    buildText(txt4, path4)
    const moveOnControl = (txtControl, pathControl) => {
      // 停止当前动画
      txtControl.stop()
      // 重新创建文本和路径
      txtControl = s
        .text(0, 0, cardDID)
        .attr({ textpath: pathControl, fill: `url(#${cardId}-grad1)` })
        .textPath.attr({ startOffset: -txtLength })
      // 开始新的动画
      txtControl.animate({ startOffset: pathLength - txtLength }, 150000, mina.linear, function () {
        // 删除旧的动画对象
        txtControl.remove()
        // 重新调用函数
        moveOnControl(txtControl, pathControl)
      })
    }
    const bgImg = new Image()
    bgImg.src = `${domains.cdn}/status/pay_card_bg.png`
    bgImg.onload = () => {
      setBgLoading(false)
    }
  }, [cardId, user.did])

  const userAvatar = useCallback(() => {
    const _src = defaultAvatar || avatar?.url || logo.dark
    const _imgStyle = { ...avatar?.imgStyle }
    return (
      <Box className="border-transparent bg-gradient-to-r  from-blue-500 to-green-400 rounded-full p-1 absolute left-12 top-10">
        <Box className="rounded-full size-28 p-1 bg-card-deepblue overflow-hidden">
          {avatar?.url ? (
            <CropImg customClass="rounded-full" src={_src} imgStyle={_imgStyle} type={avatar.type} />
          ) : (
            <img src={defaultAvatar} className="rounded-full size-full" />
          )}
        </Box>
      </Box>
    )
  }, [avatar, defaultAvatar])

  return (
    <Box
      ref={el => svgRef && (svgRef.current = el)}
      className={classNames('p-1 relative transition-animation duration-1000 hover:animate-none', {
        'animate-rotateY': !bgLoading && animated,
      })}
      style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d', borderRadius: '1.8rem' }}
    >
      <article className="size-full absolute">
        {userAvatar()}
        <h1
          className="absolute top-44 left-12 w-3/4 
        truncate text-transparent  
        bg-clip-text text-3xl text-left overflow-hidden whitespace-nowrap
        "
          style={{ backgroundImage: 'linear-gradient(82.49deg, #5D636D 0.69%, #EEEEEE 40.79%)' }}
        >
          {cardName}
        </h1>
        <h2 className="absolute top-56 left-12 w-3/4 text-white/20 text-md text-left break-words line-clamp-5 whitespace-pre-wrap">
          {intro || description || pay.name}
        </h2>
        <ul className="flex items-center absolute top-[33rem] left-12">
          <li className="text-white leading-6">
            {cardURL}
            <span className="px-1">/</span>
          </li>
          <li className="bg-sidebar-deepblue text-white leading-6 rounded w-auto ml-1 px-3">
            {getShortenEndDots(cardUserName, 12)}
          </li>
        </ul>
        <Box className="p-1 absolute top-[25rem] left-12">
          <QRCodeSVG
            y="427"
            x="57"
            id={`${cardId}-bill_qr_code_url`}
            value={`https://${cardURL}/${cardUserName}`} //二维码链接
            size={107} //二维码的宽高尺寸
            bgColor="rgba(0,0,0,0)"
            fgColor="#085679"
          />
        </Box>
        <NextImage
          src={`${domains.cdn}/status/pay_card_bg.png`}
          fill
          className="absolute top-0 left-0 bg-card-deepblue -z-10 "
          style={{ borderRadius: '1.8rem' }}
          alt=""
        />
        <svg xmlns="http://www.w3.org/2000/svg" id={`${cardId}-svg`} width="344" height="598">
          <defs>
            <linearGradient id={`${cardId}-grad1`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: 'rgba(1,116,227,0.4)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'rgba(1,224,185,0.4)', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </article>
      <div
        className="relative"
        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: '1.8rem' }}
      >
        <div
          className="absolute top-64 left-32 text-4xl text-white"
          style={{
            fontFamily:
              'Satisfy,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace',
          }}
        >
          {config.title}
        </div>
        <NextImage
          src={`${domains.cdn}/status/pay_card_bg.png`}
          fill
          className="absolute top-0 left-0 bg-card-deepblue -z-10"
          style={{ borderRadius: '1.8rem' }}
          alt=""
        />
        <svg xmlns="http://www.w3.org/2000/svg" id={`${cardId}-svg2`} width="344" height="598">
          <defs>
            <linearGradient id={`${cardId}-back-grad1`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: 'rgba(1,116,227,0.4)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'rgba(1,224,185,0.4)', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </Box>
  )
}
