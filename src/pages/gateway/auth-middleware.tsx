import { useEffect, useMemo, useState } from 'react'
import { Button, Box, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import NmSpin from '@/components/nm-spin'
import GatewayLayout from '@/components/layout/gateway'
import Copyright from '@/components/copyright'
import { checkOrCreateDIDSvc } from '@/services/did'
import { useInviteKey, useLocation } from '@/lib/hooks'
import { oauthPopWindow } from '@/lib/class/oauthPopWindow'
import { codes } from '@/lib/types/codes'

import config from '@/config'

const { title } = config

let isFirst = false
const getErrorTip = (code: string) =>
  codes[code] ||
  `An error occurred during the login process.\nPlease contact community staff with the error code. ${code}`

export default function AuthMiddleWare() {
  const router = useRouter()
  const href = useLocation('href')
  const { query } = queryString.parseUrl(href)
  const [isSignIn, setIsSignIn] = useState(Boolean(query?.isSignIn))
  const { removeInviteKey } = useInviteKey()
  useEffect(() => {
    const channelMessage = oauthPopWindow.getChannelMessage()
    if (channelMessage?.redirect == true) {
      oauthPopWindow.removeChannelMessage()
      if (channelMessage.url) {
        location.href = channelMessage?.url
      }
    } else {
      oauthPopWindow.removeChannelMessage()
      const channel = new BroadcastChannel('channelName')
      channel.postMessage({
        redirect: true,
        url: location.href,
      })
      window.close()
    }
  }, [])

  useEffect(() => {
    if (query) {
      setIsSignIn(Boolean(query?.isSignIn))
      if (query.actionType == '2001') {
        const queryDID = async () => {
          if (!isFirst) {
            isFirst = true
            const res = await checkOrCreateDIDSvc(query.from ? { from: query.from } : {})
            if (res) {
              if (res?.did || res?.redirect) {
                removeInviteKey()
                router.push('/studio' + (query.from ? `?from=${query.from}` : ''))
              }
            }
          }
        }
        queryDID()
      }
    }
  }, [query, router])

  const info = useMemo(() => {
    if (query.actionType == '2001') {
      return (
        <Box className="flex flex-col justify-center items-center w-80 xl:w-88">
          <NmSpin customClass="mt-10 mb-6" />
          <h4 className="text-lg">Nextme Studio Launching . . .</h4>
        </Box>
      )
    }
    if (query.errorType) {
      return (
        <Box>
          <Typography variant="h4" component="h4">
            Access Denied
          </Typography>
          <p className="py-6 max-w-xs">{getErrorTip(query?.errorType as string)}</p>
          <Link href={isSignIn ? '/gateway' : '/gateway/signup'} passHref>
            <Button variant="contained" size="large" color="error" className="w-72 lg:w-80 h-12 rounded-3xl shadow-sm">
              Sign {isSignIn ? 'in Other' : 'up New'} Account
            </Button>
          </Link>
        </Box>
      )
    }
  }, [JSON.stringify(query)])

  return (
    <GatewayLayout>
      <Box className="flex flex-1 flex-col items-center px-8 lg:px-0 pt-12 max-md:pt-32">
        <h1 className="font-righteous mb-12 mt-24 text-3xl lg:text-4xl max-xs:text-3xl">Gateway to Web3</h1>
        <ul className="flex flex-col items-center w-full">
          <li className="my-6 mb-20 p-4 md:p-8 rounded-md text-center border border-dashed">{info}</li>
        </ul>
      </Box>
      <Box className="my-16 text-center text-xs text-gray-900 sm:text-gray-400">
        <p>{`By signing in you accept to ${title}'s`}</p>
        <p>
          <Link
            href="/user/terms"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="px-1 text-gray-500 underline decoration-dotted hover:text-gray-600"
          >
            Terms of Service
          </Link>
          and
          <Link
            href="/user/privacy"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="px-1 text-gray-500 underline decoration-dotted hover:text-gray-600"
          >
            Privacy Policy
          </Link>
        </p>
      </Box>
      <Copyright customClass="justify-center pb-6" />
    </GatewayLayout>
  )
}
