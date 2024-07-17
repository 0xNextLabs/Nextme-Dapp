import { PROVIDERS } from '@/config/server'
import { Issuer, BaseClient, generators, custom, TokenSet, OAuthCallbackChecks } from 'openid-client'
import { getExpires, _cookies } from './cookie'
import { encrypt } from './crypto.mjs'

const promiseValue = () => {
  let resolve, reject
  return {
    promise: new Promise((res, rej) => {
      resolve = res
      reject = rej
    }),
    resolve,
    reject,
  }
}
const { promise, resolve, reject } = promiseValue()

export type URLWrapper = {
  url: string
  query?: Record<string, string>
}

export type AuthProvider = {
  name: string
  config: {
    authorization: URLWrapper
    token: URLWrapper
    userInfo: URLWrapper
    clientId: string
    clientSecret: string
    callbackUrl: string
    jwt: {
      secret: string
    }

    [key: string]: any
  }
}

type TokenFunc = (token: TokenSet) => Promise<void>
type UserInfoFunc = (user: any) => Promise<void>

export class OAuthHooks {
  tokens: Map<string, TokenFunc[]> = new Map()
  userInfos: Map<string, UserInfoFunc[]> = new Map()

  constructor() {}

  addToken(name: string, fn: TokenFunc) {
    if (this.tokens.has(name)) {
      this.tokens.get(name).push(fn)
    } else {
      this.tokens.set(name, [fn])
    }
  }

  addUserInfo(name: string, fn: UserInfoFunc) {
    if (this.userInfos.has(name)) {
      this.userInfos.get(name).push(fn)
    } else {
      this.userInfos.set(name, [fn])
    }
  }

  async execToken(name: string, token: TokenSet) {
    if (this.tokens.has(name)) {
      for (const fn of this.tokens.get(name)) {
        await fn(token)
      }
    }
  }

  async execUserInfo(name: string, user: any) {
    if (this.userInfos.has(name)) {
      for (const fn of this.userInfos.get(name)) {
        await fn(user)
      }
    }
  }
}

export class OAuth {
  providers = new Map()

  connectProviders = new Map()

  issuers: Map<string, Issuer<BaseClient>> = new Map()

  connectIssuers: Map<string, Issuer<BaseClient>> = new Map()

  clients: Map<string, BaseClient> = new Map()

  connectClients: Map<string, BaseClient> = new Map()

  hooks = new OAuthHooks()

  constructor(provider?: AuthProvider[]) {
    this.addProviders(provider || [])
  }

  authorization(name: string): Record<string, any> {
    if (this.providers.has(name)) {
      return this.providers.get(name)['authorization'].query || {}
    }
    return {}
  }

  connectAuthorization(name: string): Record<string, any> {
    if (this.connectProviders.has(name)) {
      return this.connectProviders.get(name)['authorization'].query || {}
    }
    return {}
  }

  callback(name: string): string {
    if (this.providers.has(name)) {
      return this.providers.get(name)['callbackUrl'] || ''
    }
    return ''
  }

  userinfo(name: string): Record<string, any> {
    if (this.providers.has(name)) {
      return this.providers.get(name)['userInfo']?.query || {}
    }
    return {}
  }

  userInfoRequest(name: string): any {
    if (this.providers.has(name)) {
      return this.providers.get(name)['userInfo']?.request
    }
    return null
  }

  secret(name: string): Record<string, string> {
    if (this.providers.has(name)) {
      return {
        client_id: this.providers.get(name)['clientId'],
        client_secret: this.providers.get(name)['clientSecret'],
      }
    }
    return {}
  }

  idToken(name: string): boolean {
    if (this.providers.has(name)) {
      return Boolean(this.providers.get(name).idToken)
    }
    return false
  }

  checks(name: string): string[] {
    if (this.providers.has(name)) {
      return this.providers.get(name)['checks'] || ['state', 'pkce']
    }
    return ['state', 'pkce']
  }

  callbackUrl(name: string): string {
    if (this.providers.has(name)) {
      return this.providers.get(name)['callbackUrl']
    }
    return ''
  }

  profile(name: string): (profile: any, token: any) => any {
    if (this.providers.has(name)) {
      return this.providers.get(name)['profile']
    }
    return () => ({})
  }

  client(name: string) {
    return this.clients.get(name)
  }

  connectClient(name: string) {
    return this.connectClients.get(name)
  }

  async addProvider(provider: AuthProvider) {
    this.providers.set(provider.name, provider.config)
    const { authorization, token, userInfo, clientId, clientSecret, callbackUrl, wellKnown } = provider.config
    if (authorization && token && userInfo && clientId && clientSecret && callbackUrl) {
      let issuer
      if (wellKnown) {
        // 使用一个新的 Promise 来包装 Issuer.discover(wellKnown)
        await new Promise((innerResolve, innerReject) => {
          Issuer.discover(wellKnown)
            .then(discoveredIssuer => {
              issuer = discoveredIssuer
              innerResolve('ok')
            })
            .catch(error => {
              innerReject(error)
            })
        }).catch(error => {
          throw error // 抛出错误，以便调用方能够处理
        })
      } else {
        issuer = new Issuer({
          issuer: provider.name,
          authorization_endpoint: authorization.url,
          token_endpoint: token.url,
          userinfo_endpoint: userInfo.url,
        })
      }
      const client = new issuer.Client({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uris: [callbackUrl],
        ...(provider.config?.client || {}),
      })
      client[custom.clock_tolerance] = 10

      this.clients.set(provider.name, client)
      this.issuers.set(provider.name, issuer)
    }

    // 返回一个 Promise，表示方法执行完毕
    return new Promise((innerResolve, innerReject) => {
      innerResolve('ok') // 在这里调用内部的 resolve，表示当前 addProvider 方法执行完毕
    })
  }

