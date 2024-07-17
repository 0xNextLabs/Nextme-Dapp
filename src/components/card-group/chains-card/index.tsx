import React, { FC } from 'react'
import ChainsList from '@/components/card-group/chains-card/chains-list'
export interface ChainsCardProps {
  disables?: string[]
  expand: boolean
  onClose: (e: Event | React.SyntheticEvent) => void
  anchorEl: React.MutableRefObject<HTMLButtonElement>
  setExpand: React.Dispatch<React.SetStateAction<boolean>>
}

const ChainsCard: FC<ChainsCardProps> = ({ anchorEl, disables, expand, onClose, setExpand }) => {
  return <ChainsList expand={expand} anchorEl={anchorEl} onClose={onClose} setExpand={setExpand} disables={disables} />
}

export default ChainsCard
