import { useState } from 'react'
import { Avatar, Box } from '@mui/material'
import classNames from 'classnames'
import NmIcon from '@/components/nm-icon'
import NFTCard from '.'
import QrCode from './qr-code'
import { useAvatar } from '@/lib/hooks'
import { useCanvasImg, useDownloadQrCode } from '@/lib/hooks/canvas'

import config from '@/config'

const { logo } = config

export default function PayCard({ ...props }) {
  const { avatar } = useAvatar()
  const drawCanvas = useCanvasImg()
  const drawQrCode = useDownloadQrCode()
  const [sbtLoading, setSbtLoading] = useState(false)
  const [qrLoading, setQrLoading] = useState(false)

  const handleDownloadCard = async () => {
    if (sbtLoading) return
    setSbtLoading(true)
    try {
      await drawCanvas()
    } catch (error) {
      setSbtLoading(false)
    }
    setSbtLoading(false)
  }
  const handleDownloadQrcode = async () => {
    if (qrLoading) return
    setQrLoading(true)
    try {
      await drawQrCode('user-only-qrcode')
      setQrLoading(false)
    } catch (error) {
      setQrLoading(false)
    }
  }

  return (
    <article className="p-4">
      <ul className="flex flex-col lg:flex-row">
        <li>
          <Box className="chat chat-start">
            <div className="chat-image avatar">
              <Avatar src={logo.dark} />
            </div>
            <p
              className={classNames(
                'chat-bubble flex',
                sbtLoading ? 'cursor-not-allowed bg-opacity-70' : 'cursor-pointer'
              )}
              onClick={handleDownloadCard}
            >
              Download
              {sbtLoading && <NmIcon type="icon-spin" className="animate-spin ml-2 my-auto flex" />}
            </p>
          </Box>
          <Box className="scale-50 -mt-28 -mb-32">
            <NFTCard avatar={avatar} cardId="download-card" />
          </Box>
        </li>
        <li className="text-center flex-1 pt-16 xl:pt-24">
          <QrCode
            customClass="!block"
            bgColor="#fff"
            fgColor="#000"
            size={200}
            propsId="user-only-qrcode"
            imageSettings={{
              src: avatar,
              x: undefined,
              y: undefined,
              height: 48,
              width: 48,
              excavate: true,
            }}
          />
          <Box className="chat chat-end mr-4 sm:mr-16 mt-8" onClick={handleDownloadQrcode}>
            <div className="chat-image avatar">
              <Avatar src={logo.dark} />
            </div>
            <p
              className={classNames('chat-bubble flex', {
                'cursor-pointer': !qrLoading,
                'cursor-not-allowed bg-opacity-70': qrLoading,
              })}
            >
              Download
              {qrLoading && <NmIcon type="icon-spin" className="animate-spin ml-2 my-auto flex" />}
            </p>
          </Box>
        </li>
      </ul>
    </article>
  )
}
