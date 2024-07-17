import { FC, PropsWithChildren } from 'react'
import { TwitterEmbed } from 'react-social-media-embed'
import { Avatar, Box, Button, Chip } from '@mui/material'
import Image from 'next/image'
import classNames from 'classnames'
import { Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import StudioLayout from '@/components/layout/studio'
import OpenLayout from '@/components/layout/open'
import NmSpin from '@/components/nm-spin'
import NmTooltip from '@/components/nm-tooltip'
import { useIsUserLogin } from '@/lib/hooks'
import { events, tweetIds, calendars } from '@/config/meetups'

import config from '@/config'

const { domains, logo } = config

const SubTitle: FC<PropsWithChildren & { className?: string }> = ({ children, className }) => (
  <h2 className={classNames('font-semibold text-2xl 2xl:text-2.5xl text-neutral-800', className)}>{children}</h2>
)
const SubDescription: FC<PropsWithChildren & { className?: string }> = ({ children, className }) => (
  <p className={classNames('2xl:text-xl text-neutral-400 pt-1', className)}>{children}</p>
)
const ListItemTitle: FC<PropsWithChildren & { className?: string }> = ({ children, className }) => (
  <p className={classNames('text-xl 2xl:text-2xl text-white text-left pt-4 pl-4', className)}>{children}</p>
)

export default function Meetups({ ...props }) {
  const { loginStatus, loginLoading } = useIsUserLogin()
  const meetupsContent = (classes = null) => (
    <main className={classNames('overflow-hidden', classes)}>
      <header className="flex items-center justify-between pb-8">
        <span className="font-semibold text-3.5xl text-neutral-800">Meetups</span>
        <NmTooltip title="Upcoming whitelist" placement="bottom">
          <Button
            className="rounded-full shadow-sm 2xl:text-lg w-44 2xl:w-48 h-12 bg-create-gradient-001"
            size="large"
            variant="contained"
          >
            Create Meetup
          </Button>
        </NmTooltip>
      </header>
      <p className="2xl:text-lg text-neutral-400 pt-4 xl:pr-56">
        Every week, we feature some of the most popular social meetups in cities like Vancouver、San Francisco and
        more！ <br />
        Create and invite your friends to participate in Meetups, and you can receive token rewards and gifts from the
        organizers after check-in. In addition, you can check out and subscribe to some great calendars from the
        community.
      </p>
      <section className="pt-14">
        <SubTitle>Popular Events</SubTitle>
        <SubDescription>Updated Weekly</SubDescription>
        <Swiper
          loop
          spaceBetween={18}
          slidesPerView="auto"
          dir="rtl"
          speed={2000}
          className="py-12"
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
      </section>

      <section className="border-t border-t-zinc-100 pt-8">
        <SubTitle>Recently Calendars</SubTitle>
        <SubDescription>That We Love</SubDescription>
        <Swiper
          loop
          spaceBetween={18}
          slidesPerView="auto"
          speed={2000}
          className="py-12"
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[Autoplay]}
        >
          {calendars.map((item, index) => (
            <SwiperSlide key={index} className="!w-auto">
              <Box className="w-64 h-48 rounded-xl border border-stone-100 p-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <Avatar
                    className="size-11 2xl:w-12 2xl:h-12 bg-stone-100 rounded-md"
                    src={item['avatar'] || logo.dark}
                  />
                  <Chip className="text-neutral-600 bg-stone-100 cursor-not-allowed" label="Subscribe" />
                </div>
                <h1 className="pt-4 text-lg font-medium text-neutral-800 line-clamp-1">{item.title}</h1>
                <p className="pt-2 text-sm 2xl:text-base text-neutral-400 line-clamp-3">{item.desc}</p>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="border-t border-t-zinc-100 pt-8">
        <SubTitle>On-site Highlights</SubTitle>
        <SubDescription>Record our happy moments</SubDescription>
        <ul className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6 pt-8">
          {tweetIds.map((item, index) => (
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
    </main>
  )
  return loginStatus || loginLoading ? (
    <StudioLayout>{meetupsContent('p-4 sm:p-8 pt-10 max-sm:pb-16')}</StudioLayout>
  ) : (
    <OpenLayout>
      <Header logoTextClass="text-theme-primary-focus" />
      {meetupsContent('p-2 py-12 sm:p-24')}
      <Footer />
    </OpenLayout>
  )
}
