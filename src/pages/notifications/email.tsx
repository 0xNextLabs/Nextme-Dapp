import { useState } from 'react'
import Image from 'next/image'
import AccountsLayout from '@/components/layout/accounts'
import { getBlurDataURL } from '@/lib/utils'

import config from '@/config'

const { domains } = config

export default function Email() {
  return (
    <AccountsLayout>
      <section className="flex justify-center items-center p-24">
        <Image
          placeholder="blur"
          width="320"
          height="320"
          alt=""
          src={`${domains.cdn}/status/icon_emoji_animation.webp`}
          blurDataURL={getBlurDataURL(640, 640)}
        />
      </section>
    </AccountsLayout>
  )
}
