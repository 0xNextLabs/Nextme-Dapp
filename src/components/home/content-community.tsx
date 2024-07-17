import Image from 'next/image'
import Link from 'next/link'
import classNames from 'classnames'
import Typewriter from 'typewriter-effect'
import { Button, Typography, Avatar } from '@mui/material'
import { useRouter } from 'next/router'
import config from '@/config'

const { domains } = config

const FloatContent = props => {
  const { position = 'right', title, avatarSrc, name, description } = props
  const positionClassName = {
    right: 'absolute top-1/2 left-full -translate-x-10 -translate-y-1/2',
    bottom: 'absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2',
  }

  return (
    <div className={classNames('inline-block', props.className)}>
      {title && (
        <Typography gutterBottom variant="h4" component="h4" className="py-4 text-left font-semibold text-2xl mb-0">
          {title}
        </Typography>
      )}

      <div className="relative inline-block">
        {props.children}
        <div
          className={classNames(
            'max-w-xs p-3 min-w-[217px] bg-white rounded-2xl flex justify-start items-center drop-shadow-xl',
            positionClassName[position]
          )}
        >
          <Avatar src={avatarSrc} className="mr-2 inline-block" />

          <div className="flex justify-start flex-wrap text-left items-center">
            <Typography
              gutterBottom
              variant="body1"
              component="span"
              className="w-full font-semibold text-sm m-0 whitespace-nowrap"
            >
              {name}
            </Typography>
            <Typography
              gutterBottom
              variant="body1"
              component="span"
              className="w-full font-normal text-xs m-0 whitespace-nowrap"
            >
              {description}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

const ContentCommunity = () => {
  const router = useRouter()
  return (
    <section className="my-12 py-48 lg:py-24 max-sm:mb-4 relative text-center overflow-hidden">
      <div className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10]">
        <Typewriter
          options={{
            wrapperClassName: 'text-4.5xl sm:text-5.5xl text-slate-900 font-righteous',
            cursorClassName: 'text-4.5xl sm:text-5.5xl text-transparent',
            autoStart: true,
          }}
          onInit={typewriter => {
            typewriter.typeString('Web2+3 Brand and Business').pauseFor(3000).start()
          }}
        />
        <Typography gutterBottom variant="h6" component="h6" className="text-neutral-500 text-lg py-4 max-w-3xl m-auto">
          In addition to richer and more beautiful Portfolios, feeds for traffic referrals and customer growth, Nextme
          helps brands and merchants to better distribute member base benefits and community management, collect
          payments and earn creation revenue faster and cheaper in Bio and consumer scenarios through Nextme Pay.
        </Typography>

        <Link href={`/gateway${router?.query?.from ? '?from=' + router.query.from : ''}`} passHref>
          <Button
            variant="contained"
            size="large"
            className="w-48 sm:w-60 py-2.5 shadow-sm rounded-full hover:scale-105 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 transition-all duration-500 mt-2"
          >
            Launch Dapp
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl m-auto relative">
        <Image
          alt=""
          width={1322}
          height={1308}
          className="object-cover animate-spin animate-duration-10"
          src={`${domains.cdn}/home/community/background.png`}
          draggable={false}
        />
        <FloatContent
          className={classNames(
            'absolute',
            'lg:top-[15%]',
            'lg:-left-[5%]',
            'md:top-[5%]',
            'md:left-[10%]',
            'md:scale-100',
            'md:-translate-x-1/2',
            'md:-translate-y-1/2',
            'sm:scale-75',
            'sm:top-0',
            'sm:left-0',
            'sm:-translate-x-0',
            'sm:-translate-y-0',
            'max-sm:scale-50',
            'max-sm:-translate-x-1/4',
            'max-sm:-translate-y-3/4',
            'max-sm:top-0',
            'max-sm:left-0'
          )}
          position="right"
          avatarSrc="images/home/community/avatar_1.png"
          name="Doodles"
          description="Total Volume 144.7K ETH"
        >
          <div className="w-44 h-40 text-center bg-purple-200 rounded-2xl flex justify-center items-center drop-shadow-xl">
            <Typography variant="h5" component="h5" className="font-righteous">
              NFT
            </Typography>
          </div>
        </FloatContent>

        <FloatContent
          className={classNames(
            'absolute',
            'xl:top-[15%]',
            'xl:-right-[60%]',
            'lg:top-0',
            'lg:-right-[40%]',
            'md:-top-[5%]',
            'md:-right-[20%]',
            'md:scale-100',
            'md:-translate-x-1/2',
            'md:-translate-y-1/2',
            'sm:scale-75',
            'sm:top-0',
            'sm:right-0',
            'sm:translate-x-0',
            'sm:-translate-y-1/2',
            'max-sm:scale-50',
            'max-sm:top-0',
            'max-sm:right-0',
            'max-sm:translate-x-1/4',
            'max-sm:-translate-y-[80%]'
          )}
          position="bottom"
          title="BUILDER"
          avatarSrc="images/home/community/avatar_2.png"
          name="vitalik.eth"
          description="Founder of Ethereum"
        >
          <div className="w-64 drop-shadow-xl">
            <Image
              alt=""
              width={815}
              height={868}
              src={`${domains.cdn}/home/community/BUILDER.png`}
              draggable={false}
            />
          </div>
        </FloatContent>

        <FloatContent
          className={classNames(
            'absolute',
            'xl:-bottom-[30%]',
            'xl:-left-[20%]',
            'lg:-bottom-[30%]',
            'lg:-left-[5%]',
            'md:-bottom-1/2',
            'md:left-[15%]',
            'md:scale-100',
            'md:-translate-x-1/2',
            'md:-translate-y-1/2',
            'sm:scale-75',
            'sm:bottom-0',
            'sm:left-0',
            'sm:translate-x-0',
            'sm:translate-y-[30%]',
            'max-sm:scale-50',
            'max-sm:bottom-0',
            'max-sm:left-0',
            'max-sm:-translate-x-1/4',
            'max-sm:translate-y-[70%]'
          )}
          position="bottom"
          title="DAO"
          avatarSrc="images/home/community/avatar_3.jpg"
          name="ENS DAO"
          description="10k+ Followers"
        >
          <div className="w-64 drop-shadow-xl">
            <Image alt="" width={440} height={514} src={`${domains.cdn}/home/community/DAO.png`} draggable={false} />
          </div>
        </FloatContent>

        <FloatContent
          className={classNames(
            'absolute',
            'lg:-bottom-[15%]',
            'lg:-right-[20%]',
            'md:-bottom-[20%]',
            'md:right-[5%]',
            'md:scale-100',
            'md:-translate-x-1/2',
            'md:-translate-y-1/2',
            'sm:scale-75',
            'sm:bottom-0',
            'sm:right-[20%]',
            'sm:-translate-x-0',
            'sm:-translate-y-0',
            'max-sm:scale-50',
            'max-sm:-translate-x-[40px]',
            'max-sm:translate-y-[90%]',
            'max-sm:bottom-0',
            'max-sm:right-0'
          )}
          position="right"
          title=""
          avatarSrc="images/home/community/avatar_4.png"
          name="Uniswap"
          description="Most Popular Protocal"
        >
          <div className="w-52 h-40 text-center bg-purple-200 rounded-2xl flex justify-center items-center drop-shadow-xl">
            <Typography variant="h5" component="h5" className="font-righteous">
              Token
            </Typography>
          </div>
        </FloatContent>
      </div>
    </section>
  )
}

export default ContentCommunity
