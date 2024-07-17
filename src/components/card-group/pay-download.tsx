import { useState } from 'react'
import { Button } from '@mui/material'
import { useUserData } from '@/lib/hooks'
import { useCanvasImg } from '@/lib/hooks/canvas'
import { useSnackbar } from '@/components/context/snackbar'
import NmIcon from '@/components/nm-icon'
import QrCode from './qr-code'
import { useAsyncEffect } from 'ahooks'

interface IProps {
  className?: string
  immediate?: boolean // 唤起组件立即下载模式
  variant?: 'text' | 'outlined' | 'contained'
}

const PayDownLoad = ({ className, immediate = false, variant = 'text' }: IProps) => {
  const [loading, setLoading] = useState(false)
  const { showSnackbar } = useSnackbar()
  const user = useUserData()
  const cardUserName = user?.username
  const drawCanvas = useCanvasImg()

  const onDownload = async () => {
    setLoading(true)
    try {
      await drawCanvas()
    } catch (error) {
      showSnackbar({
        snackbar: {
          open: true,
          type: 'warning',
          text: 'Please try again',
        },
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      })
    }
    setLoading(false)
  }

  useAsyncEffect(async () => {
    if (immediate) await onDownload()
  }, [])

  return (
    <Button size="large" variant={variant} className={className} onClick={onDownload}>
      {loading && <NmIcon type="icon-spin" className="animate-spin mr-2" />}
      Download
      <QrCode username={cardUserName} />
    </Button>
  )
}
export default PayDownLoad
