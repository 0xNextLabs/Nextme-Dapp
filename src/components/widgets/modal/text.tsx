import React, { useState, useEffect, FC, ReactNode } from 'react'
import { BaseModalProps, PropsModal } from './type'
import { Button } from '@mui/material'

export interface TextModalProps extends BaseModalProps {
  type: 'text'
  width?: string
  height?: string
  text?: string | ReactNode
}

export const Text: FC<PropsModal<TextModalProps>> = ({ onClose, text = '' }) => {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const handleKeyDown = async event => {
      if (event.key === 'Escape') {
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
      <header className="select-none text-sm font-bold p-2">{text}</header>
      <footer className="flex items-center justify-end pt-1 gap-x-6">
        <Button
          variant="contained"
          color="error"
          className="px-6 shadow-sm capitalize"
          disabled={loading}
          onClick={async () => {
            onClose?.()
          }}
        >
          Ok
        </Button>
      </footer>
    </article>
  )
}
