import Image from 'next/image'
import Typewriter from 'typewriter-effect'
import config from '@/config'

const { domains } = config

const ContentCommerce = () => {
  return (
    <section className="pb-12 md:pb-24 text-center relative">
      <header className="pb-12">
        <Typewriter
          options={{
            wrapperClassName: 'text-4.5xl sm:text-5.5xl text-slate-900 font-righteous',
            cursorClassName: 'text-4.5xl sm:text-5.5xl text-transparent',
            autoStart: true,
          }}
          onInit={typewriter => {
            typewriter.typeString('Commercialize').pauseFor(3000).start()
          }}
        />
      </header>
      <ul className="mb-6 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-36 2xl:px-44 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {['Social Transaction', 'Member Subscription & NFC'].map((row, index) => (
          <li
            key={`commerce-index-${index + 1}`}
            className="flex items-center justify-center card border border-gray-100 p-8 rounded-2xl shadow cursor-pointer hover:scale-110 duration-300"
          >
            <Image
              alt=""
              width="180"
              height="180"
              src={`${domains.cdn}/home/commerce/commerce_0${index + 1}.png`}
              draggable={false}
            />
            <p className="font-righteous font-normal md:font-semibold text-xl md:text-2xl tracking-wide">{row}</p>
          </li>
        ))}
        <li
          key="commerce-index-3"
          className="flex items-center justify-center card border border-gray-100 p-8 rounded-2xl shadow cursor-pointer hover:scale-110 duration-300 col-span-full"
        >
          <Image alt="" width="180" height="180" src={`${domains.cdn}/home/commerce/commerce_03.png`} />
          <p className="font-righteous font-normal md:font-semibold text-xl md:text-2xl tracking-wide">
            <span>Creator Economy & Rewards</span>
            <br />
            <span>Onchain Protocol Services</span>
          </p>
        </li>
      </ul>
      <div className="z-[1] absolute top-24 sm:top-0 left-0  bg-[#A4A8FF] size-32 sm:size-54 opacity-50 blur-3xl"></div>
      <div className="absolute top-16 right-0 bg-[#FFE5B4] size-32 sm:size-60 opacity-48 blur-3xl z-[1]"></div>
      <div className="z-[1] absolute bottom-0 right-0 bg-[#FFA4E0] size-36 sm:size-54 opacity-50 blur-3xl"></div>
    </section>
  )
}

export default ContentCommerce
