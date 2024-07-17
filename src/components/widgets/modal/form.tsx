import { BaseModalProps, PropsModal } from './type'
import { useState, ComponentType } from 'react'

export interface FormModalProps extends BaseModalProps {
  type: 'form'
  onCancel?: () => Promise<boolean | undefined>
  onOk?: () => Promise<boolean | undefined>
  node?: ComponentType
}

import React, { useEffect, FC } from 'react'
import { Button } from '@mui/material'
import NmSpin from '@/components/nm-spin'

export const Form: FC<PropsModal<FormModalProps>> = ({ onClose, onCancel, onOk, node: Node }) => {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const handleKeyDown = async event => {
      if (event.key === 'Enter') {
        if (await onOk?.()) {
          onClose?.()
        }
        event.preventDefault()
        event.stopPropagation()
      }
      if (event.key === 'Escape') {
        await onCancel?.()
        onClose?.()
        event.preventDefault()
        event.stopPropagation()
      }
    }

    document.body.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <article>
      <header className="select-none text-xl font-bold p-2">
        <Node />
      </header>
      <footer className="flex items-center justify-center gap-6 p-2">
        <Button
          variant="outlined"
          color="inherit"
          className="flex-1 font-medium shadow-sm capitalize"
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
          className="flex-1 shadow-sm capitalize"
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
