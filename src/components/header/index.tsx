import { useState, useMemo, FC } from 'react'
import { useRouter } from 'next/router'
import { Avatar, Button, Link } from '@mui/material'
import classNames from 'classnames'
import NmIcon from '@/components/nm-icon'

import config from '@/config'

const { title, logo } = config

type HeaderProps = {
  title?: string
  customClass?: string
  logoImgClass?: string
  logoTextClass?: string
  buttonClass?: string
  action?: boolean
  actionURL?: string
  actionVariant?: 'outlined' | 'text' | 'contained'
}

const Header: FC<HeaderProps> = ({ customClass, buttonClass, action = true, actionVariant = 'outlined', ...props }) => {
  const router = useRouter()
  const [spin, setSpin] = useState(false)

  const gatewayURL = useMemo(() => {
    return router.query?.from ? `/gateway?from=${router.query.from}` : '/gateway'
  }, [router])

  return (
    <ul className={classNames('flex items-center justify-between pt-2', customClass)}>
      <li className="flex items-center">
        <Link href={router?.pathname === '/' ? `#${title}` : '/'} underline="none">
          <Avatar
            alt={`${title} Logo`}
            variant="rounded"
            src={logo.light}
            className={classNames('size-16 md:size-18 cursor-pointer', props?.logoImgClass)}
          />
        </Link>
        <span className={classNames('font-satisfy text-3xl mt-4', props?.logoTextClass || 'text-white')}>
          {props?.title || title}
        </span>
      </li>
      {action && (
        <li>
          <Link href={props?.actionURL || gatewayURL} underline="none">
            <Button
              size="large"
              variant={actionVariant}
              className={classNames(`px-${spin ? 4 : 6} h-10 rounded-3xl`, buttonClass)}
              onClick={() => setSpin(true)}
            >
              {spin && <NmIcon type="icon-spin" className="animate-spin mr-2" />}
              Get Started
            </Button>
          </Link>
        </li>
      )}
    </ul>
  )
}

export default Header
