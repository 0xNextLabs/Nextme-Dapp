import React from 'react'
import Image from 'next/image'
import { QRCodeCanvas } from 'qrcode.react'
import classNames from 'classnames'
import { useLocation, useUserData } from '@/lib/hooks'

import config from '@/config'

const { domains } = config

export default function QrCode({
  customClass = null,
  imageSettings = null,
  size = 108,
  bgColor = '#000',
  fgColor = '#085679',
  username = '',
  propsId = 'QrCode',
}) {
  const origin = useLocation('origin')
  let url = process.env.NODE_ENV === 'development' ? domains.dev : origin
  const userInfo = useUserData()

  return (
    <div className={classNames('relative h-fit w-fit m-auto hidden', customClass)}>
      <QRCodeCanvas
        id={propsId}
        className={classNames('hidden', customClass)}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        value={`${url}/${username || userInfo?.username}`}
      />
      {imageSettings?.src && (
        <div
          className="p-1 rounded-lg bg-white absolute"
          style={{
            top: (size - imageSettings?.height) / 2,
            left: (size - imageSettings?.width) / 2,
            width: imageSettings?.width,
            height: imageSettings?.height,
          }}
        >
          <Image
            src={imageSettings?.src}
            width={imageSettings?.width}
            height={imageSettings?.height}
            className="size-full rounded-lg"
            alt=""
          />
        </div>
      )}
    </div>
  )
}
