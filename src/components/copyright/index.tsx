import { Box, Link } from '@mui/material'
import { getCurrentDate } from '@/lib/utils'
import classNames from 'classnames'
import config from '@/config'

const { organization } = config
let [year] = getCurrentDate()

const Copyright = props => {
  return (
    <footer
      className={classNames('flex items-center safe-area-inset-bottom text-sm text-neutral-700', props?.customClass)}
    >
      <label>Copyright 2022-{year}</label>
      <Link
        underline="none"
        href="/nextme.eth"
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="mx-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-fuchsia-500"
      >
        {organization.name}
      </Link>
      <label className="-ml-0.5">All rights reserved.</label>
    </footer>
  )
}

export default Copyright
