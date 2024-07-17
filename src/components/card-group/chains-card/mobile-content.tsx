import React, { FC, useEffect } from 'react'
import classNames from 'classnames'
import { Backdrop } from '@mui/material'
import { useStudioContext } from '@/components/context/studio'
import ChainsMenu from '@/components/card-group/chains-card/chains-menu'
import { useTailWindFade } from '@/components/widgets/modal'
import { useMobile } from '@/lib/hooks'

// interface MobileContentProps extends ChainsCardProps {}
interface MobileContentProps {}

const leaveAnimate = 'scale-y-0 pointer-events-none opacity-0'
const enterAnimate = 'scale-y-100'

const MobileContent: FC<MobileContentProps> = () => {
  const { expand, setExpand } = useStudioContext()
  const isMobile = useMobile()
  const { className, setOpen } = useTailWindFade({ open: true })

  useEffect(() => {
    setOpen(expand)
  }, [expand])

  return (
    isMobile &&
    expand && (
      <>
        <Backdrop
          open
          className="backdrop-blur-sm z-999 fixed"
          onClick={() => {
            setOpen(false)
            setTimeout(() => {
              setExpand(false)
            }, 300)
          }}
        />
        <div
          className={classNames('fixed bottom-0 left-0 w-full z-[1001]', isMobile && expand ? 'visible' : 'invisible')}
        >
          <div
            className={classNames(
              ...className('relative max-sm:origin-bottom origin-top ease-scale-cub', leaveAnimate, enterAnimate)
            )}
          >
            <ChainsMenu setExpand={setExpand} expand={expand} />
          </div>
        </div>
      </>
    )
  )
}

export default MobileContent
