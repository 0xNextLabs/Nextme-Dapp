import { useState } from 'react'
import Image from 'next/image'
import Typewriter from 'typewriter-effect'
import classNames from 'classnames'
import { Typography, Box } from '@mui/material'
import { ContainerScroll } from '@/components/aceternity-ui/container-scroll-animation'

import config from '@/config'

const { title, domains } = config

const ContentGateway = () => {
  return (
    <section className="pb-12 max-sm:pt-4 sm:max-xl:pt-12 flex flex-col overflow-hidden">
      <ContainerScroll
        headerClass="-mb-48 sm:-mb-32"
        titleComponent={
          <Box className="py-32 text-center">
            <Typewriter
              options={{
                wrapperClassName: 'text-5xl sm:text-6xl text-slate-900 font-righteous',
                cursorClassName: 'text-5xl sm:text-6xl text-transparent',
                autoStart: true,
              }}
              onInit={typewriter => {
                typewriter.typeString(`Hi. Why ${title}`).start()
              }}
            />
            <Typography
              variant="h4"
              component="h4"
              className="py-6 text-2xl sm:text-2.5xl font-righteous text-transparent bg-clip-text bg-theconvo-gradient-001 bg-cover transition-all duration-700"
            >
              For Mass Adoption of Social Lifestyle and Payments to Enable the "Last Mile" of Onchain.
            </Typography>
          </Box>
        }
      >
        <Image
          src={`${domains.cdn}/home/gateway/social_payments_01.png`}
          alt=""
          width="1096"
          height="720"
          className={classNames('object-cover mx-auto')}
          draggable={false}
        />
      </ContainerScroll>
    </section>
  )
}

export default ContentGateway
