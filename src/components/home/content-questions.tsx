import { useState } from 'react'
import { Box } from '@mui/material'
import Typewriter from 'typewriter-effect'
import NmIcon from '@/components/nm-icon'

const ContentQuestions = () => {
  const [opens, setOpens] = useState(Array(4).fill(0))
  const qas = [
    {
      question: 'What’s a Nextme?',
      answer: [
        'Nextme is a cross-chain（25+ evm chains and Solana chain etc.）and cross-platform decentralized social economy network.',
        'It is a public social network similar in design to Farcaster + PayPal Venmo, but encrypted.',
        'Everyone owns their accounts and relationships、data ownership and earnings rights, which can be shared and taken anywhere.',
        'Creators, brands and fans, communities can better share streams, discover interesting people, stories and meetups, and earn income through creation and interaction within cryptographic protocols.',
        'Our focus is on the【 Creator Economy 】【 Social Graph & Infra 】【 Pay & Mass Adoption 】',
        `From 1.0 to 2.0 Nextme's next ecological "five pieces of chess” is dedicated to a blend of "Web3's Farcaster + PayPal Venmo”.`,
        `This is achieved by a strong focus on user's identity, data, membership and payment systems, feeds and creation revenue distribution, all divided into Nextme DIDs Network, Nextme Bio, Nextme Pay, Nextme Feeds and Nextme Open.`,
        'We are not only Web 3.0, or even Web X.0, mass adoption is the next generation of Onchain.',
      ],
    },
    {
      question: 'Does Nextme need a web3 wallet?',
      answer: [
        'Nope, a web3 wallet is not needed!',
        'Nextme can login with web3 wallet (wallets such as MetaMask or ConnectWallet, etc) or web2 OAuth (Twitter, Discord, Google, Facebook, LinkedIn) with more being opened soon.',
        'Not just limited to your web3 domains such as ens, lens or custom username that have not been claimed.',
        'We pay more attention to the needs of our users, so that everyone can experience and use our exquisite social portal Dapp, and generate their own homepage portfolio more efficiently.',
      ],
    },
    {
      question: 'How can I quickly access and use Nextme?',
      answer: [
        'web2 or web3 login => choose your favorite template => configure identity & blocks data => create and share => your brand new Nextme is set up for any of your needs, either for individuals or for your company.',
      ],
    },
    {
      question: 'What information does Nextme show to its users?',
      answer: [
        'Nextme is not just limited to social media links, but also allows users to view highlighted Twitter feeds, YouTube videos, Pictures, encrypted avatars, NFTs, PFPs, their respective galleries, resumes, job postings and more!',
        'Nextme also includes some advanced features such as minting NFT or digital members, distributing Badge Tokens to the audience system, etc. You can integrate these display or distribution scenarios into one single homepage, saving you the trouble of managing multiple tools and links, allowing fans and audiences to easily find your contacts and stay up to date with your latest news.',
        'All of this data belongs to you, giving you full control of your own privacy, stored in a secure and decentralized way.',
      ],
    },
    {
      question: 'Why is Nextme better than its competitors?',
      answer: [
        'Our login and user interface is more friendly, unique and simple for users to create their own page.',
        'We have created a decentralized identity system and database for each user, giving users a nearly unlimited supply of personalized templates to choose from.',
        'This really helps out many entrepreneurs and brands who build websites, to create sales portals, saving a lot of work and time to allow them to focus on the promotion of their social portals and the operation of  their communities.',
        'Alongside this, our promise to you is that most of our templates and basic functions are free! More importantly, we want to change the existing centralized creation economy, so that we can see who really wants to participate in social behavior and data can obtain our data revenue rights, instead of providing everything we have and handing over the profits to the platform seen within our competitors. At the same time, our model algorithm and AMM protocol will be more geared towards AI.',
        'We understand the needs of advertisers, with our platform they are able to target user groups that are suitable for their product or service, with user participation being rewarded with points or token incentives. This win-win experience is what we are creating at Nextme for the block, chain and our creators.',
      ],
    },
    {
      question: 'What are the handle username (domain) rules of Nextme?',
      answer: [
        'Nextme will launch a domain name service at a certain point in time when the mainnet goes live, paving the way and building infrastructure services for the Portal and the Relation Protocol.',
        'The following are some of the brand or celebrity logos we reserved during the public beta, which are still being updated dynamically before the mainnet contract is deployed. Illegal pre-registration is not recommended during the test to avoid related legal disputes.',
        'For more rules and whitelists, airdrops, rights and interests, etc. Please refer to our white paper document.',
        '⛩️ https://docs.nextme.one/#/Ecosystem/NameService',
      ],
    },
  ]
  const openAnswer = i => {
    let temp = [...opens]
    temp.splice(i, 1, !temp[i])
    setOpens(() => temp)
  }
  return (
    <section className="pb-12 md:pb-24 text-center">
      <div className="pb-8">
        <Typewriter
          options={{
            wrapperClassName: 'text-4.5xl sm:text-5.5xl text-slate-900 font-righteous',
            cursorClassName: 'text-4.5xl sm:text-5.5xl text-transparent',
            autoStart: true,
          }}
          onInit={typewriter => {
            typewriter.typeString('QA').pauseFor(3000).start()
          }}
        />
      </div>
      <div className="text-align mx-auto max-w-7xl rounded-2xl overflow-hidden bg-neutral-50">
        {qas.map((item, index) => (
          <details
            key={`question-title-${index}`}
            className="font-righteous rounded-3xl mx-6 sm:mx-16 my-8 bg-white cursor-pointer"
            onClick={() => openAnswer(index)}
          >
            <summary className="list-none leading-4 text-sm sm:text-2xl font-normal sm:font-medium py-3 px-1 mx-auto flex justify-between align-center tracking-wide transition">
              <span />
              <span className="self-center select-none">{item.question}</span>
              <div className="pr-2 sm:pr-8 cursor-auto">
                <NmIcon
                  type="icon-arrow_down"
                  className="text-black text-lg"
                  style={{ transform: opens[index] ? 'scaleY(-1)' : 'none' }}
                />
              </div>
            </summary>
            <div className="text-left leading-7 px-4 sm:px-16 pb-4 sm:pb-10 transition duration-1000 opacity-90">
              {item.answer.map((text, idx) => (
                <Box key={`answer-detail-${idx}`}>
                  <span>{text}</span>
                  <br />
                </Box>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

export default ContentQuestions
