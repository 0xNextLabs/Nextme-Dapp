// profile name 最大长度
export const PROFILE_NAME_SIZE = 256

// profile 简介 最大长度
export const DESCRIPTION_SIZE = 1024
export interface IImageInfo {
  type: 'image' | 'NFT' | null
  url: string
}

export interface IProfileInfo {
  name: string
  description: string
  avatar: IImageInfo
  cover: IImageInfo
}

export interface ILabel {
  id: string
  name: string
  icon: string
}
