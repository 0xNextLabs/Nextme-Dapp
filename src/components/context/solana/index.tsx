import React, { FC, ReactNode, useEffect, useMemo, useState, useCallback } from 'react'
import { AutoConnectProvider, useAutoConnect } from '@/components/context/solana/connect'
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import type { Adapter, WalletError } from '@solana/wallet-adapter-base'
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletWalletAdapter,
  GlowWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

import { type SolanaSignInInput } from '@solana/wallet-standard-features'
import { verifySignIn } from '@solana/wallet-standard-util'
import { clusterApiUrl } from '@solana/web3.js'
import { getSolanaRPCUrl } from '@/lib/web3'
import { env } from '@/lib/types/env'

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css')

let mainnet = env?.isProd

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // If window exists and is on localhost, choose devnet, else choose mainnet
  // const network = 'https://example.solana-devnet.quiknode.pro/00000000000/';
  const { autoConnect } = useAutoConnect()
  const network = mainnet ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet

  // const endpoint = useMemo(() => clusterApiUrl(network), [network])
  // const endpoint = clusterApiUrl(network)
  const endpoint = getSolanaRPCUrl()

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new SolletWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [network]
  )

  // const { enqueueSnackbar } = useSnackbar();
  // const onError = useCallback(
  //   (error: WalletError, adapter?: Adapter) => {
  //       enqueueSnackbar(error.message ? `${error.name}: ${error.message}` : error.name, { variant: 'error' });
  //       console.error(error, adapter);
  //   },
  //   [enqueueSnackbar]
  // );

  const autoSignIn = useCallback(async (adapter: Adapter) => {
    if (!('signIn' in adapter)) return true

    const input: SolanaSignInInput = {
      domain: window.location.host,
      address: adapter.publicKey ? adapter.publicKey.toBase58() : undefined,
      statement: 'Please sign in.',
    }
    const output = await adapter.signIn(input)

    if (!verifySignIn(input, output)) throw new Error('Sign In verification failed!')

    return false
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        // onError={onError}
        // autoConnect={autoConnect && autoSignIn}
        // autoConnect={autoSignIn}
        autoConnect={true}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AutoConnectProvider>
      <WalletContextProvider>{children}</WalletContextProvider>
    </AutoConnectProvider>
  )
}
