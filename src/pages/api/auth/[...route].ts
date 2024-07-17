import type { NextApiRequest, NextApiResponse } from 'next'
import { BaseClient, TokenSet } from 'openid-client'
import { SiweMessage } from 'siwe'
import { nanoid } from 'nanoid'
import { connectOAuth, decrypt, oauth as serverOauth } from '@/lib/server-utils'
import { clearCookies, returnSession, _cookies } from '@/lib/server-utils/cookie'
import { checkCredential, createParams } from '@/lib/server-utils/auth'
import { getPayloadByToken } from '@/lib/server-utils/jwt'
import {
  addUser,
  appendDataToUser,
  appendOathDataToUser,
  getOneUserByName,
  getOneUserByProvider,
  getOneUserByUuid,
  getOneUserByWallet,
  isValidUser,
} from '@/lib/api/user'
import { isValidUserName, isValidUserNameForDomain } from '@/lib/domain/valid'
import { fetcher } from '@/lib/fetcher'
import { addPoint } from '@/lib/api/point'
import prisma from '@/lib/prisma'
import { AUTH_URL } from '@/config/server'
import config from '@/config'

const { host } = config

const randomCodeCount = 10

const matchRoute = (routes: string[], matcher: string[]) => {
  return routes.join('-') === matcher.join('-')
}

const fromSuffix = (req: NextApiRequest) => {
  const from = req.query?.from
  if (from && from !== 'undefined') {
    return `&from=${from}`
  } else {
    return ''
  }
}

/**
 * 处理所有api/auth/***请求的过滤器
 * - api/auth/callback/twitter?username=xxx
 * - api/auth/session -> 获取用户
 */
export default async function gateway(req: NextApiRequest, res: NextApiResponse) {
  let { route } = req.query as {
    route: string[]
  }

  // /api/auth/callback/xxx
  if (route.length === 2) {
    // 这里会从 cookie 中拿到用户 id 然后获取到对应的用户详细信息
    if (matchRoute(route, ['session'])) {
      const token = await getPayloadByToken(req)

      if (token && token.id && token.did) {
        const user = await getOneUserByUuid(token.id)

        res.status(200).json({
          user,
        })
      } else {
        return res.redirect('/gateway/auth-middleware?errorType=1013' + fromSuffix(req))
      }
      return
    }
    return await checkProcess(req, res)
  } else {
    return res.redirect('/gateway/auth-middleware?errorType=1013' + fromSuffix(req))
  }
}

/**
 * 登录/注册认证的全流程
 */
