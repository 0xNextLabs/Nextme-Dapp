import Image from 'next/image'
import { Typography } from '@mui/material'
import { useMobile } from '@/lib/hooks'
import Typewriter from 'typewriter-effect'
import config from '@/config'

const { domains } = config

const ContentSpectrum = () => {
  const isMobile = useMobile()

  return (
    <section className="pb-12 md:pb-24 text-center">
      <div className="pb-8">
        <Typewriter
          options={{
            wrapperClassName: 'text-4.5xl sm:text-5.5xl text-slate-900 font-righteous',
            cursorClassName: 'text-4.5xl sm:text-5.5xl text-transparent',
            autoStart: true,
          }}
          onInit={typewriter => {
            typewriter.typeString('Account Economy Spectrum').pauseFor(3000).start()
          }}
        />
        <Typography gutterBottom variant="h6" component="h6" className="text-neutral-500 text-lg py-4 max-w-4xl m-auto">
          What exactly is a free encrypted identity, an Instagram account, a PayPal account, an ENS domain name?
          <br />A Nextme identity, connecting anything and everything, we did it, and also connect his social life and
          relationship to open up, consumption scene and interest dating, any time and any place, Show your Nextme
          All-in-Bio, Dating and Pay + , discover interesting people and stories.
        </Typography>
      </div>
      <ul className="relative flex justify-center">
        <li className="overflow-hidden">
          <Image
            alt=""
            src={`${domains.cdn}/home/spectrum/planet_ring.png`}
            width="600"
            height="600"
            className="object-cover animate-spin animate-duration-10"
            draggable={false}
          />
        </li>
        <li className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hover:scale-75 transition duration-700 ease-linear">
          <Image
            alt=""
            src={`${domains.cdn}/home/spectrum/planet_center.png`}
            width={isMobile ? 150 : 300}
            height={isMobile ? 185 : 369}
            className="object-cover"
            draggable={false}
          />
        </li>
      </ul>
    </section>
  )
}

export default ContentSpectrum
