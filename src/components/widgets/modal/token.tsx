import { useState } from 'react'
import { BaseModalProps, PropsModal } from './type'

export interface TokenModalProps extends BaseModalProps {
  type: 'token'
  onCancel?: () => Promise<boolean | undefined>
  onOk?: () => Promise<boolean | undefined>
  width?: string
  height?: string
  text?: string
}

import React, { useEffect, FC } from 'react'
import { Button } from '@mui/material'
import NmSpin from '@/components/nm-spin'

export const Token: FC<PropsModal<TokenModalProps>> = ({
  onClose,
  onCancel,
  onOk,
  text = 'Are you sure not to save data？',
}) => {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const handleKeyDown = async event => {
      if (event.key === 'Enter') {
        if (await onOk?.()) {
          onClose?.()
        }
      }
      if (event.key === 'Escape') {
        await onCancel?.()
        onClose?.()
      }
      event.preventDefault()
      event.stopPropagation()
    }

    document.body.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <article>
      <header className="select-none text-xl font-bold p-2">{text}</header>
      <footer className="flex items-center justify-end pt-6 gap-x-6">
        <Button
          variant="outlined"
          className="px-8 font-medium shadow-sm capitalize"
          disabled={loading}
          onClick={async () => {
            await onCancel?.()
            onClose?.()
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          className="px-6 shadow-sm capitalize"
          disabled={loading}
          onClick={async () => {
            setLoading(true)
            if (await onOk?.()) {
              onClose?.()
            }
            setLoading(false)
          }}
        >
          {loading ? <NmSpin customClass="size-8" /> : 'Confirm'}
        </Button>
      </footer>
    </article>
  )
}
