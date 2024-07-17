import Image from 'next/image'
import classNames from 'classnames'
import { Avatar, Box, Button } from '@mui/material'
import GatewayLayout from '@/components/layout/gateway'
import NmIcon from '@/components/nm-icon'

import config from '@/config'

const { domains, logo } = config

let deckList = [
  {
    chat: true,
    name: 'Pro',
    chatClass: 'chat-start animate__fadeInRight',
    desc: 'Includes details such as financing and commercial',
  },
  {
    name: 'Pro_Chinese',
    pro: true,
    icon: 'chinese',
    href: 'https://docsend.com/view/nregqcqqdbp7kmt9',
  },
  {
    chat: true,
    name: 'Standard',
    class: 'mt-16',
    icon: 'english',
    chatClass: 'chat-end animate__fadeInLeft',
    desc: 'Includes product and ecosystem descriptions only',
  },
  {
    name: 'Standard_Chinese',
    icon: 'chinese',
    href: 'https://docsend.com/view/qnck8pv9ip4pazbu',
  },
]

export default function Deck() {
  return (
    <GatewayLayout>
      <>
        <header className="pt-32 md:pt-16">
          <Box className="text-center">
            <h1 className="font-righteous pb-4 text-3xl lg:text-4xl">Nextme Deck</h1>
            <p className=" text-black/50 pb-4">So happy to have met you.</p>
            <ul className="flex justify-center gap-5 pt-12 pb-6">
              {['brown', 'green', 'blue', 'purple', 'red'].map((row, index) => (
                <li
                  key={`${index}-${row}`}
                  className="animate__animated animate__slideInDown cursor-pointer"
                  style={{
                    animationDelay: `${index * 0.5}s`,
                  }}
                >
                  <Image
                    alt=""
                    src={`${domains.cdn}/home/ecosystem/${row}.svg`}
                    width="48"
                    height="48"
                    className="hover:scale-110 transition"
                  />
                </li>
              ))}
            </ul>
          </Box>
        </header>
        <section>
          <ul>
            {deckList.map((row, index) => (
              <li key={`${index}-${row.name}`} className={classNames('flex justify-center my-6', row?.class)}>
                {row?.chat ? (
                  <p className={classNames('chat pt-2 pb-6 animate__animated', row?.chatClass)}>
                    <div className="chat-image avatar">
                      <Avatar src={logo.dark} />
                    </div>
                    <div className="chat-bubble">{row?.name}</div>
                    <div className="chat-footer max-sm:text-xs opacity-50">{row?.desc}</div>
                  </p>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    className={classNames(
                      'w-72 lg:w-80 h-12 rounded-3xl flex shadow-sm text-white transition-all bg-gradient-to-r',
                      row?.pro ? ' from-violet-500 to-fuchsia-500' : 'bg-black hover:from-violet-700 hover:to-blue-500'
                    )}
                    href={row?.href}
                    target="_blank"
                  >
                    <NmIcon
                      type={`icon-${row?.icon}`}
                      className="basis-1/4 text-2xl pr-12 flex items-center justify-center"
                    />
                    {row.name}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </section>
        <footer className="text-center py-16">
          <p className="mb-4 text-black/50">Already have a Nextme account？</p>
          <Box className="flex justify-center">
            <Button
              className="w-72 lg:w-80 h-12 rounded-3xl shadow-sm transition-all"
              href="/"
              type="primary"
              variant="contained"
            >
              Get Started
            </Button>
          </Box>
        </footer>
      </>
    </GatewayLayout>
  )
}
