import { useContext, useState } from 'react'
import classNames from 'classnames'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { CountUp } from 'use-count-up'
import { Avatar, Box, Button, Drawer, IconButton } from '@mui/material'
import NmIcon from '@/components/nm-icon'
import NmBorderCounter from '@/components/nm-border-counter'
import PayCard from '@/components/card-group/pay-card'
import { useModal } from '@/components/nm-modal/ModalContext'
import { StudioContext } from '@/components/context/studio'
import { useSnackbar } from '@/components/context/snackbar'
import CodeModal from '@/components/card-group/code-modal'
import { useAvatar, useLocation, useMobile, useShareLink, useUserData } from '@/lib/hooks'
import { usePointsCoin } from '@/lib/hooks/wallet'
import { TASK_LIST, TASK_TYPE } from '@/lib/types/tasks'
import { PointRules } from '@/lib/types/points'
import { getBlurDataURL, getShortenMidDots } from '@/lib/utils'
import { getAuthUrl } from '@/services/auth'

import social from '@/config/common/social'
import config from '@/config'

const { domains, host } = config
const { telegram } = social.types

const shareList = [
  {
    name: 'X(Twitter)',
    type: 'twitter',
    image: `${domains.cdn}/static/social/x.svg`,
  },
  {
    name: 'iMessage',
    type: 'imessage',
    image: `${domains.cdn}/static/social/iMessage.svg`,
  },
  {
    ...telegram,
    type: 'telegram',
    iconClass: 'text-3.5xl',
  },
  {
    name: 'Show QR',
    icon: 'qrcode',
    type: 'qrcode',
    class: 'bg-zinc-200',
    iconClass: 'text-stone-800',
  },
]

