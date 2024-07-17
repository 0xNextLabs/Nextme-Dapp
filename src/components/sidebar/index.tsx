import { Avatar, Box, Button, IconButton } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { useLocalStorageState, useSessionStorageState } from 'ahooks'
import Header from '@/components/header'
import NmIcon from '@/components/nm-icon'
import NmBorderCounter from '@/components/nm-border-counter'
import { useAvatar, useStudioData, useUserData } from '@/lib/hooks'
import { obValue } from '@/lib/observer'
import { signOut } from '@/services/auth'

import config from '@/config'

const { prefix, domains } = config

let menus = [
  {
    name: 'Home',
    icon: 'home',
    path: '/studio',
  },
  {
    name: 'Explore',
    icon: 'organization',
    path: '/explore',
  },
  {
    name: 'Meetups',
    icon: 'meetups',
    path: '/meetups',
  },
  {
    name: 'Wallet',
    icon: 'wallet_outline',
    path: '/wallet',
    class: 'max-sm:w-fit h-fit max-sm:fixed max-sm:left-auto max-sm:top-3.5 max-sm:pr-36',
  },
  {
    name: 'Pay +',
    icon: 'payment',
    path: '/pay',
  },
  {
    name: 'Messages',
    icon: 'community',
    path: '/messages',
    class: 'max-sm:w-fit h-fit max-sm:fixed max-sm:left-auto max-sm:top-3.5 max-sm:pr-18',
  },
  {
    name: 'All in Bio',
    icon: 'user',
  },
  {
    name: 'Claim Bio Rewards',
    type: 'ads',
    class: 'max-sm:fixed max-sm:right-56 max-sm:top-3 max-sm:shadow-none max-sm:bg-transparent',
  },
  {
    name: 'More',
    icon: 'more',
    class: 'max-sm:w-fit h-fit fixed sm:absolute max-sm:left-auto max-sm:right-0 max-sm:top-3.5 mx-2 bg-white',
    paths: ['accounts', 'notifications', 'additional'],
    submenu: [
      {
        name: 'Settings',
        icon: 'settings',
        path: '/accounts',
      },
      {
        name: 'Feedback',
        icon: 'message',
        path: 'https://discord.gg/mxTew3aerd',
        target: '_blank',
      },
      {
        name: 'Contact',
        icon: 'contact',
        path: 'https://nextme.one/nextme.eth',
        target: '_blank',
      },
      {
        name: 'Docs',
        icon: 'news',
        path: 'https://docs.nextme.one',
        target: '_blank',
        class: 'after:border-neutral-200 after:border-b after:-mx-2 after:pb-5',
      },
      {
        name: 'Log out',
        key: 'logout',
      },
    ],
  },
]

