/**
 * 默认模版初始化数据
 */
import { generateId } from '@/lib/utils'
import { getRandomItem, getRandomIntNum } from '@/lib/utils'
import { musicList, videoList } from './media'
import { backdropList } from './templates'

import config from '@/config'

const { domains, mission } = config

let backdropRandomNum = getRandomItem([...Array(backdropList.length + 3).keys()])

export default {
  templates: {
    style: `S00${getRandomIntNum(0, 5)}`,
    backdrop: {
      type: `B00${backdropRandomNum < 3 ? 13 : backdropRandomNum}`,
    },
  },
  blocks: [
    {
      type: 'social',
      id: `social_${generateId()}`,
      data: [
        {
          type: 'discord',
          handle: 'mxTew3aerd',
          url: '//discord.gg/mxTew3aerd',
        },
        {
          type: 'twitter',
          handle: 'NextmeOne',
          url: '//x.com/NextmeOne',
        },
        {
          type: 'instagram',
          handle: 'NextmeOne',
          url: '//instagram.com/NextmeOne',
        },
        {
          type: 'youtube',
          handle: 'NextmeOne',
          url: '//youtube.com/@NextmeOne',
        },
        {
          type: 'email',
          handle: 'contact@nextme.one',
          url: 'mailto:contact@nextme.one',
        },
      ],
    },
    {
      type: 'link',
      id: `link_${generateId()}`,
      data: {
        name: 'Gateway to Web3',
        url: 'https://nextme.one',
        image: {
          url: 'https://docs.nextme.one/assets/images/logo/logo.png',
        },
      },
    },
    {
      type: 'text',
      id: `text_${generateId()}`,
      title: '🧚‍♀️ 🧚‍♂️',
      data: {
        name: `Welcome to my Web3 Space.
Maybe it's some kind of fate, but it's really lucky for me to meet you！
Where I will serialize every story and work, record everything I think, see, think... as much as possible, and let this social portal NFT exist forever , not limited to whether our company is in New York or Paris, or even a decentralized server in the ends of the earth.`,
      },
    },
    {
      id: `card_${generateId()}`,
      type: 'card',
      title: 'Hey, enjoy your music 👋',
      data: {
        url: getRandomItem(musicList),
      },
    },
    {
      id: `card_${generateId()}`,
      type: 'card',
      title: 'Meeting with Nextme ⏰',
      data: {
        url: 'https://calendly.com/nextme',
      },
    },
    {
      id: `card_${generateId()}`,
      type: 'card',
      title: 'Enjoy your video',
      data: {
        url: getRandomItem(videoList),
      },
    },
    {
      id: `card_${generateId()}`,
      type: 'card',
      title: 'More Creative Works',
      data: {
        url: 'https://nextme.one/explore',
        image: {
          url: 'https://cdn.nextme.one/user/37327eb3-b8b8-48d6-91a7-68fd85e1bd25/1683964186488.png',
        },
      },
    },

    {
      type: 'card',
      id: `card_${generateId()}`,
      title: 'Nextme Tokenomics',
      data: {
        url: 'https://twitter.com/NextmeOne/status/1762179660828578117',
      },
    },
    {
      id: `card_${generateId()}`,
      type: 'card',
      title: 'Nextme V2 Beta Showcase',
      data: {
        url: 'https://twitter.com/NextmeOne/status/1749486716191433191',
      },
    },
    {
      id: `career_resume_${generateId()}`,
      type: 'career_resume',
      title: 'Resume',
      data: [
        {
          name: 'Core Developer',
          description: 'Swap, earn, and build on the leading decentralized crypto trading protocol.',
          company: 'Uniswap Labs',
          location: 'Remote',
          employ: 'Start-up',
          url: 'https://uniswap.org',
          image: {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/1200px-Uniswap_Logo.svg.png?20210117065440',
          },
        },
        {
          name: 'Full-stack Engineer',
          description:
            'The world’s first and largest digital marketplace for crypto collectibles and non-fungible tokens (NFTs). Buy, sell, and discover exclusive digital items.',
          company: 'OpenSea',
          location: 'United States',
          employ: 'Full-Time',
          url: 'https://opensea.io',
          image: {
            url: 'https://cdn.nextme.one/user/d1411472-67ca-4353-99d3-f308604bcc67/1692323900841.png',
          },
        },
      ],
    },
    {
      id: `group_${generateId()}`,
      type: 'group',
      title: 'Group Teams',
      data: [
        {
          name: 'Paul',
          description: 'Creator & CTO',
          url: 'https://nextme.one/PaulNext',
          image: {
            url: 'https://cdn.nextme.one/user/37327eb3-b8b8-48d6-91a7-68fd85e1bd25/1678070663106.png',
          },
        },
        {
          name: 'Holy',
          description: 'Business Marketing',
          image: {
            url: 'https://cdn.nextme.one/user/37327eb3-b8b8-48d6-91a7-68fd85e1bd25/1678070821935.png',
          },
        },
        {
          name: 'Jessie',
          image: {
            url: 'https://cdn.nextme.one/user/37327eb3-b8b8-48d6-91a7-68fd85e1bd25/1682156688603.png',
          },
          description: 'Product Growth',
        },
      ],
    },
    {
      id: `career_job_${generateId()}`,
      type: 'career_job',
      title: 'Jobs Opening｜We are hiring！',
      data: [
        {
          name: 'Full-Stack Engineer',
          description:
            'Proficient in Node.js, Next.js, MongoDB, GraphQL and other technology stacks;\nHave some practical experience in IPFS, Arweave, etc;',
          location: 'Remote',
          employ: 'Full-time',
          url: 'https://nextme.one',
          image: {
            url: 'https://cdn.nextme.one/avatars/6.jpg',
          },
        },
        {
          name: 'Core User Operation',
          description:
            'Participate in product early cold start and user pool grouping, tagging, Contributor and user Wiki white paper polishing, etc;',
          location: 'Remote',
          employ: 'Start-up',
          url: 'https://nextme.one',
          image: {
            url: 'https://cdn.nextme.one/avatars/12.jpg',
          },
        },
      ],
    },
    {
      type: 'group',
      id: `group_${generateId()}`,
      title: 'Partners & Services',
      data: [
        {
          url: 'https://nextme.one/nextme.eth',
          image: {
            url: `${domains.cdn}/static/images/logo_dark.png`,
          },
          name: 'Nextme',
          description: mission,
        },
        {
          url: 'https://ens.domains',
          name: 'ENS',
          image: {
            url: 'https://test-cdn.nextme.one/user/37327eb3-b8b8-48d6-91a7-68fd85e1bd25/1671220399679.png',
          },
          description: 'Decentralised naming for wallets, websites, & more.',
        },
        {
          url: 'https://lens.xyz',
          name: 'Lens Protocol',
          image: {
            url: 'https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/6d21d1544a4c303a3a407b9756071386955b76a3b091fded5731ca049604994a.png',
          },
          description: 'The Social Layer for Web3.',
        },
        {
          url: 'https://ethereum.org',
          name: 'Ethereum',
          image: {
            url: 'https://test-cdn.nextme.one/user/37327eb3-b8b8-48d6-91a7-68fd85e1bd25/1671220756169.png',
          },
          description:
            'Open source platform to write and distribute decentralized applications.  Official account of the Ethereum Foundation',
        },
        {
          url: 'https://polygon.technology',
          name: 'Polygon',
          description:
            "A global & sustainable Web3 infrastructure built on Ethereum. #Polygon is carbon neutral, going carbon-negative in '22 #PolygonIsGreen",
          image: {
            url: 'https://test-cdn.nextme.one/user/37327eb3-b8b8-48d6-91a7-68fd85e1bd25/1671220809839.png',
          },
        },
        {
          url: 'https://x.com/BNBCHAIN',
          name: 'BNB Chain',
          image: {
            url: 'https://pbs.twimg.com/profile_images/1565354861616832513/ovh5FyDN_400x400.png',
          },
          description: "Build your dream Web3 career with BNB Chain's Zero2Hero Builder Series! ⚡",
        },
        {
          url: 'https://x.com/okxweb3',
          name: 'OKX',
          image: {
            url: 'https://play-lh.googleusercontent.com/TjM3iJJHQBi8yvElMbbP3AJieBK0jAjGKO5oQKUVg09qYPZiADjtjQEBAhMCIB09Ky0=s96-rw',
          },
          description: 'OKX Web3 (NFT & Wallet & DeFi)',
        },
        {
          url: 'https://x.com/gitcoin',
          description: "The world's leading web3 projects are born, validated, & funded ✨🌍  Let's buidl together 🫡",
          name: 'Gitcoin',
          image: {
            url: 'https://cdn.nextme.one/user/37327eb3-b8b8-48d6-91a7-68fd85e1bd25/1689324427781.png',
          },
        },
        {
          url: 'https://rainbowkit.com',
          name: 'Rainbow',
          description: 'The best way to connect a wallet',
          image: {
            url: 'https://test-cdn.nextme.one/user/37327eb3-b8b8-48d6-91a7-68fd85e1bd25/1671221893226.png',
          },
        },
        {
          url: 'https://nextme.one/TokenPocket',
          name: 'TokenPocket',
          image: {
            url: 'https://pbs.twimg.com/profile_images/1608789068665716745/hLgE3Yba_400x400.jpg',
          },
          description: 'The world’s leading multi-chain self-custodial wallet.',
        },
        {
          url: 'https://arweave.org',
          name: 'Arweave',
          image: {
            url: 'https://test-cdn.nextme.one/user/37327eb3-b8b8-48d6-91a7-68fd85e1bd25/1671221188961.png',
          },
          description: 'Store data, permanently.',
        },
        {
          url: 'https://vercel.com',
          name: 'Vercel',
          description: 'Enabling developers to create at the moment of inspiration.',
          image: {
            url: 'https://test-cdn.nextme.one/user/37327eb3-b8b8-48d6-91a7-68fd85e1bd25/1671221563211.png',
          },
        },
        {
          url: 'https://alchemy.com',
          name: 'Alchemy',
          description: 'The web3 dev platform powering millions of users. Build scalable dApps, faster.',
          image: {
            url: 'https://test-cdn.nextme.one/user/37327eb3-b8b8-48d6-91a7-68fd85e1bd25/1671221638341.png',
          },
        },
        {
          url: 'https://infura.io',
          description:
            'The first toolkit for 400K+ blockchain developers. Dynamically scale your dapp and accelerate innovation with Ethereum and Web3 APIs. Get help 📩 support@infura.io',
          name: 'Infura',
          image: {
            url: 'https://test-cdn.nextme.one/user/37327eb3-b8b8-48d6-91a7-68fd85e1bd25/1671221723383.png',
          },
        },
        {
          url: 'https://twitter.com/DFINITY',
          image: {
            url: 'https://cryptologos.cc/logos/internet-computer-icp-logo.png?v=029',
          },
          name: 'ICP',
          description: 'The DFINITY Foundation is a major contributor to the Internet Computer blockchain.',
        },
        {
          url: 'https://aws.amazon.com',
          name: 'AWS',
          description: 'Amazon Web Services',
          image: {
            url: 'https://test-cdn.nextme.one/user/37327eb3-b8b8-48d6-91a7-68fd85e1bd25/1671221037111.png',
          },
        },
      ],
    },
    {
      id: `card_${generateId()}`,
      type: 'card',
      title: 'See you Later 👋',
      data: {
        url: 'https://open.spotify.com/playlist/2ywAObQUPhdxXbnPp7ADXz?si=0be6222afa504bcf',
      },
    },
    {
      type: 'link',
      id: `link_${generateId()}`,
      data: {
        emoji: '🤔',
        url: 'https://nextme.one',
      },
    },
  ],
}
