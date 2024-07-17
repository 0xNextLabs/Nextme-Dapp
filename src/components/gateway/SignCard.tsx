import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { Avatar, Box, Button, Divider, Link, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material'
import { useAccount, useSignMessage } from 'wagmi'
import useSWRImmutable from 'swr/immutable'
import { useWallet } from '@solana/wallet-adapter-react'
import classNames from 'classnames'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { SiweMessage } from 'siwe'
import finger from '@fingerprintjs/fingerprintjs'
import NmIcon from '@/components/nm-icon'
import NmSpin from '@/components/nm-spin'
import NmTooltip from '@/components/nm-tooltip'
import Copyright from '@/components/copyright'
import { useSnackbar } from '@/components/context/snackbar'
import NmGlobalWallet from '@/components/nm-global-wallet'
import { getCsrfToken, startAuth } from '@/services/auth'
import { getUserNameAddressSvc } from '@/services/user'
import { useChainConnect, useInviteKey, useMobile, useGlobalWalletConnect } from '@/lib/hooks'
import { isDomainsName } from '@/lib/domain/valid'
import { fetcher } from '@/lib/fetcher'

import config from '@/config'

const { title } = config

interface SignCardProps {
  username?: string
  isSignIn?: boolean
}

const SignCard: FunctionComponent<SignCardProps> = ({ username, isSignIn = true }) => {
  const globalWalletConnect = useGlobalWalletConnect()
  const { address, sol, chainType } = useChainConnect()
  const { signMessage } = useWallet()
  const { showSnackbar } = useSnackbar()
  const { data: providers } = useSWRImmutable<{ name: string; id: string }[]>({ url: '/api/auth/providers' }, fetcher)
  const [activeStep, setActiveStep] = useState(1)
  const signWalletSteps = ['Connect Wallet', `${isSignIn ? 'Sign and ' : ''}Verify your Account`]
  const { isPending: signLoading, signMessageAsync } = useSignMessage()
  const [snackbar, setSnackbar] = useState(Object)
  const account = useAccount()
  const isMobile = useMobile()
  const router = useRouter()
  const { inviteKey: from } = useInviteKey()
  const [walletSigning, setWalletSigning] = useState<number>()
  const [oauthLoading, setOAuthLoading] = useState<boolean[]>(providers?.map(() => false) || [])
  const [isDomains, setIsDomains] = useState(() => isDomainsName(username))
  const [disableOtherOauth, setDisableOtherOauth] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userDomains, setUserDomains] = useState('')
  const signWith = useCallback(
    async (name: string, index: number) => {
      if (loading) return
      try {
        const fp = await finger.load()
        const result = await fp?.get()
        let _username = isSignIn ? '' : userDomains ? '' : username
        setWalletSigning(index)
        if (name === 'wallet') {
          let signWalletQuery = {
            domain: window?.location?.host,
            address,
            chainId: account?.chainId,
            statement: 'Sign in with Wallet Dapp.',
            uri: window.location.origin,
            version: '1',
            nonce: (await getCsrfToken())?.value || '',
            username: _username,
          }

          let res, message, signWalletChain

          if (sol) {
            signWalletChain = {
              chainId: 1, // Solana id 暂无，默认为1，为以后有侧链了做准备
              chainType: 'sol',
              address,
            }
            message = new TextEncoder().encode(
              `${window.location.host} wants you to sign in with your Solana account:\n${address}\n\nPlease sign in.`
            )
            res = await signMessage(message)
          } else {
            signWalletChain = {
              chainId: account?.chainId,
              chainType: 'default',
              address,
            }
            message = new SiweMessage(signWalletQuery)
            res = await signMessageAsync({
              message: message.prepareMessage(),
              account: address,
            })
          }

          await startAuth(
            {
              name,
              query: {
                isSignIn,
                username: _username,
                ...signWalletChain,
                openNewWindow: !isMobile,
                from,
                credentials: {
                  message: JSON.stringify(message),
                  signature: res,
                  redirect: true,
                  callbackUrl: '/studio',
                },
                _fp: result?.visitorId,
              },
            },
            router,
            () => {
              setActiveStep(2)
              showSnackbar({
                snackbar: {
                  open: true,
                  type: 'success',
                  text: 'Wallet signature success ᵔ◡ᵔ',
                },
                anchorOrigin: {
                  vertical: 'top',
                },
              })
              setTimeout(_ => {
                setWalletSigning(-1)
              }, 10000)
            }
          )
        } else {
          startAuth(
            {
              name,
              query: {
                isSignIn,
                openNewWindow: !isMobile,
                from,
                username: _username,
                _fp: result?.visitorId,
              },
            },
            router,
            () => {
              setTimeout(_ => {
                setWalletSigning(-1)
              }, 1000)
            }
          )
        }
      } catch (error) {
        console.log(error)
        setSnackbar({
          type: 'error',
          text: 'Signature cancel, please try again.',
        })
        setWalletSigning(-1)
        showSnackbar({
          snackbar: {
            open: true,
            type: 'error',
            text: error?.reason || 'Unexpected error occurred',
          },
          anchorOrigin: {
            vertical: 'top',
          },
        })
      } finally {
      }
    },
    [account?.chainId, address, sol, from, userDomains, username]
  )
  useEffect(() => {
    setOAuthLoading(providers?.map(() => false) || [])
  }, [providers])

  useEffect(() => {
    setIsDomains(isDomainsName(username))
  }, [username])

  useEffect(() => {
    setDisableOtherOauth((isDomains && !isSignIn) || (!isSignIn && Boolean(userDomains)))
  }, [isDomains, isSignIn, userDomains])

  useEffect(() => {
    if (address) {
      ;(async () => {
        setLoading(true)
        const username = await getUserNameAddressSvc({ address, chainType })
        if (username?.claimed) {
          setUserDomains(
            (process.env.NODE_ENV === 'development' ? `dev.${config.host}/` : window.location.host + '/') +
              username?.claimed
          )
        } else {
          setUserDomains('')
        }
        setLoading(false)
      })()
    } else {
      setUserDomains('')
    }
  }, [address])
  return (
    <>
      <ul className="flex flex-col items-center">
        <li className="mb-8 mt-10 flex justify-center w-full">
          {globalWalletConnect ? (
            <Stepper activeStep={activeStep} orientation="vertical" className="lg:-ml-6 max-xs:-ml-6">
              {signWalletSteps.map((item, index) => (
                <Step key={`sign-wallet-${index}`} active>
                  <StepLabel>
                    <Typography component="h5">{item}</Typography>
                  </StepLabel>
                  <StepContent>
                    {index === 0 && (
                      <NmGlobalWallet commonClass="w-72 lg:w-80 h-12 rounded-3xl" hasConnectWallet={false} />
                    )}
                    {index === 1 && (
                      <Box>
                        {userDomains && (
                          <Link href={'https://' + userDomains} target="_blank" className="no-underline">
                            <p className="w-full text-center pt-4 pb-8 text-primary">
                              {userDomains}
                              <NmIcon
                                type="icon-certified"
                                className="text-theme-primary text-lg leading-none inline-flex my-auto ml-3"
                              />
                            </p>
                          </Link>
                        )}
                        <Button
                          variant="contained"
                          size="large"
                          className="w-72 lg:w-80 h-12 flex rounded-3xl justify-evenly shadow-sm"
                          onClick={() => signWith('wallet', 0)}
                          disabled={signLoading}
                        >
                          <div className="basis-1/4 text-2xl flex items-center justify-center">
                            {walletSigning === 0 ? (
                              <NmIcon type="icon-spin" className="animate-spin mr-2" />
                            ) : (
                              <NmIcon type="icon-signature" />
                            )}
                          </div>
                          <span className="flex-1">{isSignIn || userDomains ? 'Sign in' : 'Sign up'} with Account</span>
                        </Button>
                      </Box>
                    )}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          ) : (
            <NmGlobalWallet
              startIcon={<NmIcon type="icon-wallet" className="-ml-4 mr-12" />}
              walletClass="w-72 lg:w-80 h-12 rounded-3xl bg-gradient-to-r from-green-400 to-blue-500 hover:bg-create-gradient-001 hover:transition-all hover:duration-1000"
            />
          )}
        </li>
        <li className="mb-8 w-72 lg:w-80 text-center">
          <Divider>OR</Divider>
        </li>

        {providers && Object.keys(providers)?.length ? (
          Object.values(providers)
            .filter(row => row['name'] !== 'Ethereum')
            .map(
              (provider, index) =>
                (index < 4 && (
                  <NmTooltip
                    key={index}
                    disableFocusListener
                    title={disableOtherOauth ? 'Disconnect or switch to a new wallet' : ''}
                  >
                    <li className="mb-6" key={`login-${provider?.name}`}>
                      <Button
                        variant="contained"
                        size="large"
                        disabled={disableOtherOauth || walletSigning === index + 1}
                        className={classNames(
                          ' disabled:opacity-60 disabled:cursor-not-allowed w-72 lg:w-80 h-12 rounded-3xl flex justify-between shadow-sm transition-all hover:bg-gradient-to-r',
                          (oauthLoading.every(l => !Boolean(l)) || oauthLoading[index]) && !(isDomains && !isSignIn)
                            ? ['google', 'twitter'].includes(provider?.id)
                              ? 'bg-transparent text-neutral-900 border border-solid hover:border-none hover:text-white hover:from-blue-500 hover:to-violet-700'
                              : 'bg-black text-white hover:from-violet-700 hover:to-blue-500'
                            : 'cursor-not-allowed bg-neutral-200'
                        )}
                        onClick={async () => {
                          await signWith(provider?.id, index + 1)
                        }}
                      >
                        {walletSigning === index + 1 ? (
                          <NmIcon
                            type="icon-spin"
                            className="basis-1/4 flex items-center justify-center text-2xl animate-spin mr-2"
                          />
                        ) : (
                          <NmIcon
                            type={`icon-${
                              oauthLoading[index] ? 'spin' : provider?.id.includes('twitter') ? 'x' : provider?.id
                            }`}
                            className={classNames(
                              'basis-1/4 text-2xl flex items-center justify-center',
                              oauthLoading[index] && 'animate-spin'
                            )}
                          />
                        )}
                        <span className="flex-1">{`Sign ${isSignIn ? 'in' : 'up'} with ${provider?.name}`}</span>
                      </Button>
                    </li>
                  </NmTooltip>
                )) ||
                (index === 4 && (
                  <li className="my-6 w-72 lg:w-80 flex justify-evenly max-w-sm" key={`login-${provider?.name}-more`}>
                    {Object.values(providers)
                      .filter(row => row['name'] !== 'Ethereum')
                      .map((provider, index) => {
                        let socialDisable = ['instagram', 'tiktok', 'email'].includes(provider?.name)
                        return (
                          index > 3 && (
                            <NmTooltip
                              key={index}
                              title={
                                disableOtherOauth
                                  ? 'Disconnect or switch to a new wallet'
                                  : socialDisable
                                    ? 'coming soon'
                                    : ''
                              }
                            >
                              <Avatar
                                className={classNames('size-12 bg-gray-200 pb-0.5 cursor-pointer', {
                                  '!cursor-not-allowed opacity-60': disableOtherOauth
                                    ? true
                                    : oauthLoading.every(l => !Boolean(l))
                                      ? socialDisable
                                      : !oauthLoading[index],
                                })}
                                key={`login-${provider?.name}`}
                                onClick={async () =>
                                  !disableOtherOauth && !socialDisable && (await signWith(provider?.name, index))
                                }
                              >
                                <NmIcon type={`icon-${provider?.id}_colors`} className="text-2xl" />
                              </Avatar>
                            </NmTooltip>
                          )
                        )
                      })}
                  </li>
                ))
            )
        ) : (
          <NmSpin customClass="my-4 mb-6" />
        )}
        <p className="pt-8 sm:pt-2 mb-4 text-black/50">
          {username ? 'Already have a Nextme account？' : 'Don’t have a Nextme account?'}
        </p>
        <li>
          <Button className="w-72 text-center lg:w-80 h-12 rounded-3xl flex justify-between shadow-sm transition-all hover:bg-gradient-to-r  hover:text-white bg-transparent text-neutral-900 border border-solid hover:border-none hover:from-blue-500 hover:to-violet-700">
            <NextLink
              href={{
                pathname: username ? '/gateway' : '/gateway/signup',
                query: { ...router.query },
              }}
              className="w-full"
            >
              <p className="w-full text-center">{username ? 'Sign in' : 'Sign up'}</p>
            </NextLink>
          </Button>
        </li>
        <li className="my-16 text-center text-xs text-gray-900 sm:text-gray-400">
          <p>{`By signing in you accept to ${title}'s`}</p>
          <p>
            <Link
              href="/user/terms"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="px-1 text-gray-500 underline decoration-dotted hover:text-gray-600"
            >
              Terms of Service
            </Link>
            and
            <Link
              href="/user/privacy"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="px-1 text-gray-500 underline decoration-dotted hover:text-gray-600"
            >
              Privacy Policy
            </Link>
          </p>
        </li>
      </ul>
      <Copyright customClass="justify-center pb-6" />
    </>
  )
}

export default SignCard
