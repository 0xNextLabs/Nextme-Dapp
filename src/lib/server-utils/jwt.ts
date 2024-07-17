import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { SESSION_DELAY, AUTH_SECRET, tokenName } from '@/config/server/auth-config'

export class AuthError extends Error {}

/*
 * @params {jwtToken} extracted from cookies
 * @return {object} object of extracted token
 */
export function verifyToken(jwtToken) {
  try {
    return jwt.verify(jwtToken, AUTH_SECRET)
  } catch (e) {
    return null
  }
}

export async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get(tokenName)?.value

  if (!token) return {}

  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(AUTH_SECRET))
    return verified.payload
  } catch (err) {
    return {}
  }
}

/**
 * @description 生成token令牌
 * @param payload
 * @param options
 * @returns
 */
export function signToken(payload, options?: jwt.SignOptions): string {
  const jwtOptions = {
    expiresIn: SESSION_DELAY, // 设置令牌的过期时间
    ...options,
  }
  return jwt.sign(payload, AUTH_SECRET, jwtOptions)
}

/*
 * @params {request} extracted from request response
 * @return {object} object of parse jwt cookie decode object
 */
export function getAppCookies(req) {
  const parsedItems = {}
  if (req.headers.cookie) {
    const cookiesItems = req.headers.cookie.split('; ')
    cookiesItems.forEach(cookies => {
      const parsedItem = cookies.split('=')
      parsedItems[parsedItem[0]] = decodeURI(parsedItem[1])
    })
  }
  return parsedItems
}

/**
 * @description 获取token中的载荷
 * @param req
 * @returns
 */
export function getPayloadByToken(req) {
  const cookies = getAppCookies(req)
  if (!cookies) {
    return null
  }
  const payload = verifyToken(cookies?.[tokenName]) as PayloadWithUser
  if (!payload) {
    return null
  }
  return payload
}
