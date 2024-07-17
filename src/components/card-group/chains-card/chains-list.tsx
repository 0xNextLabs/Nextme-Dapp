import React, { FC } from 'react'
import { Paper, Popper, ClickAwayListener, Grow } from '@mui/material'
import ChainsMenu from '@/components/card-group/chains-card/chains-menu'

interface ChainsListProps {
  disables?: string[]
  expand: boolean
  onClose: (e: Event | React.SyntheticEvent) => void
  anchorEl: React.MutableRefObject<HTMLButtonElement>
  setExpand: React.Dispatch<React.SetStateAction<boolean>>
}

const ChainsList: FC<ChainsListProps> = ({ onClose, disables, expand, anchorEl, setExpand }) => {
  return (
    <Popper
      open={expand}
      anchorEl={anchorEl.current}
      role={undefined}
      placement="bottom"
      transition
      disablePortal
      sx={{ zIndex: 100 }}
    >
      {({ TransitionProps, placement }) => {
        return (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'top' : 'bottom',
            }}
          >
            <Paper className="z-100 rounded-box">
              <ClickAwayListener onClickAway={onClose}>
                <div>
                  <ChainsMenu expand={expand} setExpand={setExpand} disables={disables} />
                </div>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )
      }}
    </Popper>
  )
}

export default ChainsList
