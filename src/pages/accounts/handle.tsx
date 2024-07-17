import { useState } from 'react'
import { Box, Button, Chip, Grid, Typography } from '@mui/material'
import { useDebounceFn } from 'ahooks'
import AccountsLayout from '@/components/layout/accounts'
import NmTooltip from '@/components/nm-tooltip'
import NmIcon from '@/components/nm-icon'
import { useUserData } from '@/lib/hooks'

import config from '@/config'

const { host } = config

export default function Handle() {
  const user = useUserData()
  const [nameSubmit, setNameSubmit] = useState(false)

  const handleUsernameChange = e => {}

  const { run: handleInputChange } = useDebounceFn(
    e => {
      let input = e.target.value
      setNameSubmit(!input ? false : input !== user?.username)
    },
    { wait: 200 }
  )

  return (
    <AccountsLayout>
      <header>
        <Typography variant="h5" className="font-semibold py-2">
          Username Handle Customization
        </Typography>
        <p className="mt-1 text-neutral-400">
          Nextme member subscriptions and early Goerli test network Social Pay holder users have access to custom
          username handle.
        </p>
      </header>
      <section className="pt-12">
        <Box className="p-6 border rounded-xl">
          <Grid container justifyContent="space-between" alignItems="center">
            <h1 className="card-title">Change Username</h1>
            <Chip
              label={
                <Box className="flex gap-2 items-center text-white">
                  <NmIcon type="icon-member" />
                  <strong className="pt-0.5">PRO</strong>
                </Box>
              }
              className="bg-create-gradient-001 h-7"
            />
          </Grid>
          <Box className="relative flex items-center pt-6">
            <span className="absolute left-3">{`${host}/`}</span>
            <input
              type="text"
              className="py-3 pl-28 pr-24 truncate tracking-wide w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-transparent focus:ring-0"
              placeholder="username"
              defaultValue={user?.username}
              onChange={handleInputChange}
            />
            {nameSubmit && (
              <Button
                size="small"
                className="text-white px-4 rounded-md bg-create-gradient-001 absolute right-2 tooltip tooltip-bottom"
                data-tip="Upcoming"
              >
                Submit
              </Button>
            )}
          </Box>
          <p className="text-neutral-400 pt-4">Choose a new username handle for your Nextme.</p>
        </Box>
      </section>
    </AccountsLayout>
  )
}