const SideBar = ({ ...props }) => {
  const router = useRouter()
  const user = useUserData()
  const { avatar } = useAvatar()
  const { editEd } = useStudioData()

  const [bioClaimStatus, setBioClaimStatus] = useLocalStorageState<boolean | undefined>(
    `${prefix}.${user?.uuid}.bio_claim.status`,
    {
      defaultValue: true,
    }
  )

  const [bioCreateStatus, setBioCreateStatus] = useSessionStorageState<boolean | undefined>(`${prefix}.bio.create`, {
    defaultValue: false,
  })

  const handleBioClaim = () => {
    if (router.asPath.startsWith(`/${user?.username}`)) {
      router.replace('/wallet')
    } else {
      router.push(`/${user?.username}?tab=blocks`)
    }
  }

  const handleLogOut = e => {
    if (editEd) {
      obValue.tip(() => {
        signOut()
      })
    } else {
      signOut()
    }
  }

  return (
    <aside className="text-zinc-900 bg-white flex flex-row sm:flex-col items-center fixed z-50 top-0 max-sm:border-b max-sm:border-r-0 max-sm:h-fit size-full sm:w-20 lg:w-56 xl:w-60 px-2 sm:px-0 border-r">
      <Header
        action={false}
        customClass="h-fit !pt-0 my-2 sm:max-xl:my-8 xl:my-5 lg:-ml-1"
        logoImgClass="max-lg:size-12"
        logoTextClass="text-black max-lg:hidden"
      />
      <ul className="bg-white justify-end menu menu-horizontal flex-nowrap sm:menu-vertical max-sm:border-t max-sm:pb-0 max-sm:justify-between max-sm:items-center gap-3 sm:max-lg:gap-5 lg:gap-2 text-base leading-9 w-full fixed sm:static left-0 bottom-0">
        {menus.map((row, index) => {
          let userMenu = row.name.toLowerCase().includes('bio') && avatar
          let routePaths = router?.asPath.split('/').filter(e => e)
          return row?.type === 'ads' ? (
            router?.query?.tab !== 'blocks' && bioClaimStatus && (
              <li className={classNames('bg-neutral-100 shadow-sm rounded-lg lg:pt-1.5 2xl:p-2', row?.class)}>
                <Box className="flex sm:flex-col text-center hover:bg-transparent relative px-2">
                  <Image
                    alt=""
                    width="40"
                    height="40"
                    src={`${domains.cdn}/status/icon_discount.png`}
                    className="max-lg:w-7 max-lg:h-7 animate__animated animate__pulse animate__infinite animate__slower"
                    onClick={handleBioClaim}
                  />
                  <p className="max-lg:hidden text-xs text-neutral-400 lg:py-1">
                    Not just Coins, <br />
                    But Token Earnings.
                  </p>
                  <Button
                    variant="contained"
                    className="max-lg:hidden w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-sm rounded-md"
                    onClick={handleBioClaim}
                  >
                    {row?.name}
                  </Button>
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    className="bg-neutral-200 static sm:absolute right-2 top-2 scale-90 max-lg:hidden"
                    onClick={() => setBioClaimStatus(false)}
                  >
                    <NmIcon type="icon-close" className="text-neutral-800" />
                  </IconButton>
                </Box>
              </li>
            )
          ) : (
            <li
              key={`sidebar-menu-item-${index}`}
              className={classNames(
                'group hover:transition-all left-0 right-0 bottom-1 sm:max-lg:tooltip tooltip-right last:tooltip-top dropdown dropdown-left sm:dropdown-right dropdown-bottom sm:dropdown-end',
                row?.class
              )}
              tabIndex={index + 1}
              data-tip={row.name}
              onClick={() => userMenu && setBioCreateStatus(true)}
            >
              <Link
                href={(userMenu ? `/${user?.username}` : row?.path) || ''}
                className={classNames('flex items-center max-lg:justify-center', {
                  'focus font-bold text-black':
                    (row?.path && router?.pathname == row?.path) ||
                    (userMenu && router?.asPath.includes(user?.username)) ||
                    (row?.submenu && row?.paths && routePaths.find(kk => row?.paths.includes(kk))),
                })}
                onClick={e => !row?.path && !userMenu && e.preventDefault()}
              >
                {userMenu ? (
                  <NmBorderCounter speed="smooth" customClass="rounded-full p-1 lg:-ml-1">
                    <Avatar src={avatar} className="size-6 lg:w-7 lg:h-7" />
                  </NmBorderCounter>
                ) : (
                  row?.icon && (
                    <NmIcon
                      type={`icon-${row?.icon}`}
                      className="text-2xl leading-0 group-hover:scale-105 group-hover:font-extrabold"
                    />
                  )
                )}
                <span className={classNames('max-lg:hidden', userMenu ? 'pl-0.5' : 'pl-2')}>{row.name}</span>
              </Link>
              {row?.submenu && row?.submenu?.length && (
                <ul
                  tabIndex={index + 1}
                  className="dropdown-content dropdown-hover menu bg-white shadow-sm before:hidden border rounded-box gap-2 w-fit sm:w-50 xl:w-56 ml-2 text-base leading-9 max-sm:top-14 max-sm:right-0 z-100"
                >
                  {row?.submenu.map((item, index) => (
                    <li
                      key={`sidebar-submenu-item-${index}`}
                      className={classNames(item?.class)}
                      onClick={e => item?.key === 'logout' && handleLogOut(e)}
                    >
                      <Link
                        href={item?.path || ''}
                        className={classNames('flex items-center', {
                          'focus font-bold text-black':
                            item?.path &&
                            row?.paths &&
                            routePaths.find(kk => row?.paths.includes(kk)) &&
                            item?.path
                              .split('/')
                              .filter(e => e)
                              .find(kk => row?.paths.includes(kk)),
                        })}
                        target={item?.target}
                      >
                        {item?.icon && (
                          <NmIcon type={`icon-${item?.icon}`} className="text-2xl leading-0 hover:scale-105 mr-3" />
                        )}
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default SideBar
