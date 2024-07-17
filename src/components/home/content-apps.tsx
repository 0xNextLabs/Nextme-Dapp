import { Typography } from '@mui/material'
import Typewriter from 'typewriter-effect'
import ItemAppsSwiper from './swiper-card/item-apps'
import { shuffle } from '@/lib/utils'

import apps from '@/config/common/apps'

const ContentApps = () => {
  return (
    <section className="xl:pt-12 pb-56 xl:pb-44">
      <ul className="relative flex justify-end">
        <li className="w-full overflow-hidden left-0 -bottom-48 xl:-bottom-32 absolute">
          {Array(6)
            .fill(0)
            .map((row, index) =>
              ItemAppsSwiper({
                index,
                data: shuffle(apps),
                dir: index % 2 === 0 ? 'rtl' : undefined,
                class: ![0, 5].includes(index) && 'opacity-50 hover:opacity-100',
              })
            )}
        </li>
        <li className="text-center md:pt-16 pb-8 lg:max-w-3/5 bg-white/40 backdrop-blur-lg rounded-2xl z-2">
          <Typewriter
            options={{
              wrapperClassName: 'leading-relaxed text-4xl sm:text-5.5xl text-slate-900 font-righteous',
              cursorClassName: 'text-4xl sm:text-5.5xl text-transparent',
              autoStart: true,
            }}
            onInit={typewriter => {
              typewriter.typeString('Better Web3 Portfolio<br>Connect Unlimited Apps').pauseFor(3000).start()
            }}
          />
          <Typography
            gutterBottom
            variant="h3"
            component="h3"
            className="text-neutral-500 text-lg py-4 sm:px-4 max-w-6xl m-auto"
          >
            Consumers or fans create feeds and share them (text, images, videos and other streams), new customers are
            referred and spend money to earn rebate tokens from brands and merchants, the referrer is also incentivized
            with a certain amount of tokens (just like when you place an order for any Tesla series through someone's
            Tesla referral link, and earn rewards after the vehicle has been delivered), and throughout the entire
            process the consumer gets better pricing, better member service, and is able to spend money and withdraw
            money as much as they want in the Nextme ecosystem. And merchants and brands through the Nextme Bio and
            Nextme Feeds to form a closed-loop brand traffic, the community members closely connected, some gifts,
            digital assets (NFT), coupons or tickets, etc. Nextme Pay will be throughout the entire payment and
            settlement system, no matter whether it is a crypto-payment or traditional fiat currency payment, and in the
            product experience no perceptive and low-threshold.
          </Typography>
        </li>
      </ul>
    </section>
  )
}

export default ContentApps
