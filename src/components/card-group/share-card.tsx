import { useState } from 'react'
import { Button, Backdrop, Box } from '@mui/material'
import NmIcon from '@/components/nm-icon'
import NFTCard from '.'
import PayDownLoad from './pay-download'
import ShareAppList from './app-list'
import PayLinks from './pay-links'
import { getAnimateClass } from '@/lib/utils'
import { useMobile, useLocation, useAvatar, userMintStatus } from '@/lib/hooks'
import { useUserIsMint } from '@/lib/hooks/identity'

interface IProps {
  username: string
  shareCardShow: number
  setShareCardShow: Function
  setBottomCardShow: Function
  setToast: Function
}

export default function ShareCard({ shareCardShow, setShareCardShow, setBottomCardShow, setToast, username }: IProps) {
  const [copyIcon, setCopyIcon] = useState('icon-copy_outline')
  const origin = useLocation('origin')
  const host = useLocation()
  const { avatar } = useAvatar()
  const isMobile = useMobile()
  const isMint = useUserIsMint()

  const animateClass = getAnimateClass(shareCardShow, isMobile, true)

  const onMint = () => {
    setBottomCardShow(1)
    onShareCardClose()
  }
  // 0隐藏，1淡入，2淡出
  const onShareCardClose = () => {
    setShareCardShow(2)
    setTimeout(() => {
      setShareCardShow(0)
    }, 300)
  }
  const handleCopyText = () => {
    setCopyIcon('icon-tick')
    navigator.clipboard.writeText(`${origin}/${username}`)
    setToast({
      open: true,
      text: 'Portal link copy success ᵔ◡ᵔ',
    })
    setTimeout(() => {
      setCopyIcon('icon-copy_outline')
    }, 2000)
  }

  return (
    <>
      <Backdrop className="z-1100 backdrop-blur-sm" open={shareCardShow > 0} onClick={onShareCardClose} />
      <article
        className={`animate__animated fixed bottom-0 md:absolute z-1100 md:top-16 md:bottom-auto right-0 md:right-6 md:rounded-2xl w-full md:w-80 p-6 bg-sidebar-deepblue text-center ${animateClass}`}
      >
        <Box className="flex sm:hidden justify-between border mb-8 rounded-3xl px-1.5 pl-4 py-1">
          <p className="flex-1 self-center text-left truncate text-sm text-teal-600">{`${host}/${username}`}</p>
          <Button
            size="small"
            className="h-9 ml-4 px-3 text-white text-sm rounded-3xl bg-gradient-to-r from-green-400 to-blue-500"
            endIcon={<NmIcon type={copyIcon} className="text-white text-sm mb-0.5" />}
            onClick={handleCopyText}
          >
            Copy Link
          </Button>
        </Box>
        <header className="flex justify-center scale-60 xl:scale-50 -mb-20 -mt-28 xl:-mt-36 xl:-mb-28">
          <NFTCard avatar={avatar} cardId="share-card" />
        </header>
        {/* {isMint == userMintStatus.MINTED && <PayLinks isHighlightBorder customClass="mb-4" />} */}
        <PayDownLoad
          variant="outlined"
          className="bg-gradient-to-r from-green-400 to-blue-500 border-none w-full h-10 text-white text-md font-poppins rounded-3xl mb-5"
        />
        {isMint == userMintStatus.NOT_MINT && (
          <section className="flex justify-between">
            <PayDownLoad
              variant="outlined"
              className="w-36 h-9 mr-6 rounded-3xl border-none text-white bg-card-deepblue"
            />
            <Button
              size="large"
              variant="outlined"
              onClick={onMint}
              className="w-36 h-9 text-white rounded-3xl border-none bg-gradient-to-r from-green-400 to-blue-500"
            >
              Claim Pay
            </Button>
          </section>
        )}
        <Box className="pt-8">
          <ShareAppList setToast={setToast} customClass="justify-between" />
        </Box>
      </article>
    </>
  )
}
