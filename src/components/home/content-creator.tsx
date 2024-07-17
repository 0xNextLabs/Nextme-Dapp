import Image from 'next/image'
import Link from 'next/link'
import Typewriter from 'typewriter-effect'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper'
import { Typography, Button } from '@mui/material'
import { useMobile } from '@/lib/hooks'
import { useRouter } from 'next/router'

import config from '@/config'

const { domains } = config

const CreatorGallery = () => {
  const isMobile = useMobile()

  return (
    <Swiper
      centeredSlides
      grabCursor
      slidesPerView={isMobile ? 2 : 5}
      spaceBetween={isMobile ? 30 : 60}
      speed={1000}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      pagination={{
        clickable: true,
      }}
      loop
      navigation
      modules={[Autoplay]}
    >
      {Array(6)
        .fill(0)
        .map((item, index) => {
          return (
            <SwiperSlide key={`creator_views_${index}`} style={{ listStyle: 'none' }}>
              <Image
                alt=""
                width={855}
                height={1202}
                src={`${domains.cdn}/home/creator/content_creator_${index + 1}.png`}
                className="rounded-xl"
                draggable={false}
              />
            </SwiperSlide>
          )
        })}
    </Swiper>
  )
}

const ContentCreator = () => {
  const router = useRouter()
  return (
    <section className="pb-12 md:pb-24">
      <div className="text-center xs:mb-2 lg:mb-16">
        <Typewriter
          options={{
            wrapperClassName: 'text-4.5xl sm:text-5.5xl text-slate-900 font-righteous',
            cursorClassName: 'text-4.5xl sm:text-5.5xl text-transparent',
            autoStart: true,
          }}
          onInit={typewriter => {
            typewriter.typeString('Web2+3 Creator').pauseFor(3000).start()
          }}
        />
      </div>
      <ul>
        <li className="p-8 lg:pl-12 max-md:px-0 max-md:text-center max-md:mb-48 max-w-xl xl:max-w-2xl">
          <Typography gutterBottom variant="h5" component="h5" className="text-slate-900 font-righteous max-w-sm">
            Aggregate and Create Unlimited Social Links or Dynamic Data
          </Typography>
          <Typography gutterBottom variant="h6" component="h6" className="text-neutral-500 text-lg py-4">
            This can be Links, Music, Videos, Blogs, Portfolios, Derivatives, Meetups, Feeds, Badges, NFT Collection,
            etc.
          </Typography>

          <Link
            href={`/gateway${router?.query?.from ? '?from=' + router.query.from : ''}`}
            className="max-md:text-center"
            passHref
          >
            <Button
              variant="contained"
              size="large"
              className="w-48 sm:w-60 py-2.5 shadow-sm rounded-full hover:scale-105 hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-500 transition-all duration-500 mt-2"
            >
              Launch Dapp
            </Button>
          </Link>
        </li>

        <li className="relative">
          <CreatorGallery />
          <div className="absolute top-1/2 -translate-y-[66%] -translate-x-[50%] w-[58%] sm:w-[21%] sm:right-[8%] max-md:left-1/2">
            <Image
              alt=""
              width={1026}
              height={2171}
              src={`${domains.cdn}/home/creator/content_creator_phone.png`}
              draggable={false}
            />
          </div>
        </li>
      </ul>
    </section>
  )
}

export default ContentCreator