export default function Token() {
  const router = useRouter()
  const isMobile = useMobile()
  const origin = useLocation('origin')
  const modal = useModal()
  const { onSocialAppShare } = useShareLink()
  const { avatar } = useAvatar()
  const { inviteCode, username } = useUserData()
  const { setBottomCardShow } = useContext(StudioContext)
  const { pointsCoin, pointsData } = usePointsCoin()
  const { showSnackbar } = useSnackbar()
  const [drawer, setDrawer] = useState({
    open: false,
  })

  let portal = `${origin}/${username}`,
    inviteRoute = `gateway?inviteCode=${inviteCode}`,
    inviteUrl = `${origin}/${inviteRoute}`
  const handleScrollTo = val => {
    window.scrollTo({
      top: 1020,
      behavior: 'smooth',
      ...val,
    })
  }

  const handleCommonShare = (type, val = null) => {
    let text = ''

    switch (type) {
      case 'twitter':
        onSocialAppShare({
          type: 'twitter',
          text: `I found a ultimate all-in-one Social Portal on @NextmeOne %0a%0aEarn passive income and rewards with my invitations! %0a${inviteUrl}%0a%0aThanks so much Nextme team 😘%0a%0a`,
        })
        break

      case 'telegram':
        onSocialAppShare({
          type: 'telegram',
          url: inviteUrl,
        })
        break

      case 'imessage':
        onSocialAppShare({
          type: 'imessage',
          url: inviteUrl,
        })
        break

      case 'qrcode':
        modal.setModalState({
          open: true,
          title: 'Download and share your social card',
          content: <PayCard />,
          footer: null,
        })
        break

      case 'portal':
        text = 'Portal link copy'
        navigator.clipboard.writeText(portal)
        setTimeout(_ => {
          window.open('//twitter.com')
        }, 500)
        break

      case 'invite':
        text = 'Invite link copy'
        navigator.clipboard.writeText(
          `🤗 I found a ultimate all-in-one Social Portal\nsuch as my ${portal}\n🤔 And I invite you to join Nextme through my exclusive invitation code ${inviteUrl}\nyou can also earn early Nexts Token incentives.`
        )
        break

      default:
        break
    }
    if (text)
      showSnackbar({
        snackbar: {
          open: true,
          type: 'success',
          text: `${text} success ᵔ◡ᵔ`,
        },
      })
  }

  const handleTaskActions = async type => {
    switch (type) {
      case TASK_TYPE.LINK_TWITTER:
        const { url: x_oauth_url } = await getAuthUrl('twitter', { isLogin: 0, redirectPathName: router.pathname })
        if (x_oauth_url) router.push(x_oauth_url)
        break

      case TASK_TYPE.JOIN_DISCORD:
        const { url: discord_oauth_url } = await getAuthUrl('discord', {
          isLogin: 0,
          redirectPathName: router.pathname,
        })
        if (discord_oauth_url) router.push(discord_oauth_url)
        break

      case TASK_TYPE.CLAIM_SBT:
        setBottomCardShow(1)
        break

      case TASK_TYPE.INVITED_OTHERS:
        handleCommonShare('invite')
        break

      case TASK_TYPE.PUBLISH:
      default:
        router.push(`/${username}?tab=blocks`)
        break
    }
  }

  return (
    <li>
      <Box className="animate__animated animate__fadeIn">
        <header className="2xl:text-lg">
          <h3 className="text-lg">
            Nexts is a currency for liquid payments in the Nextme Ecosystem and is used to perform onchain actions.
          </h3>
          <p className="text-neutral-400">
            — gifting Nextme invites, minting certain NFTs, rewarding and trading, interest dating, etc — from within
            the Nextme app.
          </p>
        </header>
        <ul className="p-6 max-sm:pl-4 my-8 rounded-lg border border-stone-100 hover:border-stone-200/80 flex justify-between items-center relative overflow-hidden transition-all">
          <li className="bg-clip-text text-transparent bg-create-gradient-001">
            <h3 className="text-lg pb-6 cursor-pointer" onClick={handleScrollTo}>
              Earn more →
            </h3>
            <Box className="text-4.5xl xl:text-5.5xl font-medium">
              <strong className="font-semibold font-courgette">
                <CountUp isCounting start={0} end={pointsCoin} duration={5} thousandsSeparator="," />
              </strong>
              <span className={classNames('opacity-100 text-xl font-bold font-satisfy ml-4')}>Nexts</span>
            </Box>
          </li>
          <li className="absolute -right-12">
            <Image
              alt=""
              src={`${domains.cdn}/status/icon_coin.gif`}
              width="360"
              height="360"
              className="-my-28 w-72 h-72 sm:w-76 sm:h-76 xl:w-88 xl:h-88"
              draggable={false}
            />
          </li>
          <li className="absolute top-2 right-3 tooltip tooltip-left" data-tip="Upcoming">
            <NmIcon
              type="icon-trophy"
              className="text-2xl text-rose-500 cursor-pointer hover:scale-105 transition-all"
            />
          </li>
        </ul>
        <section className="-mt-7 3xl:px-12 flex justify-center relative">
          <Box className="absolute top-[44%] right-[22%]">
            <NmBorderCounter speed="smooth" customClass="rounded-full p-1 md:p-1.5" innerClass="border-1 md:border-2">
              <Avatar
                src={avatar}
                className="skeleton rounded-full size-12 md:size-16 lg:size-20 xl:size-24 2xl:size-32 3xl:size-40"
              />
            </NmBorderCounter>
          </Box>
          <Image
            alt=""
            width="2000"
            height="1024"
            className="w-full"
            src={`${domains.cdn}/status/icon_referrals.png`}
            placeholder="blur"
            blurDataURL={getBlurDataURL(2000, 1024)}
            draggable={false}
          />
        </section>
        <ul className="p-6 py-8 my-12 rounded-lg border border-stone-100 flex justify-between items-end max-xl:flex-wrap">
          <li>
            <h3 className="font-semibold text-2xl sm:text-2.5xl">Refer friends to earn passive income!</h3>
            <p className="text-neutral-400 pt-8">
              Invite friends, and as they sign up using your invite link, both of you earn at least 10 Nexts.
              <br />
              These coins turn into Nexts. Expand your circle and amplify your earnings!
            </p>
            <ul className="flex flex-wrap items-center gap-4 my-8">
              <li className="relative flex items-center max-lg:w-full md:min-w-[29rem] xl:min-w-[30rem]">
                <span className="absolute left-3">{`${host}/`}</span>
                <input
                  type="text"
                  className="py-3 pl-[6.6rem] truncate tracking-wide w-full rounded-md bg-gray-100 border-transparent"
                  placeholder={isMobile ? getShortenMidDots(inviteRoute) : inviteRoute}
                  disabled
                />
                <Button
                  className="text-white px-4 rounded-md bg-create-gradient-001 absolute right-2"
                  onClick={() => handleCommonShare('invite')}
                >
                  Copy <span className="max-sm:hidden pl-1 leading-0">Link</span>
                </Button>
              </li>
              <li className="max-lg:w-full">
                <Button
                  color="secondary"
                  size="large"
                  className="bg-black text-white py-3 px-5 w-full rounded-md"
                  onClick={() => router.push(`/${username}?tab=blocks`)}
                >
                  Add anything to Bio →
                </Button>
              </li>
            </ul>
            <ul className="flex xl:gap-16 pt-2 justify-between sm:justify-around xl:justify-start">
              {shareList.map((row, index) => (
                <li
                  key={`social-item-${index + 1}`}
                  className="flex flex-col items-center justify-end gap-2"
                  onClick={() => handleCommonShare(row?.type)}
                >
                  <Avatar
                    src={row['image']}
                    className={classNames(
                      'size-12 rounded-lg cursor-pointer hover:scale-110 transition-all',
                      row['class']
                    )}
                    style={{ background: row['color'] }}
                  >
                    {row['icon'] && (
                      <NmIcon
                        type={`icon-${row['icon']}`}
                        className={classNames('leading-0 text-2.5xl', row['iconClass'])}
                      />
                    )}
                  </Avatar>
                  <p>{row.name}</p>
                </li>
              ))}
            </ul>
          </li>
          <li className="max-xl:w-full flex justify-center max-xl:mt-12">
            <Image
              alt=""
              width="260"
              height="260"
              className="max-xl:w-100 2xl:w-80"
              src={`${domains.cdn}/status/icon_invite_friends.png`}
              placeholder="blur"
              blurDataURL={getBlurDataURL(260, 260)}
              draggable={false}
            />
          </li>
        </ul>
        <section className="text-center py-8">
          <h1 className="text-3xl 2xs:text-4xl font-bold">What is Nexts Gravity?</h1>
          <p className="text-neutral-400 py-4">
            Nexts Gravity is a creator program for distributing $Nexts that continues to open up more community revenue
            and airdrop value.
          </p>
        </section>
        <table className="table table-lg">
          <thead className="text-neutral-400 text-base">
            <tr>
              {['Quests', 'Coins', 'Status'].map((row, index) => (
                <th
                  key={`table-head-${index + 1}`}
                  className={classNames('font-normal pl-0 last:text-right last:pr-0', {
                    'max-sm:text-center': index == 1,
                  })}
                >
                  {row}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TASK_LIST.map((item, index) => {
              let record = pointsData.list.find(row => {
                if (item.type === TASK_TYPE.LINK_TWITTER)
                  return [PointRules.TWITTER, PointRules.TWITTER_VERIFY_UNIQUE].includes(row.type)
                if (item.type === TASK_TYPE.JOIN_DISCORD)
                  return [PointRules.DISCORD, PointRules.DISCORD_VERIFY_UNIQUE].includes(row.type)
                return row.type === item.type && ![TASK_TYPE.PUBLISH, TASK_TYPE.INVITED_OTHERS].includes(item.type)
              })
              let disabled = Boolean(record) || item?.disabled
              return (
                <tr key={`table-body-row-${index + 1}`}>
                  <td className="px-0 text-neutral-800">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <span className="text-neutral-800/50 max-sm:text-sm">{item.detail}</span>
                    {item.type === TASK_TYPE.LINK_TWITTER && (
                      <IconButton
                        disabled={disabled}
                        size="small"
                        className="ml-2"
                        onClick={() => setDrawer({ open: true })}
                      >
                        <NmIcon type="icon-arrow_down" />
                      </IconButton>
                    )}
                    {item.type === TASK_TYPE.JOIN_DISCORD && (
                      <IconButton
                        size="small"
                        className="ml-1 -rotate-90"
                        href="//discord.gg/mxTew3aerd"
                        target="_blank"
                      >
                        <NmIcon type="icon-arrow_down" />
                      </IconButton>
                    )}
                  </td>
                  <td
                    className={classNames('px-0 text-neutral-800/60 max-sm:text-center', {
                      'font-medium bg-clip-text text-transparent bg-create-gradient-001': Boolean(record),
                    })}
                  >
                    {item.icon !== 'invite' ? '+' : ''} {item.score} Nexts
                  </td>
                  <td className="px-0 text-right">
                    <Button
                      color="secondary"
                      className={classNames(
                        'text-white bg-create-gradient-001 rounded-3xl w-28 sm:w-32 max-sm:scale-95',
                        {
                          'opacity-50': disabled,
                        }
                      )}
                      onClick={() => handleTaskActions(item.type)}
                      disabled={disabled}
                    >
                      {item.btn}
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Box>
      <CodeModal />
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={drawer.open}
        onClose={() => {
          setDrawer({ ...drawer, open: false })
          if (!isMobile)
            setTimeout(_ => {
              handleScrollTo({ top: document.documentElement.scrollHeight })
            }, 50)
        }}
      >
        <Image
          alt="Nextme Twitter Profile"
          width="1000"
          height="800"
          sizes="100vw"
          className="w-full"
          src={`${domains.cdn}/status/twitter_profile_connect.gif`}
          placeholder="blur"
          blurDataURL={getBlurDataURL(1000, 800)}
          draggable={false}
        />
        <ul className="w-full py-8 flex gap-12 justify-center">
          <li>
            <Button
              size="large"
              variant="contained"
              color="primary"
              className="shadow-sm rounded-md w-40 lg:w-48"
              onClick={() => handleCommonShare('portal')}
            >
              {`Open X(Twitter)`}
            </Button>
          </li>
          <li>
            <Button
              size="large"
              variant="contained"
              className="shadow-sm bg-create-gradient-001 rounded-md w-40 lg:w-48"
              onClick={() => handleTaskActions(TASK_TYPE.LINK_TWITTER)}
            >
              Verify X(Twitter)
            </Button>
          </li>
        </ul>
      </Drawer>
    </li>
  )
}
