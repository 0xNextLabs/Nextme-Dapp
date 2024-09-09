import { Avatar } from '@mui/material'
import { useRouter } from 'next/router'
import Image from 'next/image'
import classNames from 'classnames'
import NmIcon from '@/components/nm-icon'
import QrCode from './qr-code'
import { useLocation, useShareLink, useUserData } from '@/lib/hooks'
import { useCanvasImg } from '@/lib/hooks/canvas'
import social from '@/config/common/social'

import config from '@/config'

const { domains } = config

interface AppListProps {
  customClass?: string
  name?: string
  setToast?: Function
  desc?: string
  uuid?: string
  cardName?: string
  avatar?: string
}

let appList = [
  {
    type: 'twitter',
    tips: `${domains.cdn}/status/icon_coin.png`,
  },
  {
    type: 'discord',
    tips: `${domains.cdn}/status/icon_checks.png`,
    url: '//discord.gg/mxTew3aerd',
  },
  {
    type: 'imessage',
    image: `${domains.cdn}/static/social/iMessage.svg`,
  },
  {
    type: 'telegram',
  },
]

const ShareAppList = ({
  customClass = 'justify-around',
  name = '',
  setToast = () => {},
  desc,
  uuid,
  cardName,
  avatar,
}: AppListProps) => {
  let userData = useUserData()
  const { onSocialAppShare } = useShareLink()
  const drawCanvas = useCanvasImg()
  const router = useRouter()
  const origin = useLocation('origin')
  let username =
    router.pathname == '/[username]' ? (router.query?.username as string) || '' : name || userData?.username
  const handleShare = async ({ shareItem }) => {
    let { type: shareType } = shareItem
    onSocialAppShare({
      type: shareType,
      url: `${origin}/${username}`,
    })
    await drawCanvas({
      username,
      uuid,
      cardName,
      desc,
      avatar,
    })
    navigator.clipboard?.writeText(`${origin}/${username}`)
    setToast({
      open: true,
      type: 'success',
      text: 'Portal link copy success ᵔ◡ᵔ',
    })
  }
  return (
    <ul className={`flex ${customClass}`}>
      {appList.map((item, index) => (
        <li
          key={`social-${item.type}-${index}`}
          onClick={() => handleShare({ shareItem: item })}
          className="cursor-pointer relative"
        >
          <Avatar
            src={item?.image}
            sx={{ background: social.types[item.type]?.background || social.types[item.type]?.color }}
          >
            <NmIcon type={`icon-${social.types[item.type]?.icon}`} className="text-2xl leading-0" />
          </Avatar>
          {item?.tips && (
            <Image
              alt=""
              src={item?.tips}
              width="24"
              height="24"
              className={classNames(
                'absolute -right-2 -top-2 animate__animated animate__infinite',
                ['animate__swing', 'animate__pulse', 'animate__heartBeat', 'animate__tada'][index]
              )}
            />
          )}
        </li>
      ))}
      <QrCode username={username} />
    </ul>
  )
}

export default ShareAppList
