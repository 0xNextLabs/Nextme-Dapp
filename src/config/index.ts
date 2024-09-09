let title = 'Nextme',
  domains = {
    master: 'https://nextme.one',
    did: 'https://did.nextme.one',
    docs: 'https://docs.nextme.one',
    api: 'https://api.nextme.one',
    dev: 'https://dev.nextme.one',
    pre: 'https://pre.nextme.one',
    alpha: 'https://alpha.nextme.one',
    beta: 'https://beta.nextme.one',
    test1: 'https://test1.nextme.one',
    cdn: 'https://cdn.nextme.one',
    cdn_test: 'https://test-cdn.nextme.one',
  }

let mission = 'Share and Earn in Social Layer'

const config = {
  title,
  mission,
  host: 'nextme.one',
  prefix: 'nextme',
  slogans: [
    'Mass Adoption',
    'Web2',
    'Web3 Social',
    'Social3',
    'X',
    'Economy Network',
    'Share Moments',
    'Social Payments',
    'Cross with Crypto',
  ],
  themes: {
    primary: '#3772FF',
    success: '#09bf4b',
    warning: '#f37e00',
    error: '#FF494A',
    secondary: '#F000B8',
    disabled: '#E6E8EC',
    light: '#fff',
    dark: '#000',
    'green-to-blue': 'linear-gradient(270.64deg, #6596FF 2.12%, #6CCCCB 57.99%, #6EE0B8 79.67%, #70FF86 121.96%)',
    textGradientPale: 'bg-clip-text text-transparent bg-gradient-to-r from-lighty to-pale',
  },
  ens: {
    contract: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
  },
  bit: {
    inviter: 'Nextme.bit',
    channel: 'Nextme.bit',
  },
  spaceId: {
    bnb: '0xe3b1d32e43ce8d658368e2cbff95d57ef39be8a6',
  },
  pay: {
    name: `${title} Social Portal`,
  },
  images: {
    placeholder: 'https://picsum.photos/256/256/?blur=5',
    nft_placeholder: `${domains.cdn}/status/nft_placeholder.png`,
    banner: {
      light: `${domains.cdn}/static/brands/Brand_Banner_01.jpg`,
      dark: `${domains.cdn}/static/brands/Brand_Banner_02.jpg`,
      cover: `${domains.cdn}/static/brands/Brand_Banner_03.jpg`,
    },
  },
  banner: {
    swipers: [
      {
        name: 'Azuki',
        url: '/Azuki',
      },
      {
        name: 'Fons Mans',
      },
      {
        name: 'Elon Musk',
      },
      {
        name: 'Next Labs',
        url: '/nextme.eth',
      },
      {
        name: 'ENS DAO',
      },
      {
        name: 'BAYC',
        url: '/BoredApeYC',
      },
    ],
  },
  footer: {
    links: [
      {
        menu: 'Resources',
        list: [
          {
            name: 'Gallery',
            url: '/explore',
            target: '_blank',
          },
          {
            name: 'Meetups',
            url: '/meetups',
            target: '_blank',
          },
          {
            name: 'Pay',
            url: '/pay',
            target: '_blank',
          },
          {
            name: 'Docs',
            url: '//docs.nextme.one',
            target: '_blank',
          },
          {
            name: 'Brands',
            url: '//docs.nextme.one/#/Resources/design',
            target: '_blank',
          },
          {
            name: 'Guidebook',
            url: '//docs.nextme.one/#/Resources/guidebook',
            target: '_blank',
          },
        ],
      },
      {
        menu: 'Governance',
        list: [
          {
            name: 'Teams',
            url: '/nextme.eth?utm_card_code=0.9549093206705321',
            target: '_blank',
          },
          {
            name: 'Mission',
            url: '//docs.nextme.one/#/README?id=mission',
            target: '_blank',
          },
          {
            name: 'Careers',
            url: 'mailto:hr@nextme.one',
          },
          {
            name: 'Support',
            url: 'mailto:support@nextme.one',
          },
          {
            name: 'Feedback',
            url: '//docs.nextme.one/#/Community',
            target: '_blank',
          },
        ],
      },
      {
        menu: 'Legal',
        list: [
          {
            name: 'Terms of Service',
            url: '/user/terms',
            target: '_blank',
          },
          {
            name: 'Privacy Policy',
            url: '/user/privacy',
            target: '_blank',
          },
        ],
      },
    ],
    media: [
      {
        icon: 'x',
        name: 'Twitter',
        url: '//x.com/NextmeOne',
      },
      {
        icon: 'discord',
        name: 'Discord',
        url: '//discord.gg/mxTew3aerd',
      },
      {
        icon: 'instagram',
        name: 'Instagram',
        url: '//instagram.com/NextmeOne',
      },
      {
        icon: 'threads',
        name: 'Threads',
        url: '//threads.net/@NextmeOne',
      },
      {
        icon: 'youtube',
        name: 'YouTube',
        url: '//youtube.com/@NextmeOne',
      },
      {
        icon: 'linkedin',
        name: 'LinkedIn',
        url: '//linkedin.com/company/Nextme',
      },
      {
        icon: 'tiktok',
        name: 'TikTok',
        url: '//tiktok.com/@NextmeOne',
      },
      {
        icon: 'farcaster',
        name: 'Farcaster',
        url: '//warpcast.com/Nextme',
      },
      {
        icon: 'lenster',
        name: 'Lenster',
        url: '//hey.xyz/u/Nextme',
      },
      {
        icon: 'github',
        name: 'GitHub',
        url: '//github.com/0xNextLabs',
      },
      {
        icon: 'medium',
        name: 'Medium',
        url: '//medium.com/@NextmeOne',
      },
      {
        icon: 'email',
        name: 'Email',
        url: 'mailto:contact@nextme.one',
      },
    ],
  },
  organization: {
    name: 'Next Labs',
    url: 'https://docs.nextme.one',
  },
  // 测试环境合约信息
  contract: {
    network: 'goerli', // current dev network
    chainId: 5,
    address: '0x79f913B159819ddF76b6928d6eA7eD605e32E8EC',
  },
  domains,
  logo: {
    light: `${domains.cdn}/static/images/logo.png`,
    dark: `${domains.cdn}/static/images/logo_dark.png`,
    light_pro: `${domains.docs}/assets/images/logo/logo_pro.svg`,
    dark_pro: `${domains.docs}/assets/images/logo/logo_pro_dark.svg`,
  },
}

export default config
