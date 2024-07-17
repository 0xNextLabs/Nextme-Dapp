import { FC, PropsWithChildren } from 'react'
import { TwitterEmbed } from 'react-social-media-embed'
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid'
import { Button, Typography, Box } from '@mui/material'
import Typewriter from 'typewriter-effect'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper'
import Image from 'next/image'
import classNames from 'classnames'
import NmSpin from '@/components/nm-spin'

import { events, tweetIds } from '@/config/meetups'

import config from '@/config'

const { domains } = config

const ListItemTitle: FC<PropsWithChildren & { className?: string }> = ({ children, className }) => (
  <p className={classNames('text-xl 2xl:text-2xl text-white text-left pt-4 pl-4', className)}>{children}</p>
)

const ContentMeetups = () => {
  return (
    <article className="pb-20 md:pb-24 text-center">
      <header className="pb-6">
        <Typewriter
          options={{
            wrapperClassName: 'text-4.5xl sm:text-5.5xl text-slate-900 font-righteous',
            cursorClassName: 'text-4.5xl sm:text-5.5xl text-transparent',
            autoStart: true,
          }}
          onInit={typewriter => {
            typewriter.typeString('Discover Nearby Meetups').pauseFor(3000).start()
          }}
        />
        <Typography
          gutterBottom
          variant="h6"
          component="h6"
          className="text-neutral-500 text-lg py-4 max-w-5xl mx-auto"
        >
          Every week, we feature some of the most popular social meetups in cities like Vancouver、San Francisco and
          more！
          <p>
            Create and invite your friends to participate in Meetups, and you can receive token rewards and gifts from
            the organizers after check-in. In addition, you can check out and subscribe to some great calendars from the
            community.
          </p>
        </Typography>
      </header>
      <section>
        <Swiper
          loop
          spaceBetween={18}
          slidesPerView="auto"
          dir="rtl"
          speed={2000}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[Autoplay]}
        >
          {events.map(item => (
            <SwiperSlide key={item.name} className="!w-auto">
              <Box
                className="w-64 h-44 rounded-xl relative shadow-sm cursor-pointer"
                style={{ background: item?.linearGradient }}
              >
                <ListItemTitle>{item.name}</ListItemTitle>
                <Image
                  alt={item.name}
                  src={`${domains.cdn}/static/cities/${item.cityImgName}.png`}
                  className={classNames('absolute bottom-0 w-1/2 right-4', item?.cityImgClass)}
                  width="200"
                  height="200"
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
        <ul className="py-12 grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6">
          {tweetIds.slice(0, 9).map((item, index) => (
            <li key={`${index}-${item.id}`}>
              <TwitterEmbed
                url={item.url}
                key={`${index}-card-${item.id}`}
                width="100%"
                linkText="Twitter Feed Loading . . ."
                placeholderSpinner={<NmSpin customClass="-mb-8" />}
                twitterTweetEmbedProps={{
                  tweetId: item.id,
                  onLoad: e => {
                    e?.style?.setProperty('margin', '0 auto', 'important')
                  },
                }}
              />
            </li>
          ))}
        </ul>
      </section>
      <footer>
        <Button
          className="w-48 sm:w-60 py-2.5 shadow-sm rounded-full bg-create-gradient-001 hover:scale-105 hover:bg-gradient-to-r hover:from-violet-500 hover:to-fuchsia-500"
          size="large"
          variant="contained"
          href="/meetups"
          target="_blank"
        >
          Explore Meetups
        </Button>
      </footer>
    </article>
  )
}

export default ContentMeetups
