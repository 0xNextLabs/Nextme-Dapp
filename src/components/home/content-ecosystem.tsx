import { useState } from 'react'
import Image from 'next/image'
import classNames from 'classnames'
import { Button, Rating, Box } from '@mui/material'
import Typewriter from 'typewriter-effect'
import NmIcon from '@/components/nm-icon'
import ItemChainsSwiper from './swiper-card/item-chains'

import config from '@/config'

const { domains, title } = config

const cards = [
  {
    title: 'DIDs Network',
    color: '#7D7EE8',
    image: `${domains.cdn}/home/ecosystem/card_pink.jpg`,
    label: 'Running',
    released: true,
    time: '2023.Q1',
    desc: {
      data: 'Based on the W3C DID specification, we released the innovative DIDs Network, which currently has 142,000+ users, supports 1,900+ social media and publishers aggregation, and provides Infra services such as privacy security, permanent storage, and data ownership.',
    },
    url: 'https://github.com/w3c/did-spec-registries/blob/main/methods/next.json',
  },
  {
    title: 'Bio',
    color: '#3DC47E',
    label: 'Growing',
    released: true,
    time: '2023.Q2',
    desc: {
      data: 'Provide creators and brands with rich and beautiful data visualizations (Portals such as a LandingPage, Link in Bio, etc.) Not just limited to rich media such as Videos, Photos, Music, Podcasts, Streams and more. \nAll the data you want to integrate and display for your fans.',
    },
    url: '/explore',
  },
  {
    title: 'Pay',
    color: '#4592FF',
    image: `${domains.cdn}/home/ecosystem/card_blue.jpg`,
    label: 'Developing',
    released: true,
    time: '2024.Q2',
    desc: {
      data: 'Dedicated to building payment middleware that makes socializing and living easier. Help creators and brands connect with fans and distribute community benefits.\nBuy or Sell commodities, derivatives and Send or Receive money on your favorite Social Bio.',
    },
    url: '/pay',
  },
  {
    title: 'Feeds',
    color: '#6D75E7',
    time: '2024.Q3',
    label: 'Designing',
    released: true,
    desc: {
      data: 'From Identity to Profiles (Portals) is a private domain with millions of pieces of data to open up for human-to-human connections, through interactions, content such as videos and the opportunity to receive a share of the creation revenue.\nGallery（transitional state version） => Feeds.',
    },
    url: '/studio',
  },
  {
    title: 'Open',
    color: '#FF4F52',
    image: `${domains.cdn}/home/ecosystem/card_red.jpg`,
    time: '2024.Q4',
    label: 'Paving',
    desc: {
      data: 'Infrastructure for developers and organizations like 「Sign in with Nextme」, 「Nextme Account Tree」,「Nextme Creation Widgets」and many more. Deploying an Onchain app from 0 to 1 takes only 10 minutes and you get a comprehensive account system and content feeds stream.',
    },
  },
]

const ContentEcosystem = () => {
  const [rating, setRating] = useState({
    first: 0,
    second: 0,
    third: 0,
  })

  return (
    <section className="pb-12 text-center relative">
      <Typewriter
        options={{
          wrapperClassName: 'text-4.5xl sm:text-5.5xl text-slate-900 font-righteous',
          cursorClassName: 'text-4.5xl sm:text-5.5xl text-transparent',
          autoStart: true,
        }}
        onInit={typewriter => {
          typewriter.typeString(`${title} Ecosystem`).pauseFor(3000).start()
        }}
      />
      <Box className="py-8 mx-auto text-lg text-neutral-400 max-w-6xl">
        Nextme is a cross-chain（25+ evm chains and Solana chain etc.）and cross-platform decentralized social economy
        network.
        <p>It is a public social network similar in design to Farcaster + PayPal Venmo, but encrypted.</p>
        <p>
          Everyone owns their accounts and relationships、data ownership and earnings rights, which can be shared and
          taken anywhere.
        </p>
        <p>
          Creators, brands and fans, communities can better share streams, discover interesting people, stories and
          meetups, and earn income through creation and interaction within cryptographic protocols.
        </p>
      </Box>

      <ItemChainsSwiper customClass="mt-4 mb-28" />

      <ul className="absolute -mt-14 left-0 right-0 flex flex-wrap">
        <li className="overflow-hidden pb-12">
          <Rating
            name="rating-box"
            className="gap-10 opacity-30"
            icon={<NmIcon type="icon-heart_fill" className="text-rose-500" />}
            emptyIcon={<NmIcon type="icon-heart" />}
            size="large"
            max={40}
            value={rating.first}
            onChange={(e, newValue) => setRating({ ...rating, first: newValue })}
          />
        </li>
        <li className="overflow-hidden pb-12">
          <Rating
            name="rating-box"
            className="gap-8 opacity-30"
            icon={<NmIcon type="icon-happy" className="text-green-500" />}
            emptyIcon={<NmIcon type="icon-happy" />}
            size="large"
            max={40}
            value={rating.second}
            onChange={(e, newValue) => setRating({ ...rating, second: newValue })}
          />
        </li>
        <li className="overflow-hidden">
          <Rating
            name="rating-box"
            className="gap-8 opacity-30"
            icon={<NmIcon type="icon-antelope" className="text-fuchsia-500" />}
            emptyIcon={<NmIcon type="icon-antelope" />}
            size="large"
            max={40}
            value={rating.third}
            onChange={(e, newValue) => setRating({ ...rating, third: newValue })}
          />
        </li>
      </ul>
      <ul className="flex flex-wrap justify-center gap-8 sm:gap-4 3xl:gap-8">
        {cards.map((row, index) => (
          <li
            key={`${index}`}
            className="card w-90 lg:w-76 xl:w-64 2xl:w-72 3xl:w-80 h-112 lg:h-120 2xl:h-124 3xl:h-144 shadow-sm rounded-2xl image-full overflow-hidden before:opacity-10 sm:animate__animated animate__fadeInRight transition-all"
            style={{
              animationDelay: `${index * 0.5}s`,
            }}
          >
            <figure style={{ backgroundColor: row?.color }}>
              {row?.image && <Image fill alt="" src={row?.image} objectFit="cover" />}
            </figure>
            <section className="card-body px-4 pb-6 pt-8">
              <h1 className="card-title mx-auto font-righteous">
                {title}
                <span className={classNames(row['class'])}>{row?.title}</span>
              </h1>
              <span className="text-sm -mt-1">{row?.time}</span>
              {row?.released && index !== 3 && (
                <Box className="absolute right-2.5 top-2.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex size-full rounded-full bg-gray-50 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-100"></span>
                </Box>
              )}
              <p className="whitespace-pre-wrap text-left xl:text-[0.9rem] 3xl:text-base leading-7 3xl:leading-8 pt-4">
                {row?.desc?.data}
              </p>
              <Box className="card-actions justify-center -mb-1">
                <Button
                  size="large"
                  variant="outlined"
                  className={classNames(
                    'text-white border-white w-48 sm:w-40 backdrop-blur-sm',
                    row?.released ? 'rounded-3xl hover:scale-105 transition' : 'bg-stone-100/30'
                  )}
                  href={row?.url}
                  target="_blank"
                  disabled={!row?.released}
                >
                  {row.label}
                </Button>
              </Box>
            </section>
          </li>
        ))}
      </ul>
      <footer className="absolute flex justify-center w-full -bottom-8 sm:-bottom-32 -z-1 animate__animated animate__zoomIn">
        <Image alt="" width="800" height="500" src={`${domains.cdn}/home/ecosystem/bg_blur_cover.png`} />
      </footer>
    </section>
  )
}

export default ContentEcosystem
