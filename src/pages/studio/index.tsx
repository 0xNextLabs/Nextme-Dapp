import { useState } from 'react'
import Image from 'next/image'
import { Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Avatar, Box, Button, Fab } from '@mui/material'
import StudioLayout from '@/components/layout/studio'
import NmIcon from '@/components/nm-icon'
import NmTooltip from '@/components/nm-tooltip'
import NmBorderCounter from '@/components/nm-border-counter'
import { generateRandomString, getBlurDataURL } from '@/lib/utils'
import { useMobile } from '@/lib/hooks'

import config from '@/config'

const { domains } = config

let avatars = Array.from({ length: 80 }, (_, index) => index).sort(() => Math.random() - 0.5)

export default function Studio() {
  const [searchActive, setSearchActive] = useState(false)
  const isMobile = useMobile()
  const avatarBox = (index, key = null) => {
    let randomHash = generateRandomString(3)
    return (
      <li key={(key ? `${key}-` : '') + index}>
        <NmBorderCounter speed="smooth" customClass="p-1.5 rounded-full" innerClass="border-1">
          <Avatar
            className="skeleton rounded-full size-12 sm:size-14"
            src={`${domains.cdn}/avatars/${index + 120}.jpg`}
          />
        </NmBorderCounter>
        <p className="text-center text-neutral-500 py-1 text-sm xl:text-base">{`0x...${randomHash}`}</p>
      </li>
    )
  }

  return (
    <StudioLayout>
      <main>
        <header className="p-8 flex items-center justify-end gap-8 max-sm:hidden">
          {searchActive ? (
            <Box
              className="relative flex items-center w-full sm:w-2/3 animate__animated animate__lightSpeedInLeft"
              onBlur={() => setSearchActive(false)}
            >
              <NmIcon type="icon-search" className="text-2.5xl leading-0 text-gray-400 absolute left-4" />
              <input
                type="text"
                autoFocus
                placeholder="Search for anyone and anything you want"
                className="w-full input input-bordered outline-0 pl-12 py-5 truncate shadow-sm rounded-full border border-stone-200 focus:border-black focus:ring-0 placeholder-opacity-30"
              />
            </Box>
          ) : (
            <NmIcon
              type="icon-search"
              className="text-4xl leading-0 text-gray-400 cursor-pointer"
              onClick={() => setSearchActive(true)}
            />
          )}
          <NmTooltip title="Upcoming whitelist" placement="bottom">
            <Button
              className="rounded-full shadow-sm 2xl:text-lg w-44 2xl:w-48 h-12 bg-create-gradient-001"
              size="large"
              variant="contained"
            >
              Post
            </Button>
          </NmTooltip>
        </header>
        <section className="max-sm:pl-1 py-8 sm:p-4">
          {isMobile ? (
            <ul className="carousel carousel-center w-full gap-4">
              {avatars.map(row => avatarBox(row, 'avatar-mobile'))}
            </ul>
          ) : (
            <Swiper
              loop
              grabCursor
              spaceBetween={18}
              slidesPerView="auto"
              speed={2000}
              autoplay={{
                delay: 1000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              modules={[Autoplay]}
            >
              {avatars.map(row => {
                return (
                  <SwiperSlide key={`avatar-item-${row}`} className="!w-auto">
                    {avatarBox(row)}
                  </SwiperSlide>
                )
              })}
            </Swiper>
          )}
        </section>
        <section className="max-sm:px-1 blur-sm">
          <Image
            alt=""
            placeholder="blur"
            width="2000"
            height="1024"
            className="w-full"
            src={`${domains.cdn}/static/preview/studio_feeds_01.png`}
            blurDataURL={getBlurDataURL(2000, 1024)}
          />
        </section>
        <footer className="fixed bottom-20 sm:bottom-4 right-4 sm:hidden">
          <NmTooltip title="Upcoming" placement="left">
            <Fab color="success" aria-label="Create" className="shadow-sm bg-create-gradient-001">
              <NmIcon type="icon-darts" className="text-2.5xl" />
            </Fab>
          </NmTooltip>
        </footer>
      </main>
    </StudioLayout>
  )
}
