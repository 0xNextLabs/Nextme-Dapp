import { Avatar, Button, Typography, List, ListItem, ListItemText } from '@mui/material'
import Image from 'next/image'
import Typewriter from 'typewriter-effect'
import NmIcon from '@/components/nm-icon'

import config from '@/config'

const { domains } = config

const ContentOrganization = () => {
  const textList = [
    {
      type: 'analysis',
      text: 'Sign in with Nextme',
    },
    {
      type: 'relation',
      text: 'Nextme Account Tree',
    },
    {
      type: 'group',
      text: 'Nextme Pinterest Feeds',
    },
    {
      type: 'award',
      text: 'Nextme Creation Widgets',
    },
  ]

  return (
    <section className="py-12 relative flex justify-around items-center max-lg:flex-wrap">
      <div className="max-sm:w-full w-[35rem]">
        <Typewriter
          options={{
            wrapperClassName: 'text-4.5xl sm:text-5.5xl text-slate-900 font-righteous',
            cursorClassName: 'text-4.5xl sm:text-5.5xl text-transparent',
            autoStart: true,
          }}
          onInit={typewriter => {
            typewriter
              .pauseFor(100)
              .typeString('Web3 ')
              .pauseFor(3000)
              .typeString('Developer and Organization')
              .pauseFor(3000)
              .start()
          }}
        />
        <Typography
          gutterBottom
          variant="h6"
          component="h6"
          className="text-neutral-500 text-lg py-4 max-w-4xl break-words whitespace-pre-wrap"
        >
          We believe that the next generation of the Internet should belong to the users and be more user-friendly and
          shareable in order to have a chance of mass adoption. Nextme Open is providing developers and organizations
          with infrastructure such as "Sign in with Nextme", "Nextme Account Tree", "Nextme Pinterest Feeds", "Nextme
          Creation Widgets" and more. It only takes 10 minutes to deploy an Onchain app from 0 to 1, and you can get a
          comprehensive account system and content feeds stream. Nextme's social protocol originates from Layer3, and
          with the connection of DIDs, Bio, Pay, Feeds and other modules, this open and interconnected economic network
          is taking shape, with hundreds of millions of desensitized data and widgets. And these are closely related to
          Nexts assets, so we don't want it to be an "open platform", but prefer to call it an "open network".
        </Typography>

        <List className="w-full mb-4">
          {textList.map((item, index) => (
            <ListItem key={`dev-org-${index}`} divider={index !== textList.length - 1} className="px-0 py-4">
              <Avatar variant="circular" className="bg-theme-primary">
                <NmIcon type={`icon-${item.type}`} className="text-white" />
              </Avatar>
              <ListItemText
                className="m-0"
                secondary={
                  <Typography gutterBottom variant="h6" component="h6" className="text-zinc-800 text-lg ml-4 mb-0">
                    {item.text}
                  </Typography>
                }
              />
            </ListItem>
          ))}
          <ListItem className="px-0 pt-6 max-sm:justify-center">
            <Button
              variant="contained"
              size="large"
              className="w-48 sm:w-60 py-2.5 shadow-sm rounded-full hover:scale-105 hover:bg-gradient-to-r hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-500"
              href={domains.docs}
              target="_blank"
            >
              Read More
            </Button>
          </ListItem>
        </List>
      </div>
      <div className="flex-initial">
        <Image
          alt=""
          width={676}
          height={675}
          className="object-cover"
          src={`${domains.cdn}/home/organization/earth.png`}
          draggable={false}
        />
      </div>
    </section>
  )
}

export default ContentOrganization
