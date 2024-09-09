import { useMemo } from 'react'
import { createNFTSvc } from '@/services/web3'
import { Contract, ContractInterface, providers } from 'ethers'
import * as Signer from '@ucanto/principal/ed25519'
import * as Client from '@web3-storage/w3up-client'
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory'
import { CarReader } from '@ipld/car'
import * as Delegation from '@ucanto/core/delegation'
import { useAccount } from 'wagmi'
import { Blob } from 'nft.storage'
import { s3UploadSvc } from '@/services/s3'
import { _supportChains } from '@/lib/chains'
import { base64ToBlob } from '@/lib/utils'
import { env } from '@/lib/types/env'

import config from '@/config'

const { pay } = config

let mainnet = env?.isProd

async function parseProof(data) {
  const blocks = []
  const reader = await CarReader.fromBytes(Buffer.from(data, 'base64'))
  for await (const block of reader.blocks()) {
    blocks.push(block)
  }
  return Delegation.importDAG(blocks)
}

/**
 *@param {username} string 卡片所需要的用户名
 *@param {avatar} string 用户头像地址
 *@param {intro} string 用户个人介绍
 *
 **/
export const getPayMetaData = async (
  username: string,
  nickname: string,
  avatar: string,
  intro: string,
  uuid: string,
  host: string,
  type = 'custom',
  image: string,
  imgStyleObj?: any,
  imgWidth?: number,
  imgHeight?: number
) => {
  let imgStyle = ''
  if (type == 'custom') {
    let clientWidth = 105,
      clientHeight = 105
    const { width, height, x, y } = imgStyleObj
    let _scale = 1
    if (height == width) {
      _scale = clientWidth / imgWidth
    } else {
      _scale =
        clientHeight / (imgHeight * Number(height)) > clientWidth / (imgWidth * Number(width))
          ? clientHeight / (imgHeight * Number(height))
          : clientWidth / (imgWidth * Number(width))
    }
    const _transX = -imgWidth * _scale * Number(x)
    const _transY = -imgHeight * _scale * Number(y)
    imgStyle = `transform: translate(${_transX}px,${_transY}px) scale(${_scale});
                  transform-origin: 0px 0px;`
  }
  const data = await createNFTSvc({ username, nickname, avatar, intro, uuid, host, type, image, imgStyle })
  const fileValue = data.message.animation_url
  const fileType = 'text/html'
  const filename = `Nextme_Social_${username}.html`
  const htmlBlob = new Blob([fileValue], { type: 'text/html' })
  const htmlFile = new File([htmlBlob], filename, { type: fileType })
  const animation_url = await s3UploadSvc(htmlFile, uuid)
  const base64 = image.split(',')[1]
  const fileBlob = await base64ToBlob({ b64data: base64, contentType: 'image/png' })
  const fileName = `${new Date().getTime()}${username}`
  const iamgeFile = new File([fileBlob], fileName, { type: 'image/png' })

  // Load client with specific private key
  const principal = Signer.parse(env.principalKey)
  const store = new StoreMemory()
  const client = await Client.create({ principal, store })
  // Add proof that this agent has been delegated capabilities on the space
  const proof = await parseProof(env.parseProof)
  const space = await client.addSpace(proof)
  await client.setCurrentSpace(space.did())
  const directoryCid = await client.uploadDirectory([iamgeFile])
  let url = `https://${directoryCid.toString()}.ipfs.w3s.link/${fileName}`

  const file = {
    name: `@${username}`,
    description: `${username}'s  ${pay.name}`,
    image: url,
    animation_url,
    attributes: [
      {
        value: uuid,
        trait_type: 'uuid',
      },
      {
        value: username.length,
        trait_type: 'length',
      },
      {
        value: username,
        trait_type: 'username',
      },
    ],
    contractMetadata: {
      name: pay.name,
      symbol: pay.name,
      tokenType: 'ERC721',
    },
  }
  const blob2 = new Blob([JSON.stringify(file)], { type: 'application/json' })
  let render2 = new FileReader()
  render2.readAsDataURL(blob2)
  return new Promise(res1 => {
    render2.onload = () => {
      res1(render2.result)
    }
  })
}

export const createDynamicContract = (ABI: ContractInterface) => {
  return (addressMap, asSigner = false) => {
    const { chainId, address } = useAccount()
    try {
      const provider = new providers.Web3Provider((window as any)?.ethereum as any)
      const signer = provider.getSigner(address)

      return useMemo(() => {
        const address = addressMap[chainId as keyof typeof addressMap]

        if (!address) return null

        const providerOrSigner = asSigner && signer ? signer : provider

        return new Contract(address, ABI, providerOrSigner)
      }, [addressMap, chainId, asSigner, signer, provider])
    } catch (error) {
      return
    }
  }
}

export const getSolanaRPCUrl = ({ type = 'https' } = {}) => {
  switch (type) {
    case 'wss':
      return mainnet
        ? `wss://solana-mainnet.g.alchemy.com/v2/${env?.alchemyId}`
        : `wss://solana-devnet.g.alchemy.com/v2/${env?.alchemyId}`

      break
    case 'https':
    default:
      return mainnet
        ? `https://solana-mainnet.g.alchemy.com/v2/${env?.alchemyId}`
        : `https://solana-devnet.g.alchemy.com/v2/${env?.alchemyId}`
      break
  }
}

export const getActiveChain = ({ name = null, chainId = null }) => {
  if (!name && !chainId) return
  return {
    icon:
      _supportChains.find(row => (name && name == row?.name) || (chainId && chainId == row?.chain?.id))?.icon ||
      `https://icons.llamao.fi/icons/chains/rsz_${((name && name?.split(' ')[0]) || (chainId && _supportChains.find(row => chainId == row?.chain?.id)?.name))?.toLowerCase()}?w=100&h=100`,
  }
}