const checkProcess = async (req: NextApiRequest, res: NextApiResponse) => {
  let { route, state, credentials } = req.query as {
    route: string[]
    state: string
    credentials?: any
    username?: string
  }

  const provider = route[1]
  let username: string | undefined = req?.query?.username as string,
    address: string | undefined = req.query?.address as unknown as string,
    chainId: number = req.query?.chainId as unknown as number,
    chainType: string | undefined = req.query?.chainType as unknown as string,
    from: string | undefined = req.query?.from as string | undefined,
    isLogin = 1,
    isSignIn = req.query?.isSignIn,
    isConnect = req.query?.isConnect,
    redirectPathName = req.query?.redirectPathName

  let query
  if (state) {
    query = JSON.parse(await decrypt(state))
    isLogin = query?.isLogin
    isSignIn = query?.isSignIn
    username = username ? username : query.username
    isConnect = query?.isConnect
    redirectPathName = query?.redirectPathName
    chainType = query?.chainType
  }
  redirectPathName = redirectPathName ? redirectPathName : 'studio'
  // 这里是证明走的是connect流程 并且会在这一步返回 不会再往下进行
  if (isConnect) {
    handlerUserConnectOAuth(req, res)
    return
  }

  if (username == 'undefined') username = undefined

  if (username) {
    // 检查username & 域名 合法性（仅EVM链）
    const usernameValidForDomain = await isValidUserNameForDomain({ address, chainType, username })
    // 验证不通过
    if (!usernameValidForDomain) {
      return res.redirect('/gateway/auth-middleware?errorType=1035' + `&isSignIn=${isSignIn}` + fromSuffix(req))
    }
  }

  if (isLogin == 0) {
    return await isValidUser(req, res, async user => {
      try {
        let portal = `${host}/${user.username}`
        if (provider === 'discord') {
          const result = await getUserInOauth(req, res)
          if (result) {
            const { token, profile } = result
            const userResponse = await fetcher({
              url: 'https://discord.com/api/users/@me/guilds',
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token.access_token}`,
              },
            })
            if (Array.isArray(userResponse)) {
              const item = userResponse.find(item => item.name === 'Nextme')
              let isExist = false
              if (profile?.id) {
                const findOne = await prisma.point.findFirst({
                  where: {
                    extra: {
                      is: {
                        id: profile.id,
                      },
                    },
                  },
                })
                if (findOne) {
                  isExist = true
                }
              }
              if (item && !isExist) {
                await addPoint({
                  type: 10010,
                  uuid: user.uuid,
                  opt: user.uuid,
                  extra: {
                    guilds_id: item.id,
                    id: profile?.id,
                  },
                })
                return res.redirect(307, `${redirectPathName}?action_type=2002`)
              }
            }
          }
          return res.redirect(307, `${redirectPathName}?action_type=1002`)
        }
        if (provider === 'twitter') {
          const result = await getUserInOauth(req, res)
          if (result) {
            const { profile } = result
            if (profile.image) {
              profile.image = profile.image.replace(/\_normal\./, '_400x400.')
            }
            if (profile) {
              const point = async (extra: Record<string, any>) => {
                await addPoint({
                  type: 10009,
                  uuid: user.uuid,
                  opt: user.uuid,
                  extra,
                })
              }
              const { entities } = profile

              if (entities) {
                const { url, description } = entities
                const find = url?.urls?.find(
                  item => item.display_url?.includes(portal) || item.expanded_url?.includes(`https://${portal}`)
                )
                if (find) {
                  await point({
                    id: profile.id,
                    expanded: find.expanded_url,
                  })
                  return res.redirect(307, `${redirectPathName}?action_type=2001`)
                }

                if (description) {
                  const { urls } = description
                  const find = urls?.find(item => item.expanded_url?.includes(portal))
                  if (find) {
                    await point({
                      id: profile.id,
                      description,
                    })
                    return res.redirect(307, `${redirectPathName}?action_type=2001`)
                  }
                }
              }
            }
          }

          return res.redirect(307, `${redirectPathName}?action_type=1001`)
        } else {
          const result = await getUserInOauth(req, res)

          if (result) {
            const { profile } = result
            if (profile.image) {
              profile.image = profile.image.replace(/\_normal\./, '_400x400.')
            }
            if (profile) {
              const point = async (extra: Record<string, any>) => {
                await addPoint({
                  type: 10009,
                  uuid: user.uuid,
                  opt: user.uuid,
                  extra,
                })
              }
              const { entities } = profile

              if (entities) {
                const { url, description } = entities
                const find = url?.urls?.find(
                  item => item.display_url?.includes(portal) || item.expanded_url?.includes(`https://${portal}`)
                )
                if (find) {
                  await point({
                    id: profile.id,
                    expanded: find.expanded_url,
                  })
                  return res.redirect(307, `${redirectPathName}?action_type=2001`)
                }
                if (description) {
                  const { urls } = description
                  const find = urls?.find(item => item.expanded_url?.includes(portal))
                  if (find) {
                    await point({
                      id: profile.id,
                      description,
                    })
                    return res.redirect(307, `${redirectPathName}?action_type=2001`)
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        console.log('check media error: ', e)
      }
      return res.redirect(307, `${redirectPathName}?action_type=1003`)
    })
  }

  try {
    if (address && chainId !== undefined) {
      // connect下
      if (provider == 'wallet') {
        credentials = JSON.parse(credentials)
        // 来自evm通过siwe验证
        if (chainType == 'default') {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'))

          if (!AUTH_URL) {
            return res.redirect('/gateway/auth-middleware?errorType=1014' + `&isSignIn=${isSignIn}` + fromSuffix(req))
          }

          const nextAuthHost = new URL(AUTH_URL).host
          if (siwe.domain !== nextAuthHost) {
            return res.redirect('/gateway/auth-middleware?errorType=1015' + `&isSignIn=${isSignIn}` + fromSuffix(req))
          }

          if (siwe.nonce !== req.cookies[_cookies['nonce'].name]) {
            return res.redirect('/gateway/auth-middleware?errorType=1016' + `&isSignIn=${isSignIn}` + fromSuffix(req))
          }

          await siwe.validate(credentials?.signature || '')
          chainId = siwe.chainId
          address = siwe.address as `0x${string}`
        } else {
          chainId = 1
        }
        const user = await getOneUserByWallet({ chainType, address })

        if (user) {
          if (!user.inviteCode) {
            await appendDataToUser({
              user,
              data: {
                inviteCode: nanoid(randomCodeCount),
              },
            })
          }

          if (username && username !== user?.username) {
            return res.redirect('/gateway/auth-middleware?errorType=1002' + `&isSignIn=${isSignIn}` + fromSuffix(req))
          }
          return await returnSession(req, res, user.uuid, from)
        } else {
          // 注册
          if (username) {
            const { status } = isValidUserName(username)
            if (!status)
              return res.redirect('/gateway/auth-middleware?errorType=1028' + `&isSignIn=${isSignIn}` + fromSuffix(req))
          } else {
            return res.redirect('/gateway/auth-middleware?errorType=1034' + `&isSignIn=${isSignIn}` + fromSuffix(req))
          }

          const id = await addUser({
            req,
            username,
            oauth_signup_type: 'wallet',
            chain: {
              [chainType]: {
                id: Number(chainId),
                address: address,
              },
            },
            query,
            inviteCode: nanoid(randomCodeCount),
            ...(from && from != 'undefined' ? { from: from } : {}),
          })
          if (!id)
            return res.redirect('/gateway/auth-middleware?errorType=1027' + `&isSignIn=${isSignIn}` + fromSuffix(req))
          return await returnSession(req, res, id, from)
        }
      } else {
        if (!username) return res.redirect('/gateway/auth-middleware?errorType=1088' + `&isSignIn=${isSignIn}`)
        const user = await getOneUserByName(username)
        if (user) {
          const result = await getUserInOauth(req, res)
          if (result) {
            const { profile } = result
            if (!user.inviteCode) {
              await appendDataToUser({
                user,
                data: {
                  inviteCode: nanoid(randomCodeCount),
                },
              })
            }
          }
          return await returnSession(req, res, user.uuid, from)
        } else {
          // 注册
          const result = await getUserInOauth(req, res)
          if (result) {
            const { profile } = result
            const otherProfileUser = await getOneUserByProvider(provider, profile.id)
            if (otherProfileUser) {
              return res.redirect('/gateway/auth-middleware?errorType=1004' + `&isSignIn=${isSignIn}` + fromSuffix(req))
            } else {
              // 注册
              if (username) {
                const { status } = isValidUserName(username)
                if (!status)
                  return res.redirect(
                    '/gateway/auth-middleware?errorType=1028' + `&isSignIn=${isSignIn}` + fromSuffix(req)
                  )
              } else {
                return res.redirect(
                  '/gateway/auth-middleware?errorType=1034' + `&isSignIn=${isSignIn}` + fromSuffix(req)
                )
              }
              const id = await addUser({
                req,
                username,
                oauth_signup_type: provider,
                oauth: {
                  [provider]: profile || {},
                },
                query,
                inviteCode: nanoid(randomCodeCount),
              })
              if (!id)
                return res.redirect(
                  '/gateway/auth-middleware?errorType=1027' + `&isSignIn=${isSignIn}` + fromSuffix(req)
                )
              return await returnSession(req, res, id, from)
            }
          }
          return res.redirect('/gateway/auth-middleware?errorType=1016' + `&isSignIn=${isSignIn}` + fromSuffix(req))
        }
      }
    } else if (!address && chainId === undefined) {
      // 无connect下
      const result = await getUserInOauth(req, res)

      if (result) {
        const { profile } = result
        const user = await getOneUserByProvider(provider, profile.id)
        // 使用oauth登录，但是oauth已经绑定过其他账户，和当前用户名不符合
        if (user && username && user?.username !== username) {
          return res.redirect('/gateway/auth-middleware?errorType=1011' + '&isSignIn=true' + fromSuffix(req))
        }
        if (profile) {
          if (user) {
            if (!user.inviteCode) {
              await appendDataToUser({
                user,
                data: {
                  inviteCode: nanoid(randomCodeCount),
                },
              })
            }
            if (user?.oauth?.[provider]?.id == profile.id) {
              return await returnSession(req, res, user.uuid, from)
            } else {
              return res.redirect('/gateway/auth-middleware?errorType=1012' + `&isSignIn=${isSignIn}` + fromSuffix(req))
            }
          } else {
            const otherUser = await getOneUserByProvider(provider, profile.id)
            if (otherUser) {
              return res.redirect('/gateway/auth-middleware?errorType=1011' + `&isSignIn=true` + fromSuffix(req))
            } else {
              // 注册
              if (username) {
                const { status } = isValidUserName(username)
                if (!status)
                  return res.redirect(
                    '/gateway/auth-middleware?errorType=1028' + `&isSignIn=${isSignIn}` + fromSuffix(req)
                  )
              } else {
                return res.redirect(
                  '/gateway/auth-middleware?errorType=1034' + `&isSignIn=${isSignIn}` + fromSuffix(req)
                )
              }
              const id = await addUser({
                req,
                username,
                oauth_signup_type: provider,
                oauth: {
                  [provider]: profile || {},
                },
                query,
                inviteCode: nanoid(randomCodeCount),
              })
              if (!id)
                return res.redirect(
                  '/gateway/auth-middleware?errorType=1027' + `&isSignIn=${isSignIn}` + fromSuffix(req)
                )
              return await returnSession(req, res, id, from)
            }
          }
        }
      }
      return res.redirect('/gateway/auth-middleware?errorType=1016' + `&isSignIn=${isSignIn}` + fromSuffix(req))
    } else {
      return res.redirect('/gateway/auth-middleware?errorType=1019' + `&isSignIn=${isSignIn}` + fromSuffix(req))
    }
  } catch (e) {
    console.log('error-------', e)
    return res.redirect('/gateway/auth-middleware?errorType=1024' + `&isSignIn=${isSignIn}` + fromSuffix(req))
  }
}

/**
 * oauth 认证时去token_end_point和user_end_point获取第三方信息
 */
export const getUserInOauth = async (req: NextApiRequest, res: NextApiResponse, requestUser = true) => {
  //   tea.report(`Start OAuth`)
  console.log('start oauth')

  const { route, state } = req.query

  const provider = route[1]
  let token: TokenSet // 登录时从oauth的token服务器拿到的access_token等信息
  let profile: any // 从oauth的user服务器拿到的用户信息，各家字段不同
  let isConnect = req.query?.isConnect
  let client = {} as BaseClient
  let query
  if (state) {
    query = JSON.parse(await decrypt(state))
    isConnect = query?.isConnect
  }
  let oauth = isConnect ? connectOAuth : serverOauth
  if (isConnect) {
    client = connectOAuth.client(provider)
  } else {
    client = oauth.client(provider)
  }
  if (client) {
    const params = createParams({
      provider,
      query: req.query as unknown as Record<string, any>,
      body: req.body,
      method: req.method,
      client,
    })
    // 这里做一次state和pkce的检查，防止csrf攻击
    const checks = checkCredential(req.cookies, req.query, oauth.checks(provider))
    if (oauth.idToken(provider)) {
      token = await client.callback(oauth.callback(provider), params, checks, {
        exchangeBody: {
          client_secret: oauth.secret(provider).client_secret,
          client_id: oauth.secret(provider).client_id,
        },
      })
    } else {
      token = await client.oauthCallback(oauth.callback(provider), params, checks, {
        exchangeBody: {
          client_secret: oauth.secret(provider).client_secret,
          client_id: oauth.secret(provider).client_id,
        },
      })
    }
    // 在之前要计算oauth的token认证所要求的params以及checks

    if (Array.isArray(token.scope)) {
      token.scope = token.scope.join(' ')
    }

    // TODO: 这里后续需要采用链式执行，传递上下文
    // await oauth.hooks.execToken(provider, token)

    // 根据先前传入的scope获取用户的资源信息，用于做数据画像
    if (requestUser) {
      const userInfoRequest = oauth.userInfoRequest(provider)
      if (userInfoRequest) {
        profile = await userInfoRequest({
          params: oauth.userinfo(provider),
          tokens: token,
          client,
        })
      } else if (oauth.idToken(provider)) {
        profile = token.claims()
      } else {
        profile = await client.userinfo(token, {
          params: oauth.userinfo(provider),
        })
      }
      profile = await oauth.profile(provider)?.(profile, token)
      // console.log('transform profile: ', profile)
      // TODO: 这里后续需要采用链式执行，传递上下文
      // await oauth.hooks.execUserInfo(provider, profile)
    }

    // 删除state和okceVerifier的临时存储变量

    clearCookies(req.cookies, res)

    // tea.report(`End OAuth`)
    return { profile, token }
  } else {
    // tea.report(`Client Error`)
    return false
  }
}

const handlerUserConnectOAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const { route } = req.query
  let uuid = req?.query?.uuid as string
  if (req?.query?.state) {
    let query = JSON.parse(await decrypt(req.query.state))
    uuid = query?.uuid
  }

  const provider = route[1]
  const user = await getOneUserByUuid(uuid)
  const result = await getUserInOauth(req, res)
  if (result) {
    const { profile } = result

    const otherProfileUser = await getOneUserByProvider(provider, profile.id)
    if (otherProfileUser) {
      // 其他账户已经存在
      return res.redirect(`/accounts?action_type=1004&provider=${provider}`)
    } else {
      await appendOathDataToUser({
        user,
        data: {
          [provider]: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            image: profile.image,
          },
        },
      })
      return res.redirect(`/accounts?action_type=2001&provider=${provider}`)
    }
  } else {
    return res.redirect(`/accounts?action_type=1001&provider=${provider}`)
  }
}
