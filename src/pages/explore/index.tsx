import { useState, useEffect } from 'react'
import { Avatar, Box, Button, Link, Skeleton } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper'
import Typewriter from 'typewriter-effect'
import classNames from 'classnames'
import Image from 'next/image'
import OpenLayout from '@/components/layout/open'
import Header from '@/components/header'
import Footer from '@/components/footer'
import NmIcon from '@/components/nm-icon'
import NmBorderCounter from '@/components/nm-border-counter'
import StudioLayout from '@/components/layout/studio'
import { useExplorePageList, useLabelList, useTypeList } from '@/components/explore/hook'
import { FormSearchInput } from '@/components/explore/FormSearchInput'
import DefaultLabels from '@/components/explore/DefaultLabels'
import { useIsUserLogin } from '@/lib/hooks'
import { getBlurDataURL } from '@/lib/utils'

import config from '@/config'

const { title, domains } = config

function Explore({ ...props }) {
  const { list: typeList, setList: setTypeList, resetList: resetTypeList, loading: typeLoading } = useTypeList()
  const {
    list: labelList,
    setList: setLabelList,
    resetList: resetLabelList,
    loading: labelLoading,
    handleInputChange,
    handleInputEnter,
    labelName,
    resetLabelName,
  } = useLabelList()
  const { search, exploreList, handleSetSearch, loading: exploreLoading } = useExplorePageList()
  const [showSkeleton, setShowSkeleton] = useState(true)
  const { loginStatus, loginLoading } = useIsUserLogin()
  const handleChangeTabs = index => {
    const item = typeList[index]
    handleSetSearch(item.isSelect ? 0 : item.value)
    if (item.isSelect) {
      resetTypeList()
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setShowSkeleton(!exploreList.length)
    }, 300)
  }, [exploreList.length])

  useEffect(() => {
    if (Object.keys(search).length) {
      const hasType = Object.hasOwn(search, 'type')
      const hasLabels = Object.hasOwn(search, 'labels')
      if (hasType) {
        const list = typeList.map(item => ({ ...item, isSelect: item.value === search.type }))
        setTypeList(list)
        // resetLabelList()
        resetLabelName()
      }
      if (hasLabels) {
        const list = labelList.map(item => ({ ...item, isSelect: search.labels.includes(item.id) }))
        setLabelList(list)
        resetTypeList()
      }
    }
  }, [search])

  const exploreContent = (classes = null, typeClass = null) => (
    <section className={classNames('py-20', classes)}>
      <Box className="pb-12 text-center">
        <Typewriter
          options={{
            wrapperClassName:
              'xl:text-5.5xl text-4.5xl text-slate-900 font-righteous text-transparent bg-clip-text bg-theconvo-gradient-001 bg-cover transition-all duration-700',
            cursorClassName: 'xl:text-5.5xl text-4.5xl text-transparent',
            autoStart: true,
          }}
          onInit={typewriter => {
            typewriter.typeString(`${title} Gallery`).start()
          }}
        />
        <Typewriter
          options={{
            wrapperClassName:
              'text-4.5xl sm:text-5.5xl text-slate-900 font-righteous text-transparent bg-clip-text bg-theconvo-gradient-001 bg-cover transition-all duration-700',
            cursorClassName: 'text-4.5xl sm:text-5.5xl text-transparent',
            autoStart: true,
          }}
          onInit={typewriter => {
            typewriter.pauseFor(2700).typeString('Get inspired by the most creative works.').start()
          }}
        />
      </Box>
      {typeLoading ? (
        <ul className="flex gap-4 overflow-x-hidden">
          {new Array(11).fill(0).map((item, index) => (
            <li key={index}>
              <Skeleton variant="rounded" className="rounded-xl" width={160} height={100} />
            </li>
          ))}
        </ul>
      ) : (
        <Swiper
          freeMode
          slidesPerView={2.5}
          modules={[FreeMode]}
          className={classNames('flex gap-12 py-5 -mx-4 sticky z-1 top-0 backdrop-blur bg-white/60', typeClass, {
            'scrollbar-hide overflow-x-scroll': typeList?.length > 0,
          })}
          breakpoints={{
            480: {
              slidesPerView: 3,
            },
            640: {
              slidesPerView: 4,
            },
            768: {
              slidesPerView: 5,
            },
            1024: {
              slidesPerView: 9,
            },
            1400: {
              slidesPerView: 10,
            },
            1800: {
              slidesPerView: 12,
            },
          }}
        >
          {typeList.map((item, index) => (
            <SwiperSlide
              key={item.id}
              className={classNames({
                'mx-4': item.isSelect,
              })}
            >
              <Box
                className={classNames(
                  'text-center cursor-pointer hover:scale-110 transition duration-300',
                  item.isSelect
                    ? '-mt-1.5 text-white bg-gradient-to-r from-fuchsia-500 to-indigo-500 transition rounded-md py-2 min-w-[8.5rem]'
                    : 'min-w-max'
                )}
                onClick={() => handleChangeTabs(index)}
              >
                <NmIcon type={item.icon} className="text-3xl" />
                <h6 className="pt-1">{item.name}</h6>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <section className="flex justify-center mt-5 mb-8 xl:mb-12">
        <FormSearchInput
          labelName={labelName}
          handleInputChange={handleInputChange}
          handleInputEnter={handleInputEnter}
          className="w-1/2 max-sm:w-full"
        />
      </section>

      <DefaultLabels handleSetSearch={handleSetSearch} labelList={labelList} loading={labelLoading} />

      <ul className="pt-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12 xl:gap-16">
        {(exploreLoading ? [...new Array(11).keys()] : exploreList).map((item, index) => (
          <li key={`explore-item-${index}`} className="card shadow-md">
            <figure>
              {showSkeleton ? (
                <Skeleton variant="rectangular" width={1024} height={360} />
              ) : (
                <Link target="_blank" rel="noopener noreferrer nofollow" href={item?.path}>
                  <Image
                    alt=""
                    width="1024"
                    height="640"
                    unoptimized
                    placeholder="blur"
                    blurDataURL={getBlurDataURL(360, 360)}
                    className="h-120 object-cover object-top xl:hover:scale-120 duration-500 transition-all"
                    src={`${domains.cdn}/explore/cover/${item?.path}.png`}
                    onError={e => {
                      e.currentTarget.onerror = null
                      e.target['src'] = item.avatar
                    }}
                  />
                </Link>
              )}
            </figure>
            <ul className="card-body p-5">
              <li>
                {showSkeleton ? (
                  <Skeleton />
                ) : (
                  <Box className="flex items-center w-full">
                    <NmBorderCounter speed="smooth" customClass="rounded-full p-1" innerClass="border-1">
                      <Avatar src={item?.avatar} className="size-12 hover:rotate-y-360 duration-1500 transition-all" />
                    </NmBorderCounter>
                    <h2 className="card-title truncate min-w-0 ml-3">{item?.name || item?.path}</h2>
                  </Box>
                )}
              </li>
              <li className="card-actions justify-end">
                {showSkeleton ? (
                  <Skeleton width="40%" />
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    href={item?.path}
                    target="_blank"
                    className="rounded-full px-4 hover:scale-110 hover:border-0 hover:border-transparent hover:text-white hover:bg-gradient-to-r hover:from-violet-500 hover:to-fuchsia-500 transition-all"
                  >
                    Follow me
                  </Button>
                )}
              </li>
            </ul>
          </li>
        ))}
        <li className="card shadow-md">
          <figure>
            <img
              className="w-full h-88 object-cover hover:scale-110 duration-500 transition-all"
              src={`${domains.docs}/assets/images/logo/logo_dark.png`}
              alt={title}
            />
          </figure>
          <Box className="card-body">
            <h2 className="card-title">Want to Showcase？</h2>
            <p>Contact us and submit your portal with 142000+ Creators & Brands！</p>
            <Box className="card-actions justify-center mt-4">
              <Button
                variant="outlined"
                size="small"
                target="_blank"
                href="//discord.gg/wcQEMCFcjb"
                className="rounded-full px-4 hover:scale-110 hover:border-transparent hover:text-white hover:bg-gradient-to-r hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300"
              >
                Join Discord
              </Button>
            </Box>
          </Box>
        </li>
      </ul>
    </section>
  )

  return loginStatus || loginLoading ? (
    <StudioLayout>{exploreContent('px-4 sm:px-8', 'max-sm:top-16')}</StudioLayout>
  ) : (
    <OpenLayout>
      <Header logoTextClass="text-theme-primary-focus" />
      {exploreContent('px-2 sm:px-16')}
      <Footer />
    </OpenLayout>
  )
}

export default Explore
