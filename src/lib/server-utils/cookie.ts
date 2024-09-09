import { serialize } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import { getOneUserByUuid } from '@/lib/api/user'
import { decrypt, encrypt } from './crypto.mjs'
import { signToken } from './jwt'
import { defaultCookies, SESSION_DELAY, tokenName } from '@/config/server/auth-config'

export const _cookies = defaultCookies()

export const setCookie = (res: NextApiResponse, cookie: Record<string, any>) => {
  let setCookieHeader: any[] = (res.getHeader('Set-Cookie') ?? []) as any[]
  if (!Array.isArray(setCookieHeader)) {
    setCookieHeader = [setCookieHeader]
  }
  const { name, value, options } = cookie
  const cookieHeader = serialize(name, value, options)
  setCookieHeader.push(cookieHeader)
  res.setHeader('Set-Cookie', setCookieHeader)
}

export const getExtraFromToken = async (cookies: Record<string, any>) => {
  const decodeStr = await decryptCookie(cookies[_cookies['sessionToken'].name])
  try {
    const { extra } = JSON.parse(decodeStr) as { extra: Record<string, any> }
    return extra
  } catch (e) {
    return null
  }
}

export const clearCookies = (
  cookies: Record<string, any>,
  res: NextApiResponse,
  clearList = ['state', 'pkceCodeVerifier']
) => {
  const newCookies = clearList.map(cookie => ({
    name: _cookies[cookie].name,
    value: '',
    options: {
      ...(cookies?.[_cookies[cookie].name]?.options ? cookies?.[_cookies[cookie].name]?.options || {} : {}),
      maxAge: 0,
    },
  }))
  newCookies.forEach(cookie => setCookie(res, cookie))
}

/**
 * 向 response 的请求头上添加cookie
 */
export const returnSession = async (req: NextApiRequest, res: NextApiResponse, id: string, from: string) => {
  const user = await getOneUserByUuid(id)
  setCookie(res, {
    name: tokenName,
    value: signToken({ id }),
    options: {
      sameSite: 'lax',
      path: '/',
      expires: getExpires(SESSION_DELAY),
    },
  })
  res.redirect(307, `/gateway/auth-middleware?actionType=2001${from && from !== 'undefined' ? '&from=' + from : ''}`)
}

/**
 * 向token中添加额外的信息，比如是否自动聚合等
 */
export const addExtraInUser = async (oldCookie: Record<string, any> = {}, newExtra: Record<string, any> = {}) => {
  const sessionName = _cookies['sessionToken'].name
  const decodeStr = await decryptCookie(oldCookie[_cookies['sessionToken'].name])
  try {
    const {
      expire,
      id,
      extra = {},
    } = JSON.parse(decodeStr) as { id: string; expire: number; extra: Record<string, any> }
    return {
      name: sessionName,
      value: encryptCookie(
        JSON.stringify({
          id,
          expire,
          extra: {
            ...extra,
            ...newExtra,
          },
        })
      ),
      options: {
        ...(oldCookie[sessionName]?.options || {}),
        sameSite: 'lax',
        path: '/',
        expires: getExpires(SESSION_DELAY),
      },
    }
  } catch (e) {
    return {}
  }
}

export const removeExtraInUser = async (oldCookie: Record<string, any> = {}, keys: string[] = []) => {
  const sessionName = _cookies['sessionToken'].name
  const decodeStr = await decryptCookie(oldCookie[_cookies['sessionToken'].name])
  try {
    const { extra, ...rest } = JSON.parse(decodeStr) as { extra: Record<string, any> }
    if (extra) {
      keys.forEach(key => {
        delete extra[key]
      })
    }
    return {
      name: sessionName,
      value: encryptCookie(
        JSON.stringify({
          ...rest,
          extra,
        })
      ),
      options: oldCookie[sessionName]?.options || {
        sameSite: 'lax',
        path: '/',
        expires: getExpires(SESSION_DELAY),
      },
    }
  } catch (e) {
    return {}
  }
}

export const encryptCookie = async (value: string): Promise<string> => {
  return await encrypt(value)
}

export const decryptCookie = async (value: string): Promise<string> => {
  return value ? await decrypt(value) : ''
}

/**
 * 获取过期的时间点
 */
export const getExpires = (delay: number): Date => {
  const expire = new Date()
  expire.setTime(expire.getTime() + delay * 1000)
  return expire
}
