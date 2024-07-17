import React, { FC } from 'react'
import { Box } from '@mui/material'
import classNames from 'classnames'
import NmIcon from '@/components/nm-icon'
import { FormInput } from '@/components/profile/blocks/components/form-item'

const formNameInputPlaceholder = 'Search 10k+ community popular tags'

interface Props {
  handleInputChange: any
  handleInputEnter: any
  labelName: string
  className?: string
}
export const FormSearchInput: FC<Props> = ({ handleInputChange, handleInputEnter, labelName, className }) => {
  return (
    <Box className={classNames('relative', className)}>
      <FormInput
        errorTip={''}
        placeholder={formNameInputPlaceholder}
        value={labelName}
        className="h-11 text-sm xl:h-14 xl:text-xl leading-none"
        onChange={evt => handleInputChange(evt.target.value)}
        // @ts-ignore
        onKeyDown={handleInputEnter}
      />
      <NmIcon
        type="icon-search"
        className="absolute text-base right-3 top-1/2 xl:text-3.5xl xl:right-4 -translate-y-1/2"
      />
    </Box>
  )
}
