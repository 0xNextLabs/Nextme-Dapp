import React, { useEffect, useState } from 'react'
import { Avatar, Box, Button, Typography } from '@mui/material'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useResetState } from 'ahooks'
import NmIcon from '@/components/nm-icon'
import NmTooltip from '@/components/nm-tooltip'
import { useSnackbar } from '@/components/context/snackbar'
import AccountsLayout from '@/components/layout/accounts'
import { nativeSocialEmbeds } from '@/config/bio/card'
import { useStudioData, useUserData } from '@/lib/hooks'
import { getConnectAuthUrl } from '@/services/auth'
import { getUserInfoSvc } from '@/services/user'

interface IAuthConnectCardValue {
  key?: string
  provider: string
  type: string
  desc?: string
  icon?: string
  class?: string
  isConnect?: any
  connectFunc?: Function
  handleClick?: Function
  isLoading?: boolean
  onComing?: boolean
  isOriginalAuth?: boolean
}

const AuthConnectCard = (item: IAuthConnectCardValue) => {
  let row = nativeSocialEmbeds.find(kk => kk.type === item.type)

  return (
    <article className="flex justify-center flex-col gap-5 p-6 border rounded-2xl">
      <header className="flex items-center justify-between text-black">
        <Box className="flex items-center">
          {item?.icon ? (
            <NmIcon type={`icon-${item?.icon}`} className={classNames('text-4xl leading-0 font-bold', item?.class)} />
          ) : (
            row && row?.image && <Avatar src={row?.image} className={classNames('rounded-md', item?.class)} />
          )}
          <p className="pl-4 font-medium text-lg xl:text-xl">{item.type}</p>
        </Box>
        <Box className="flex items-center gap-2">
          <Box className="w-40 text-right flex flex-col">
            {item.isConnect?.name && <p className="text-lg truncate">{item.isConnect?.name}</p>}
            {item.isConnect?.email && (
              <span className="text-neutral-400 text-sm truncate">{item.isConnect?.email}</span>
            )}
          </Box>
          {item.isConnect?.image && <Avatar src={item.isConnect?.image} className="skeleton rounded-full size-10" />}
        </Box>
      </header>
      <p className="text-neutral-400 min-h-32 lg:min-h-16">
        {item['desc'] || `Connect your ${item.type} account to quickly sign in and get more followers.`}
      </p>
      <NmTooltip title={item.onComing ? 'Upcoming' : ''} placement="top-end">
        <Button
          size="large"
          onClick={() => (item.isLoading ? {} : item.handleClick(item))}
          className={classNames(
            'text-white text-center w-full flex rounded-full h-12',
            item.isConnect || item.isOriginalAuth ? 'bg-red-500' : 'bg-black',
            item.isLoading && 'cursor-wait',
            item.onComing || item.isOriginalAuth ? 'cursor-not-allowed' : 'cursor-pointer'
          )}
        >
          {item.isLoading ? (
            <NmIcon type="icon-spin" className="leading-0 text-xl animate-spin" />
          ) : item.isConnect || item.isOriginalAuth ? (
            'Disconnect'
          ) : (
            'Connect'
          )}
        </Button>
      </NmTooltip>
    </article>
  )
}

