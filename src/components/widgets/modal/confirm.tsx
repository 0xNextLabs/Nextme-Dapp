import React, { useEffect, FC, ReactNode, useState } from 'react'
import { Button } from '@mui/material'
import classNames from 'classnames'
import NmSpin from '@/components/nm-spin'
import { BaseModalProps, PropsModal } from './type'

export interface ConfirmModalProps extends BaseModalProps {
  type: 'confirm'
  onCancel?: () => Promise<boolean | undefined>
  onOk?: () => Promise<boolean | undefined>
  width?: string
  height?: string
  text?: ReactNode
  cancelText?: string
  OkText?: string
  isOK?: boolean
  isCancel?: boolean
}

export const Confirm: FC<PropsModal<ConfirmModalProps>> = ({
  onClose,
  onCancel,
  onOk,
  cancelText,
  OkText,
  isOK = true,
  isCancel = true,
  text = <span>Are you sure not to save data?</span>,
  isMobile,
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
  }, [onCancel, onClose, onOk])

  return (
    <article
      className={classNames({
        'h-full flex flex-col justify-between': isMobile,
      })}
    >
      <header className="select-none text-xl font-bold p-2 flex-1 flex justify-center items-center">{text}</header>
      <footer className="flex items-center justify-center sm:justify-end max-sm:p-6 pt-6 gap-x-6">
        {isCancel && (
          <Button
            variant="outlined"
            color="inherit"
            className="shadow-sm max-sm:flex-1 max-sm:h-12"
            disabled={loading}
            onClick={async () => {
              await onCancel?.()
              onClose?.()
            }}
          >
            {cancelText || 'Cancel'}
          </Button>
        )}
        {isOK && (
          <Button
            variant="contained"
            color="error"
            className="shadow-sm max-sm:flex-1 max-sm:h-12"
            disabled={loading}
            onClick={async () => {
              setLoading(true)
              if (await onOk?.()) {
                onClose?.()
              }
              setLoading(false)
            }}
          >
            {loading ? <NmSpin customClass="size-8" /> : OkText || 'Confirm'}
          </Button>
        )}
      </footer>
    </article>
  )
}
