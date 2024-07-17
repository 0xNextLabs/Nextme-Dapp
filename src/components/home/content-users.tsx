import { useEffect, useState } from 'react'
import Typewriter from 'typewriter-effect'
import { Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Button, Typography, Skeleton } from '@mui/material'
import Swipe from './swiper-card'
import { useMobile } from '@/lib/hooks'
import { proxyExploreListSvc } from '@/services/oa'

const ContentUsers = () => {
  const isMobile = useMobile()
  const [exploreList, setExploreList] = useState([])

  useEffect(() => {
    const getList = async () => {
      const res = await proxyExploreListSvc()
      if (res?.ok && res?.data) setExploreList(res.data.filter(row => !row['disabled'] && row.path))
    }
    getList()
  }, [])

  const initSlides = (list = [], showSkeleton) => {
    return list.map((row, index) => (
      <SwiperSlide key={`slide-${index}`} className="min-w-[10rem]">
        {showSkeleton ? (
          <Skeleton
            variant="rounded"
            animation="wave"
            className="rounded-xl"
            width={isMobile ? 164 : 230}
            height={isMobile ? 224 : 300}
          />
        ) : (
          <Swipe data={row} />
        )}
      </SwiperSlide>
    ))
  }

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
            typewriter.typeString('Popular Creators & Brands').pauseFor(3000).start()
          }}
        />
        <Typography
          gutterBottom
          variant="h6"
          component="h6"
          className="text-neutral-500 text-lg py-4 max-w-5xl mx-auto"
        >
          Brand, Photographer, Designer, Blogger, Artist, Star, DAO Club, NFT Holder, Organization...etc.
        </Typography>
      </header>
      <Swiper
        modules={[Autoplay]}
        slidesPerView={isMobile ? 2 : 5}
        spaceBetween={30}
        speed={3000}
        autoplay={{ delay: 1000, pauseOnMouseEnter: true, disableOnInteraction: false }}
        loop
        lazy
        grabCursor
        centeredSlides
      >
        {initSlides(
          exploreList.length ? exploreList.slice(0, Math.ceil(exploreList.length / 2)) : [...new Array(20).keys()],
          exploreList.length ? false : true
        )}
      </Swiper>
      <Swiper
        dir="rtl"
        modules={[Autoplay]}
        slidesPerView={isMobile ? 2 : 5}
        spaceBetween={30}
        speed={3000}
        autoplay={{ delay: 1000, pauseOnMouseEnter: true, disableOnInteraction: false }}
        loop
        lazy
        grabCursor
        centeredSlides
        className="mt-6"
      >
        {initSlides(
          exploreList.length ? exploreList.slice(Math.ceil(exploreList.length / 2)) : [...new Array(20).keys()],
          exploreList.length ? false : true
        )}
      </Swiper>
      <footer className="pt-16">
        <Button
          variant="contained"
          size="large"
          className="w-48 sm:w-60 py-2.5 shadow-sm rounded-full hover:scale-105 hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-500"
          href="/explore"
          target="_blank"
        >
          Explore Gallery
        </Button>
      </footer>
    </article>
  )
}

export default ContentUsers
