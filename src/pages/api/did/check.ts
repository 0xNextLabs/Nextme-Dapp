import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { fetcher } from '@/lib/fetcher'
import { getOneUserByUuid } from '@/lib/api/user'
import { getAPIsOrigin } from '@/lib/utils'
import { addPoint } from '@/lib/api/point'
import { err, getExpires, ok, setCookie } from '@/lib/server-utils'
import authMiddleware from '@/middleware/authMiddleware'
import { getPayloadByToken, signToken } from '@/lib/server-utils/jwt'
import { SESSION_DELAY, tokenName } from '@/config/server/auth-config'

async function check(req: NextApiRequest, res: NextApiResponse) {
  const token = await getPayloadByToken(req)
  if (token && token.id) {
    const user = await getOneUserByUuid(token.id)
    if (user?.did) {
      setCookie(res, {
        name: tokenName,
        value: signToken({ id: user.uuid, did: user.did }),
        options: {
          sameSite: 'lax',
          path: '/',
          expires: getExpires(SESSION_DELAY),
        },
      })
      return ok(res, {
        redirect: true,
      })
    } else {
      let addressOrOAuthId: string | undefined
      if (user?.oauth_signup_type === 'wallet') {
        addressOrOAuthId = user?.chain?.default?.address || user?.chain?.sol?.address
      } else {
        addressOrOAuthId = user?.oauth?.[user?.oauth_signup_type]?.id
      }
      if (!addressOrOAuthId) return err(res, { path: '/gateway/auth-middleware?errorType=1022' })

      let did_host = getAPIsOrigin('did', req.headers.origin)
      console.log('🦁', did_host, addressOrOAuthId)
      try {
        const didResp = await fetcher({
          url: `api/create/${addressOrOAuthId}`,
          baseURL: did_host,
          headers: {
            Cookie: `${process.env.DID_CONSTRAINT}=1`,
          },
        })

        const { doc } = didResp

        if (doc && doc.didDocument && doc.didDocument.id) {
          const did = doc.didDocument.id
          try {
            await prisma.users.updateMany({
              where: {
                uuid: user.uuid,
              },
              data: {
                did,
              },
            })
            const data = req.body
            if (data?.from && data.from !== 'undefined') {
              let response = await prisma.users.findFirst({
                where: {
                  inviteCode: data.from as string,
                },
                select: {
                  uuid: true,
                  username: true,
                },
              })

              if (response && response.uuid) {
                await addPoint([
                  {
                    type: 2,
                    uuid: response.uuid,
                    opt: user.uuid,
                    extra: {
                      username: user.username, // 实际上，释放邀请码的人会拿uuid来查询这里的uuid字段，然后把用他邀请码注册username拿走
                    },
                  },
                  {
                    type: 1,
                    uuid: user.uuid,
                    opt: user.uuid,
                    extra: {
                      username: response.username,
                    },
                  },
                ])
              }
            }
            setCookie(res, {
              name: tokenName,
              value: signToken({ id: user.uuid, did }),
              options: {
                sameSite: 'lax',
                path: '/',
                expires: getExpires(SESSION_DELAY),
              },
            })
            return ok(res, {
              did,
            })
          } catch (e) {
            console.log('catch-internal: ', e)
            return err(res, { message: 'did got but parse error' })
          }
        } else {
          return err(res, { message: 'did-server error' })
        }
      } catch (e) {
        console.log('catch-external: ', e)
        return err(res, { message: 'did-server error' })
      }
    }
  }
  return err(res, { path: '/gateway/auth-middleware?errorType=1023' })
}

export default authMiddleware(check)
