import Typewriter from 'typewriter-effect'
import Image from 'next/image'
import { Box } from '@mui/material'

import config from '@/config'

const { domains } = config

const ContentPartners = () => {
  const parterBoxes = Array(30)
    .fill(0)
    .map((_, idx) => (
      <Box
        className="sm:px-4 sm:py-2 flex items-center justify-center rounded-xl md:rounded-2xl bg-white shadow-sm cursor-pointer hover:scale-110 hover:shadow transition ease-in-out delay-100 duration-200"
        key={`partner-${idx}`}
      >
        <Image
          alt=""
          src={`${domains.cdn}/home/partners/${idx + 1}.png`}
          width="240"
          height="100"
          className="w-full"
          draggable={false}
        />
      </Box>
    ))
  return (
    <section className="pb-12 md:pb-24 text-center">
      <Box className="pb-8">
        <Typewriter
          options={{
            wrapperClassName: 'text-4.5xl sm:text-5.5xl text-slate-900 font-righteous',
            cursorClassName: 'text-4.5xl sm:text-5.5xl text-transparent',
            autoStart: true,
          }}
          onInit={typewriter => {
            typewriter.typeString('Partners and Services').pauseFor(3000).start()
          }}
        />
      </Box>
      <Box className="px-4 py-6 sm:px-16 sm:py-8 rounded-2xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-10 bg-neutral-50">
        {parterBoxes}
      </Box>
    </section>
  )
}

export default ContentPartners
