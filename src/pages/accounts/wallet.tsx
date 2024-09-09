import React, { useEffect, useState, useMemo, useRef } from 'react'
import { Avatar, Box, Button, Grid, Typography } from '@mui/material'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAccount, useSwitchChain } from 'wagmi'
import classNames from 'classnames'
import NmIcon from '@/components/nm-icon'
import NmWallet from '@/components/nm-wallet'
import AccountsLayout from '@/components/layout/accounts'
import { labels, ChainsWalletCard } from '@/components/nm-chains-wallet'
import { useEVMWalletConnect } from '@/lib/hooks'
import { supportChains } from '@/lib/chains'
import { getShortenMidDots } from '@/lib/utils'
import { getActiveChain } from '@/lib/web3'

export default function Wallet() {
  const evmWalletConnect = useEVMWalletConnect()
  const { chainId } = useAccount()
  const { switchChain } = useSwitchChain()
  const { openConnectModal } = useConnectModal()
  const { wallet: solanaWallet, connect } = useWallet()
  const { setVisible } = useWalletModal()
  const { buttonState, publicKey } = useWalletMultiButton({
    onSelectWallet() {
      setVisible(true)
    },
  })
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open)

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = open
  }, [open])

  const content = useMemo(() => {
    if (publicKey) {
      const base58 = publicKey.toBase58()
      return getShortenMidDots(base58, 6)
    } else if (buttonState === 'connecting' || buttonState === 'has-wallet') {
      return labels[buttonState]
    } else {
      return labels['no-wallet']
    }
  }, [buttonState, labels, publicKey])

  const handleWalletToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleWalletClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }
    setOpen(false)
  }

  const handleChainsAction = async (item, type) => {
    switch (type) {
      case 'EVM':
      case 'Rollup':
        if (!item?.chain?.id) return
        evmWalletConnect ? switchChain({ chainId: item?.chain?.id }) : openConnectModal()
        break
      case 'Non-EVM':
        if (item.name === 'Solana') {
          if (solanaWallet?.readyState === 'Installed') {
            connect()
          } else {
            setVisible(true)
          }
        }
        break
      default:
        break
    }
  }

  return (
    <AccountsLayout>
      <header>
        <Typography variant="h5" className="font-semibold py-2">
          Multichain Wallet Identity
        </Typography>
        <p className="mt-1 text-neutral-400">
          Support multiple chains for EVM and Non-EVM, and the same social identity enjoys freedom on every chain.
        </p>
      </header>
      <section className="pt-12 grid grid-cols-1 3xl:grid-cols-2 gap-8">
        {supportChains.map((row, index) => (
          <Box className="p-6 border rounded-xl" key={`card-item-${index + 1}`}>
            <Grid container justifyContent="space-between" alignItems="center">
              <h1 className="card-title">{row.type}</h1>
              {['EVM'].includes(row?.type) && (
                <NmWallet walletClass="px-8 bg-create-gradient-001 rounded-lg" wrongNetworkClass="px-8 rounded-3xl" />
              )}
            </Grid>
            <p className="text-neutral-400 py-6">{row.desc}</p>
            <Box className="mb-8 flex flex-wrap gap-4">
              {row.type == 'Non-EVM' && solanaWallet?.readyState === 'Installed' && publicKey && (
                <Box className="p-3 w-full  border rounded-xl flex items-center justify-between">
                  <Avatar src={getActiveChain({ name: 'Solana' })?.icon} className="skeleton rounded-full" />
                  <ul className="flex-1 px-4 pr-6">
                    <li className="font-semibold">Solana</li>
                    <li className="text-neutral-400 text-sm">{content}</li>
                  </ul>
                  <Button
                    ref={anchorRef}
                    aria-controls={open ? 'demo-customized-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    variant="contained"
                    size="small"
                    className="dropdown shadow-sm w-fit h-9 rounded-md text-white bg-create-gradient-001"
                    onClick={() => handleWalletToggle()}
                  >
                    Account
                  </Button>
                  <ChainsWalletCard
                    onClose={handleWalletClose}
                    anchorEl={anchorRef}
                    expand={open}
                    setExpand={setOpen}
                  />
                </Box>
              )}
            </Box>
            {row?.list && row?.list?.length > 0 && (
              <ul
                className={classNames('flex flex-wrap gap-6', {
                  'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3': row?.type == 'Non-EVM',
                })}
              >
                {row?.list.map((item, kIndex) => {
                  if (solanaWallet?.readyState === 'Installed' && publicKey && item.name === 'Solana') return null
                  return (
                    <li
                      className={classNames('relative cursor-pointer group flex items-center justify-between gap-2', {
                        tooltip: item?.disabled,
                        'p-3 border rounded-lg': row?.type == 'Non-EVM',
                      })}
                      data-tip="Upcoming"
                      key={`card-item-chains-${index}-${kIndex + 1}`}
                      onClick={e => handleChainsAction(item, row.type)}
                    >
                      <Avatar
                        src={item?.icon || getActiveChain({ name: item?.name })?.icon}
                        className={classNames(
                          'bg-transparent shadow-sm hover:rotate-y-360 duration-1000 transition-all',
                          {
                            'opacity-40': item?.disabled,
                          }
                        )}
                      />
                      {row?.type !== 'Non-EVM' && item?.chain?.id == chainId && (
                        <Avatar className="size-5 scale-90 bg-black absolute -bottom-1 right-0">
                          <NmIcon type="icon-tick" className="text-xs font-semibold" />
                        </Avatar>
                      )}
                      {row?.type == 'Non-EVM' &&
                        (!item?.disabled ? (
                          <Button
                            size="large"
                            color="success"
                            variant="contained"
                            className="bg-create-gradient-001 w-32 truncate rounded-lg text-sm shadow-none"
                          >
                            Connect {item.name}
                          </Button>
                        ) : (
                          <strong className="opacity-15">{item.name}</strong>
                        ))}
                    </li>
                  )
                })}
              </ul>
            )}
          </Box>
        ))}
      </section>
    </AccountsLayout>
  )
}
