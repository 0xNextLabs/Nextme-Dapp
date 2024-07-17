import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Avatar, Button } from '@mui/material'
import NmIcon from '@/components/nm-icon'
import { useSnackbar } from '@/components/context/snackbar'
import { callModal } from '@/components/widgets/modal'
import { useUserData } from '@/lib/hooks'
import socialCommon from '@/config/common/social'

import config from '@/config'

const { domains } = config

export default function CodeModal({ ...props }) {
  const { showSnackbar } = useSnackbar()
  const router = useRouter()
  const user = useUserData()
  const code = router.query?.action_type as unknown as string

  useEffect(() => {
    if (code && user?.did) {
      const text = () => {
        switch (code) {
          case '1001':
            return (
              <article className="text-center">
                <header>
                  <NmIcon type="icon-tips" className="text-theme-error text-6xl mb-3" />
                </header>
                <h1>Failed to verify Twitter Profile</h1>
                <p className="pt-2 text-neutral-400 font-light text-base">
                  Please make sure to put Nextme's portal link in your Twitter introduction or profile link.
                </p>
                <footer className="flex items-center justify-center pt-4">
                  <Link href="//twitter.com" target="_blank">
                    <Avatar src={`${domains.cdn}/static/social/x.svg`} className="rounded-md size-12" />
                  </Link>
                </footer>
              </article>
            )
            break
          case '2001':
            return 'Success to verify Twitter'
            break
          case '1002':
            return (
              <article className="text-center">
                <header>
                  <NmIcon type="icon-tips" className="text-theme-error text-6xl mb-3" />
                </header>
                <h1>Failed to verify Discord member</h1>
                <p className="pt-2 text-neutral-400 font-light text-base">
                  Please make sure you are in the Nextme official discord community group.
                </p>
                <footer
                  className="flex items-center justify-center pt-4"
                  style={{
                    color: socialCommon.types.discord.color,
                  }}
                >
                  <NmIcon type="icon-discord" className="text-2xl leading-0" />
                  <Button
                    href="//discord.gg/mxTew3aerd"
                    target="_blank"
                    className="ml-1"
                    style={{
                      color: 'inherit',
                    }}
                  >
                    discord.gg/mxTew3aerd
                  </Button>
                </footer>
              </article>
            )
            break
          case '2002':
            return 'Success to join Discord'
            break
          case '1003':
            return (
              <article className="text-center">
                <header>
                  <NmIcon type="icon-tips" className="text-theme-error text-6xl mb-3" />
                </header>
                <h1>Failed to verify</h1>
              </article>
            )
            break
          default:
            break
        }
      }
      if (code == '2001' || code == '2002') {
        showSnackbar({
          snackbar: {
            open: true,
            type: 'success',
            text: text(),
          },
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        })
      } else {
        // 这里需要判定路由是否来自 /accounts 因为该页面需要callback后才会同步数据 所以不能在挂载的时候就直接进行判断，如果数据有问题会在后续跳转到其他页面时继续提醒
        callModal({
          type: 'confirm',
          text: text(),
          async onOk() {
            return true
          },
          onClose() {
            router.replace(router.pathname == '/[username]' ? user.username : router.pathname)
          },
          isOK: false,
          cancelText: 'Close',
        })
      }
    }
  }, [router, user?.did])

  return <></>
}