  async addProviders(providers: AuthProvider[]) {
    // 存储每个 this.addProvider(provider) 的 Promise
    const promises = providers.map(provider => this.addProvider(provider))
    console.log(providers.length, 'provider added success ᵔ◡ᵔ')

    // 等待所有的 this.addProvider(provider) 方法执行完毕
    await Promise.all(promises)

    resolve() // 在这里调用外部定义的 resolve 表示所有操作完成
  }
  // @deprecated 刷新callback的searchParam，url无法改动
  refreshCallbackUrl(name: string, callbackSearch: Record<string, string>) {
    if (this.providers.has(name)) {
      const { callbackUrl, ...rest } = this.providers.get(name)
      const cbUrl = buildUrl(callbackUrl, callbackSearch)
      this.addProvider({
        name,
        config: {
          ...rest,
          callbackUrl: cbUrl,
        },
      })
    }
  }

  async getAuthUrl(name: string, query: Record<string, string>) {
    // 刷新callback，将query塞进去（这里因为是_self页面式的刷新，所以采用这种策略）
    // 背景是我们在注册的时候必须要绑定一个已定义的域名作为用户名，如果oauth回调不给这个域名，除非从localstorage中去拿，否则没有途径知道哪个用户注册了
    // - 还可以采用popup式的弹出登录，但这可能需要通过一些奇淫技巧解决兼容性问题
    // - 也可以跳转新页面

    await promise

    if (this.clients.has(name)) {
      const client = this.clients.get(name)
      const { authorizationParams, cookies } = await addField(query)

      const url = client.authorizationUrl({ ...this.authorization(name), ...authorizationParams })

      return { url, cookies }
    }
    return { url: null, cookies: [] }
  }
  async getConnectAuthUrl(name: string, query: Record<string, string>) {
    await promise
    if (this.connectClients.has(name)) {
      const client = this.connectClients.get(name)
      const { authorizationParams, cookies } = await addField(query)
      const url = client.authorizationUrl({ ...this.authorization(name), ...authorizationParams })

      return { url, cookies }
    }
    return { url: null, cookies: [] }
  }
}

export const oauth = new OAuth()
oauth.addProviders(PROVIDERS)

export const connectOAuth = new OAuth()

connectOAuth.addProviders(PROVIDERS)

const STATE_MAX_AGE = 60 * 15 // 15 minutes in seconds
const NONCE_MAX_AGE = 60 * 15 // 15 minutes in seconds
const PKCE_MAX_AGE = 60 * 15 // 15 minutes in seconds
const PKCE_CODE_CHALLENGE_METHOD = 'S256'

/**
 * oauth通过类csrf的方式来认证请求有效性
 */
export const addField = async (query: Record<string, string>, fields = ['state', 'pkce'], jwt?: { secret: string }) => {
  let authorizationParams: Record<string, any> = {}
  const cookies = []

  if (fields.includes('state')) {
    const state = encrypt(JSON.stringify(query))

    const expires = getExpires(STATE_MAX_AGE * 1000)
    cookies.push({
      name: _cookies['state'].name,
      value: state,
      // TODO: 这里可能需要获取本次请求的cookie，然后增量写入
      options: { ..._cookies['state']['options'], expires },
    })
    authorizationParams.state = state
  }

  if (fields.includes('nonce')) {
    const nonce = generators.nonce()
    authorizationParams.nonce = { value: nonce }
  }

  if (fields.includes('pkce')) {
    const code_verifier = generators.codeVerifier()
    const code_challenge = generators.codeChallenge(code_verifier)
    authorizationParams.code_challenge = code_challenge
    authorizationParams.code_challenge_method = PKCE_CODE_CHALLENGE_METHOD

    const expires = getExpires(PKCE_MAX_AGE * 1000)
    cookies.push({
      name: _cookies['pkceCodeVerifier'].name,
      value: code_verifier,
      options: { ..._cookies['pkceCodeVerifier']['options'], expires },
    })
  }

  return { authorizationParams, cookies }
}

export const buildUrl = (url: string, params = {}) => {
  let query = ''
  Object.keys(params).forEach(key => {
    query += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`
  })

  return `${url}?${query.slice(0, query.length - 1)}`
}

/**
 * TODO: 对于idToken的需要走nounce
 * - 走jwt形式的话，cookie中存储的是jwt的编码结果，需要解构出来
 */
export const checkCredential = (
  cookies: Record<string, any>,
  query: Record<string, any>,
  allow: string[]
): OAuthCallbackChecks => {
  const state = allow.includes('state') ? cookies?.[_cookies['state'].name] || query['state'] : undefined
  const code_verifier = allow.includes('pkce') ? cookies?.[_cookies['pkceCodeVerifier'].name] : undefined
  return {
    state,
    code_verifier,
  } as OAuthCallbackChecks
}

/**
 * 创建向token endpoint发起请求的params参数
 */
export const createParams = (props: {
  provider: string
  query: Record<string, string>
  body: Record<string, any>
  method: string
  client: BaseClient
}) => {
  const { provider, query, body, method, client } = props

  oauth.authorization(provider)?.['scope']
  return {
    ...client.callbackParams({
      url: `http://n?${new URLSearchParams(query)}`,
      // @ts-expect-error
      body,
      method,
    }),
  }
}
