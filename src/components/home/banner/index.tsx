import { useState } from 'react'
import Image from 'next/image'
import { Grid, Link } from '@mui/material'
import classNames from 'classnames'
import { Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import Typewriter from 'typewriter-effect'
import NmInputClaim from '@/components/nm-input/claim'
import NmGranim from '@/components/nm-granim'
import { getBlurDataURL } from '@/lib/utils'

import config from '@/config'

const { slogans, mission, themes, banner, domains } = config

const Banner = () => {
  const [curSwiperIdx, setSwiperIdx] = useState(0)

  return (
    <section className="flex flex-wrap xl:flex-nowrap items-center w-full pl-1 pt-14">
      <Grid item className="min-w-1/2 max-xl:pb-16">
        <h5 className="max-sm:pt-12 pb-4 text-white text-3xl">{mission}.</h5>
        <div className="max-w-2xl max-xs:max-w-full max-md:min-h-84 min-h-48 xl:min-h-[16.8rem]">
          <Typewriter
            options={{
              wrapperClassName:
                '!leading-snug sm:!leading-normal text-5xl 2xs:text-6xl xl:text-8xl text-white font-normal font-righteous',
              cursorClassName: 'text-5xl 2xs:text-6xl xl:text-8xl text-transparent',
              autoStart: true,
              loop: true,
            }}
            onInit={typewriter => {
              typewriter
                .pauseFor(100)
                .typeString(`<span class='max-sm:text-5xl'>${slogans[0]}</span><br>`)
                .pauseFor(300)
                .typeString(`<span>${slogans[1]}</span>`)
                .pauseFor(300)
                .deleteChars(4)
                .typeString(`<span class='${themes.textGradientPale}'>${slogans[2]}</span>`)
                .pauseFor(500)
                .deleteChars(11)
                .typeString(`<span class='${themes.textGradientPale}'>${slogans[3]}</span>`)
                .pauseFor(500)
                .deleteChars(1)
                .typeString(
                  `<span class='pl-4 font-black scale-120 ${themes.textGradientPale}'>${slogans[4]}</span><br>`
                )
                .pauseFor(500)
                .typeString(`<span>${slogans[5]}</span>`)
                .pauseFor(4000)
                .deleteAll()
                .typeString(`<span>${slogans[6]}</span><br>`)
                .pauseFor(500)
                .typeString(`<span>${slogans[7]}</span>`)
                .pauseFor(4000)
                .deleteChars(15)
                .typeString(`<span>${slogans[8]}</span>`)
                .pauseFor(4000)
                .start()
            }}
          />
        </div>
        <NmInputClaim customClass="mt-12" />
      </Grid>
      <Grid container className="justify-end overflow-hidden">
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop
          lazy
          centeredSlides
          watchSlidesProgress
          spaceBetween={20}
          slidesPerView={3}
          onSlideChange={e => setSwiperIdx(e.realIndex)}
          className="py-8"
        >
          {banner.swipers.map((row, index) => {
            return (
              <SwiperSlide
                key={`banner_swiper_0${index + 1}`}
                className={classNames('text-center', {
                  'scale-110 duration-1000': curSwiperIdx === index,
                })}
                virtualIndex={index}
              >
                <Link
                  underline="none"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  href={row.url}
                  className="overflow-hidden rounded-2xl"
                >
                  <Image
                    alt=""
                    width="210"
                    height="440"
                    placeholder="blur"
                    blurDataURL={getBlurDataURL(210, 440)}
                    src={`${domains.cdn}/bio/style/${index + 1}.png`}
                    className={classNames('object-contain object-top rounded-2xl', {
                      'shadow-md': curSwiperIdx === index,
                    })}
                  />
                </Link>
                {curSwiperIdx === index && (
                  <p className="flex justify-center -mt-6">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white/50" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white/75" />
                    </span>
                  </p>
                )}
              </SwiperSlide>
            )
          })}
        </Swiper>
      </Grid>
      <NmGranim />
    </section>
  )
}

export default Banner
