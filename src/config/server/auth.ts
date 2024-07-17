import { tea } from '@/lib/tea'

type URLWrapper = {
  url: string
  query?: Record<string, string>
}
type AuthProvider = {
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

// session 有效期 30 天

export enum UserFound {
  NOT_FOUND = 0,
  FOUND,
  /**
   * username并未绑定该提供商的认证
   */
  FOUND_INACTIVE,
  /**
   * 提供商认证信息不符
   */
  FOUND_BUT_NOT_SAME,
}

/**
 * TODO: popup式登录
const AUTH_WIDTH = 400
const AUTH_HEIGHT = 600

const WINDOW_FEATURE = {
  toolbar: 0,
  scrollbars: 1,
  status: 1,
  resizable: 1,
  location: 1,
  menuBar: 0,
  width: AUTH_WIDTH,
  height: AUTH_HEIGHT,
  left: 300,
  top: 100,
}

export const getWinFeature = () => {
  let feat = ''
  Object.keys(WINDOW_FEATURE).forEach(key => {
    feat += `${key}=${WINDOW_FEATURE[key]},`
  })
  feat = feat.slice(0, feat.length - 1)
  return feat
}
 */

export const buildCallbackUrl = (host: string, pathname: string) => {
  if (host.endsWith('/')) {
    host = host.slice(0, host.length - 1)
  }
  return `${host}/${pathname}`
}

export const AUTH_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXTAUTH_URL
    : process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)

export const PROVIDERS: AuthProvider[] = [
  {
    name: 'twitter',
    config: {
      authorization: {
        url: 'https://twitter.com/i/oauth2/authorize',
        query: {
          scope: 'users.read tweet.read offline.access',
        },
      },
      jwt: {
        secret: process.env.TWITTER_SECRET,
      },
      token: { url: 'https://api.twitter.com/2/oauth2/token' },
      userInfo: {
        url: 'https://api.twitter.com/2/users/me',
        query: { 'user.fields': 'profile_image_url,description,location,entities,url,protected' },
      },
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
      callbackUrl: buildCallbackUrl(AUTH_URL, 'api/auth/callback/twitter'),
      profile(props) {
        const { data } = props
        return {
          id: data?.id,
          name: data?.name,
          entities: data.entities || {},
          // NOTE: E-mail is currently unsupported by OAuth 2 Twitter.
          email: data?.email,
          image: data?.profile_image_url,
        }
      },
    },
  },
  {
    name: 'google',
    config: {
      authorization: {
        url: 'https://accounts.google.com/o/oauth2/v2/auth',
        query: {
          scope: 'openid email profile',
        },
      },
      jwt: { secret: process.env.GOOGLE_SECRET },
      token: { url: 'https://oauth2.googleapis.com/token' },
      userInfo: {
        url: 'https://openidconnect.googleapis.com/v1/userinfo',
      },
      idToken: true,
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackUrl: buildCallbackUrl(AUTH_URL, 'api/auth/callback/google'),
      client: {
        token_endpoint_auth_method: 'client_secret_post',
      },
      wellKnown: 'https://accounts.google.com/.well-known/openid-configuration',
      checks: ['pkce', 'state'],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    },
  },
  {
    name: 'discord',
    config: {
      authorization: {
        url: 'https://discord.com/api/oauth2/authorize',
        query: {
          // https://discord.com/developers/docs/topics/oauth2有所有范围
          scope: 'email identify guilds',
        },
      },
      jwt: {
        secret: process.env.DISCORD_SECRET,
      },
      token: { url: 'https://discord.com/api/oauth2/token' },
      userInfo: { url: 'https://discord.com/api/users/@me' },
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      callbackUrl: buildCallbackUrl(AUTH_URL, 'api/auth/callback/discord'),
      profile(profile: any) {
        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile.discriminator) % 5
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
        } else {
          const format = profile.avatar?.startsWith('a_') ? 'gif' : 'png'
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
        }
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.image_url,
        }
      },
    },
  },
  {
    name: 'facebook',
    config: {
      authorization: {
        url: 'https://www.facebook.com/v11.0/dialog/oauth',
        query: {
          scope: 'email',
        },
      },
      token: { url: 'https://graph.facebook.com/oauth/access_token' },
      userInfo: {
        url: 'https://graph.facebook.com/me',
        query: {
          fields: 'id,name,email,picture',
        },
        async request({ tokens, client, params }) {
          return await client.userinfo(tokens.access_token!, {
            params,
          })
        },
      },
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackUrl: buildCallbackUrl(AUTH_URL, 'api/auth/callback/facebook'),
      profile(profile: any) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture.data.url,
        }
      },
    },
  },
  {
    name: 'linkedin',
    config: {
      authorization: {
        url: 'https://www.linkedin.com/oauth/v2/authorization',
        query: {
          scope: 'r_liteprofile r_emailaddress',
        },
      },
      jwt: {
        secret: process.env.LINKEDIN_SECRET,
      },
      token: { url: 'https://www.linkedin.com/oauth/v2/accessToken' },
      userInfo: {
        url: 'https://api.linkedin.com/v2/me',
        query: {
          projection: `(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))`,
        },
      },
      client: {
        token_endpoint_auth_method: 'client_secret_post',
      },
      clientId: process.env.LINKEDIN_ID,
      clientSecret: process.env.LINKEDIN_SECRET,
      callbackUrl: buildCallbackUrl(AUTH_URL, 'api/auth/callback/linkedin'),
      async profile(profile: any, tokens: any) {
        const emailResponse = await fetch(
          'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
          { headers: { Authorization: `Bearer ${tokens.access_token}` } }
        )
        const emailData = await emailResponse.json()
        console.log('linkedin-emailData: ', emailData)
        return {
          id: profile.id,
          name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
          email: emailData?.elements?.[0]?.['handle~']?.emailAddress,
          image: profile.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier,
        }
      },
      checks: ['state'],
    },
  },
  {
    name: 'instagram',
    config: {} as any,
  },
  {
    name: 'tiktok',
    config: {} as any,
  },
  //   {
  //     name: 'instagram',
  //     config: {
  //       authorization: {
  //         url: 'https://api.instagram.com/oauth/authorize',
  //         query: {
  //           scope: 'user_profile,user_media',
  //         },
  //       },
  //       jwt: {
  //         secret: process.env.INSTAGRAM_SECRET,
  //       },
  //       token: { url: 'https://api.instagram.com/oauth/access_token' },
  //       userInfo: {
  //         url: 'https://graph.instagram.com/me',
  //         query: { fields: 'id,username,account_type,name' },
  //       },
  //       client: {
  //         token_endpoint_auth_method: 'client_secret_post',
  //       },
  //       clientId: process.env.INSTAGRAM_ID,
  //       clientSecret: process.env.INSTAGRAM_SECRET,
  //       callbackUrl: buildCallbackUrl(url, 'api/auth/callback/instagram'),
  //       async profile(profile: any) {
  //         return {
  //           id: profile.id,
  //           name: profile.username,
  //           email: null,
  //           image: null,
  //         }
  //       },
  //     },
  //   },
  {
    name: 'email',
    config: {},
  },
]

export const providers_front: () => { name: string; id: string }[] = () =>
  PROVIDERS.map((p, index) => {
    if (index > 3) {
      return {
        name: p.name,
        id: p.name,
      }
    } else {
      return {
        name: p.name.replace(p.name[0], p.name[0].toUpperCase()), // 首字母大写
        id: p.name,
      }
    }
  })
