import md5 from 'md5'
import { env } from '@/lib/types/env'
import config from '..'

const { prefix } = config

export const SESSION_DELAY = 60 * 60 * 24 * 30
export const AUTH_SECRET: string = md5(env.authSecret)

export const tokenName = `${prefix}_session`

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
      name: `${prefix}_pre-session-token`,
      options: {
        sameSite: 'lax',
        path: '/',
      },
    },
    pkceCodeVerifier: {
      name: `${prefix}_pkce.code_verifier`,
      options: {
        sameSite: 'lax',
        path: '/',
      },
    },
    state: {
      name: `${prefix}_state`,
      options: {
        sameSite: 'lax',
        path: '/',
      },
    },
    nonce: {
      name: `${prefix}_nonce`,
      options: {
        sameSite: 'lax',
        path: '/',
      },
    },
  }
}