export default function Connect() {
  const router = useRouter()
  const { showSnackbar } = useSnackbar()
  const studioData = useStudioData()
  const userData = useUserData()
  const [authConnectCardList, setAuthConnectCardList] = useState<IAuthConnectCardValue[]>([
    {
      provider: 'twitter',
      type: 'Twitter',
      icon: 'x',
      onComing: false,
      isLoading: false,
      isOriginalAuth: false,
    },
    {
      provider: 'discord',
      type: 'Discord',
      onComing: false,
      isLoading: false,
      isOriginalAuth: false,
    },
    {
      provider: 'google',
      type: 'Google',
      icon: 'google',
      onComing: false,
      isLoading: false,
      isOriginalAuth: false,
    },
    {
      provider: 'facebook',
      type: 'Facebook',
      onComing: false,
      isLoading: false,
      isOriginalAuth: false,
    },
    {
      provider: 'linkedin',
      type: 'Linkedin',
      icon: 'linkedin_colors',
      class: 'scale-110',
      onComing: true,
      isLoading: false,
      isOriginalAuth: false,
    },
    {
      provider: 'instagram',
      type: 'Instagram',
      onComing: true,
      isLoading: false,
      isOriginalAuth: false,
    },
    {
      provider: 'apple',
      type: 'Apple',
      icon: 'apple',
      class: 'text-4.5xl',
      onComing: true,
      isLoading: false,
      isOriginalAuth: false,
    },
    {
      provider: 'github',
      type: 'GitHub',
      onComing: true,
      isLoading: false,
      isOriginalAuth: false,
    },
  ])
  const [connectStatus, setConnectStatus, reset] = useResetState<Record<string, Object>>({
    twitter: null,
    discord: null,
    google: null,
    facebook: null,
    linkedin: null,
    instagram: null,
    apple: null,
    github: null,
  })
  const user = useUserData()
  useEffect(() => {
    const { oauth } = user
    if (!oauth) {
      reset()
      return
    }
    setConnectStatus({
      twitter: oauth?.twitter,
      discord: oauth?.discord,
      google: oauth?.google,
      facebook: oauth?.facebook,
      linkedin: oauth?.linkedin,
      instagram: oauth?.instagram,
      apple: oauth?.apple,
      github: oauth?.github,
    })
  }, [user])

  const handleConnect = async (oauth: IAuthConnectCardValue) => {
    const { isOriginalAuth, isConnect, provider, onComing } = oauth
    if (onComing) return
    if (isOriginalAuth) {
      showSnackbar({
        snackbar: {
          open: true,
          text: (
            <p>
              <span className="capitalize">{oauth?.provider}</span> cannot be disconnected.
            </p>
          ),
          type: 'error',
        },
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
      })
      return
    }
    let _authConnectCardList = authConnectCardList.map(authItem => {
      if (authItem.provider === provider) {
        authItem.isLoading = true
      }
      return authItem
    })
    setAuthConnectCardList(_authConnectCardList)
    try {
      const { url } = await getConnectAuthUrl(provider, { uuid: studioData?.uuid, isConnect: Boolean(isConnect) })
      if (!isConnect) {
        router.push(url)
        if (!url) {
          _authConnectCardList = authConnectCardList.map(authItem => {
            if (authItem.provider === provider) {
              authItem.isLoading = false
            }
            return authItem
          })
          showSnackbar({
            snackbar: {
              open: true,
              text: <span>Get {provider} url error, please try again.</span>,
              type: 'error',
            },
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
          })
          setAuthConnectCardList(_authConnectCardList)
        }
        return
      } else {
        try {
          await getConnectCallbackStatus(provider)
          showSnackbar({
            snackbar: {
              open: true,
              text: (
                <p>
                  <span className="capitalize">{provider}</span> disconnect success ᵔ◡ᵔ
                </p>
              ),
              type: 'success',
            },
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
          })
        } catch (error) {
          showSnackbar({
            snackbar: {
              open: true,
              text: <span>An error occurred during the disconnect {provider} process.</span>,
              type: 'error',
            },
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
          })
        }
      }
      _authConnectCardList = authConnectCardList.map(authItem => {
        if (authItem.provider === provider) {
          authItem.isLoading = false
        }
        return authItem
      })
      setAuthConnectCardList(_authConnectCardList)
    } catch (error) {
      _authConnectCardList = authConnectCardList.map(authItem => {
        if (authItem.provider === provider) {
          authItem.isLoading = false
        }
        return authItem
      })
      setAuthConnectCardList(_authConnectCardList)
    }
  }

  const getConnectCallbackStatus = async (provider = '') => {
    let _authConnectCardList = authConnectCardList.map(authItem => {
      if (provider && authItem.provider === provider) {
        authItem.isLoading = true
      }
      if (!provider) {
        authItem.isLoading = true
      }
      if (authItem.provider == userData?.oauth_signup_type) {
        authItem.isOriginalAuth = true
      }
      return authItem
    })
    setAuthConnectCardList(_authConnectCardList)
    let { data } = await getUserInfoSvc({ uuid: studioData.uuid })
    if (data?.oauth) {
      setConnectStatus({
        twitter: data.oauth?.twitter,
        discord: data.oauth?.discord,
        google: data.oauth?.google,
        facebook: data.oauth?.facebook,
        linkedin: data.oauth?.linkedin,
        instagram: data.oauth?.instagram,
        apple: data.oauth?.apple,
        github: data.oauth?.github,
      })
    }

    _authConnectCardList = authConnectCardList.map(authItem => {
      authItem.isLoading = false
      return authItem
    })

    if (router.query?.action_type == '2001') {
      showSnackbar({
        snackbar: {
          open: true,
          text: (
            <p>
              <span className="capitalize">{router.query?.provider}</span> connect success ᵔ◡ᵔ
            </p>
          ),
          type: 'success',
        },
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
      })
    } else if (router.query?.action_type == '1004') {
      showSnackbar({
        snackbar: {
          open: true,
          text: (
            <p>
              <span className="capitalize">{router?.query?.provider}</span> connected another account.
            </p>
          ),
          type: 'error',
        },
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
      })
    } else if (router.query?.action_type == '1001') {
      showSnackbar({
        snackbar: {
          open: true,
          text: (
            <p>
              An error occurred during the connect <span className="capitalize">{router?.query?.provider}</span>{' '}
              process.
            </p>
          ),
          type: 'error',
        },
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
      })
    }
    setAuthConnectCardList(_authConnectCardList)
  }
  useEffect(() => {
    getConnectCallbackStatus()
  }, [router.query?.action_type])
  return (
    <AccountsLayout>
      <header>
        <Typography variant="h5" className="font-semibold py-2">
          Connect App Integrations
        </Typography>
        <p className="mt-1 text-neutral-400">
          Here's an ongoing list of integrations to help you connect more social media, anytime, anywhere and more
          freedom with unified account login.
        </p>
      </header>
      <section className="pt-12 grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-8">
        {authConnectCardList.map((item, index) => {
          return (
            <AuthConnectCard
              key={item.provider}
              {...item}
              isConnect={connectStatus[item.provider]}
              handleClick={handleConnect}
              isLoading={item.isLoading}
            />
          )
        })}
      </section>
    </AccountsLayout>
  )
}
