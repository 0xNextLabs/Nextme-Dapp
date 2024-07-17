import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Typography, Box } from '@mui/material'
import Typewriter from 'typewriter-effect'
import config from '@/config'

const { domains } = config

const ContentSpace = () => {
  const router = useRouter()
  return (
    <section className="pb-12 md:pb-24 text-center">
      <Box className="pb-6">
        <Typewriter
          options={{
            wrapperClassName: 'text-4.5xl sm:text-5.5xl text-slate-900 font-righteous',
            cursorClassName: 'text-4.5xl sm:text-5.5xl text-transparent',
            autoStart: true,
          }}
          onInit={typewriter => {
            typewriter.typeString('Social Graph for Everyone').pauseFor(3000).start()
          }}
        />
        <Typography
          gutterBottom
          variant="h3"
          component="h3"
          className="text-neutral-500 text-lg py-4 sm:px-4 max-w-6xl m-auto"
        >
          What we want to create is a decentralized social economic network that is open and run by protocols, where the
          security, ownership and profitability of accounts are especially important and belong to every individual with
          a private key, without the concept of a platform. Allowing content, goods or derivatives, entertainment and
          interest dating, and consumption scenarios to be connected through freer and faster crypto-payments is what is
          massively adopted and belongs to the masses.
        </Typography>
      </Box>
      <Box>
        <Link href={`/gateway${router?.query?.from ? '?from=' + router.query.from : ''}`} passHref>
          <Button
            variant="contained"
            size="large"
            className="w-48 sm:w-60 py-2.5 shadow-sm rounded-full hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500 hover: to-pink-500 transition-all duration-500"
          >
            Launch Dapp
          </Button>
        </Link>
      </Box>
      <Box className="mt-16 px-2 sm:px-4 lg:px-28">
        <Image alt="" width={1631} height={779} src={`${domains.cdn}/home/space/cover_01.png`} draggable={false} />
      </Box>
    </section>
  )
}

export default ContentSpace
