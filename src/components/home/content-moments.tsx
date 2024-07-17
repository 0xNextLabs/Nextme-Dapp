import Link from 'next/link'
import { Avatar } from '@mui/material'
import Typewriter from 'typewriter-effect'
import { MacbookScroll } from '@/components/aceternity-ui/macbook-scroll'

import config from '@/config'

const { themes, logo, images } = config

const ContentMoments = () => {
  return (
    <section className="pt-12 sm:pb-32 text-center overflow-hidden">
      <MacbookScroll
        title={
          <header>
            <h1 className="leading-tight text-4.5xl lg:text-6xl text-slate-900 font-righteous">
              Share Moments, Social Payments.
            </h1>
            <Typewriter
              options={{
                wrapperClassName: 'text-6.5xl sm:text-8xl lg:text-9xl !leading-normal font-righteous',
                cursorClassName: 'text-6.5xl sm:text-8xl lg:text-9xl !leading-normal text-transparent',
                autoStart: true,
                loop: true,
              }}
              onInit={typewriter => {
                typewriter
                  .pauseFor(100)
                  .typeString(
                    `<span class='bg-clip-text text-transparent bg-create-gradient-001 pr-3 lg:pr-5'>For</span>`
                  )
                  .pauseFor(200)
                  .typeString(
                    `<span class='bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500'>Creators</span>`
                  )
                  .pauseFor(1000)
                  .deleteChars(8)
                  .typeString(
                    `<span class='bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500'>Brands</span>`
                  )
                  .pauseFor(1000)
                  .deleteChars(6)
                  .typeString(
                    `<span class='max-sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500'>Consumers</span>`
                  )
                  .pauseFor(1000)
                  .deleteChars(9)
                  .typeString(
                    `<span class='max-sm:text-5.5xl bg-clip-text text-transparent bg-create-gradient-001'>Everyone.</span>`
                  )
                  .pauseFor(3000)
                  .start()
              }}
            />
          </header>
        }
        badge={
          <Link href="/nextme.eth" target="_blank">
            <Avatar src={logo.dark} />
          </Link>
        }
        src={images.banner.cover}
        showGradient={false}
      />
    </section>
  )
}

export default ContentMoments
