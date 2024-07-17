import { NmModalFuncProps } from '@/components/nm-modal/ModalContext'

//cropper接受的数据
export interface ICropperProps extends NmModalFuncProps {
  imageUrl: string
  onOk: Function
  aspectRatio?: number | undefined
  className?: string
  isCircle?: boolean
  open?: boolean
}
//crop img的定位数据
export interface ICropImg {
  x: string | number
  y: string | number
  url?: string
  width?: number
  height?: number
  imgStyle?: any
}
//crop img
export declare type ICropImgProps = Omit<
  JSX.IntrinsicElements['img'],
  'src' | 'srcSet' | 'ref' | 'width' | 'height' | 'loading'
> & {
  src?: string
  imgStyle?: ICropImg
  customClass?: string
  imgClassName?: string
  type?: 'default' | 'oauth' | 'custom' | 'nft'
  errorImage?: ''
}
export interface IPreviewImgState {
  uploadImg: ICropImg
  avatarImg: ICropImg | Record<'url', string>
  coverImg: ICropImg
}

export const initImgStyle: ICropImg = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  url: null,
}
