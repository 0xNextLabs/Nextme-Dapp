import md5 from 'md5'
import { env } from '@/lib/types/env'
import config from '..'

export const SESSION_DELAY = 60 * 60 * 24 * 30
export const AUTH_SECRET: string = md5(env.authSecret)
const prefix = `${config.prefix}-`

export const tokenName = `${prefix}session`

export const defaultCookies = () => {
  return {
    sessionToken: {
      name: tokenName,
      options: {
        sameSite: 'lax',
        path: '/',
      },
    },
    preSessionToken: {
      name: `${prefix}pre-session-token`,
      options: {
        sameSite: 'lax',
        path: '/',
      },
    },
    pkceCodeVerifier: {
      name: `${prefix}pkce.code_verifier`,
      options: {
        sameSite: 'lax',
        path: '/',
      },
    },
    state: {
      name: `${prefix}state`,
      options: {
        sameSite: 'lax',
        path: '/',
      },
    },
    nonce: {
      name: `${prefix}nonce`,
      options: {
        sameSite: 'lax',
        path: '/',
      },
    },
  }
}
