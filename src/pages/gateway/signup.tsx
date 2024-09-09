import { FunctionComponent, useState } from 'react'
import { Box, Button } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import GatewayLayout from '@/components/layout/gateway'
import SignCard from '@/components/gateway/SignCard'
import NmInputGateway from '@/components/nm-input/gateway'
import Copyright from '@/components/copyright'
import { useLocation } from '@/lib/hooks'

import config from '@/config'

const { title } = config

interface SignUpProps {}

const SignUp: FunctionComponent<SignUpProps> = () => {
  const [snackbar, setSnackbar] = useState(Object)
  const [username, setUserName] = useState<string>('')
  const [claimStatus, setClaimStatus] = useState<string>()
  const [step, setStep] = useState<number>(1)
  const host = useLocation()
  const router = useRouter()
  const handleClaim = () => {
    setStep(2)
  }
  return (
    <GatewayLayout>
      {step == 1 && (
        <>
          <header className="flex flex-col pt-32 md:pt-16">
            <ul className="mx-auto">
              <li className="px-8 md:px-12 lg:px-16">
                <h1 className="font-righteous mb-4 text-3xl lg:text-4xl">
                  First,
                  <p className="pt-6">Claim your unique handle</p>
                </h1>
                <p className="text-black/50 pb-12">The good ones are still available!</p>
              </li>
              <li className="pt-12 md:pt-20 flex flex-col items-center justify-center">
                <div className="mb-8">
                  <NmInputGateway
                    nameChange={val => setUserName(val)}
                    statusChange={val => setClaimStatus(val)}
                    snackbar={snackbar}
                  />
                </div>
                <Button
                  onClick={() => {
                    claimStatus == 'success' && handleClaim()
                  }}
                  variant="contained"
                  size="large"
                  className="w-72 lg:w-80 h-12 flex rounded-3xl shadow-sm justify-evenly disabled:bg-primary/50 disabled:text-white disabled:cursor-not-allowed"
                  disabled={claimStatus !== 'success'}
                >
                  {`Claim my ${title}`}
                </Button>
              </li>
            </ul>
            <Box>
              <p className="pt-16 sm:pt-24 pb-4 text-black/50 text-center">Already have a Nextme account？</p>
              <Link href={{ pathname: '/gateway', query: { ...router.query } }} className="flex m-auto w-fit">
                <Button className="m-auto w-72 text-center lg:w-80 h-12 rounded-3xl flex justify-between shadow-sm transition-all hover:bg-gradient-to-r  hover:text-white bg-transparent text-neutral-900 border border-solid hover:border-none hover:from-blue-500 hover:to-violet-700">
                  <p className="w-full text-center">Sign in</p>
                </Button>
              </Link>
            </Box>
          </header>
          <section className="my-16 text-center text-xs text-gray-900 sm:text-gray-400">
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
          </section>
          <Copyright customClass="justify-center pb-6" />
        </>
      )}
      {step == 2 && (
        <>
          <header className="flex justify-center pt-32 md:pt-16">
            <div className="px-8 md:px-12 lg:px-16">
              <h1 className="font-righteous pb-4 text-3xl lg:text-4xl">
                Next,
                <p className="pt-6">Create your Nextme account.</p>
              </h1>
              <p className=" text-black/50 pb-4">
                {(process.env.NODE_ENV === 'development' ? `dev.${config.host}/` : host + '/') + username} is yours!{' '}
                <span className="text-theme-primary cursor-pointer max-xl:block" onClick={() => setStep(1)}>
                  Don't like it? Change it.
                </span>
              </p>
            </div>
          </header>
          <SignCard username={username} isSignIn={false} />
        </>
      )}
    </GatewayLayout>
  )
}

export default SignUp
