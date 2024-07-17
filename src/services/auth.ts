// https://nextjs.org/docs/basic-features/data-fetching/client-side
import { NextRouter } from 'next/router'
import storage from 'redux-persist/lib/storage'
import { oauthPopWindow } from '@/lib/class/oauthPopWindow'
import { fetcher } from '@/lib/fetcher'
import { tokenName } from '@/config/server/auth-config'
import config from '@/config'

const { prefix } = config

export function getUserSessionSvc() {
  return fetcher({
    url: 'api/auth/session',
  })
}

export function getProviderSvc() {
  return fetcher({
    url: 'api/auth/providers',
  })
}

export function getCsrfToken() {
  return fetcher({
    url: 'api/auth/csrf',
  })
}

export const getAuthUrl = (name: string, query: Record<string, any>): Promise<{ url: string }> => {
  return fetcher({
    url: 'api/oauth/url',
    params: {
      name,
      ...query,
    },
    withCredentials: true,
  })
}

export const getConnectAuthUrl = (name: string, query: Record<string, any>): Promise<{ url: string }> => {
  return fetcher({
    url: 'api/oauth/connect-url',
    params: {
      name,
      ...query,
    },
    withCredentials: true,
  })
}

const buildSearchParams = (params: Record<string, string>) => {
  let search = ''
  Object.keys(params).forEach(key => {
    search += `${key}=${encodeURIComponent(
      typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key]
    )}&`
  })
  return search.slice(0, search.length - 1)
}

/**
 * 通过钱包或第三方登录进行认证
 */
export const startAuth = async (
  props: {
    name: string
    query?: {
      isSignIn: boolean
      username: string
      address?: string
      chainId?: number
      chainType?: string
      from?: string
      openNewWindow?: boolean
      credentials?: Record<string, string | boolean>
      _fp?: string
    }
  },
  router: NextRouter,
  beforeRedirect?: () => void
) => {
  const { name, query } = props
  if (name === 'wallet') {
    oauthPopWindow.setChannelMessage({
      redirect: true,
      url: '',
    })

    beforeRedirect?.()
    router.push('/api/auth/callback/wallet?' + buildSearchParams(query as any))
  } else {
    const { url } = await getAuthUrl(name, query)
    if (!url) return
    if (!props.query.openNewWindow) {
      router.push(url)
    } else {
      oauthPopWindow.openWindow(url)
      beforeRedirect?.()
    }
  }
}

export const signOut = async () => {
  const date = new Date()
  date.setTime(date.getTime() + -1 * 1000 * 60 * 60 * 24)
  document.cookie = tokenName + '=; ' + 'expires=' + date.toUTCString() + '; path=/'
  document.cookie = `${prefix}-new-session-token=; ${'expires=' + date.toUTCString()}; path=/`
  storage.removeItem(`persist:${prefix}`)
  localStorage.removeItem(`${prefix}.bottom_card.show`)
  location.href = `${location.origin}/gateway`
}

export const clearRestCookie = () => {
  const date = new Date()
  date.setTime(date.getTime() + -1 * 1000 * 60 * 60 * 24)
  document.cookie = `${prefix}-pre-session-token=; ${'expires=' + date.toUTCString()}; path=/`
  document.cookie = `${prefix}-nonce=; ${'expires=' + date.toUTCString()}; path=/`
  document.cookie = `${prefix}-pkce.code_verifier=; ${'expires=' + date.toUTCString()}; path=/`
  document.cookie = `${prefix}-state=; ${'expires=' + date.toUTCString()}; path=/`
}

export function checkAdmin() {
  return fetcher({
    url: 'api/opt/check',
    method: 'post',
  })
}
