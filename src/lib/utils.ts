import isEqual from 'lodash.isequal'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'wagmi/chains'
import { normalize } from 'viem/ens'
import randomcolor from 'randomcolor'
import { Dictionary } from './types'
import { nftAvailableChains, chainIdToNetWork } from './chains'
import { PointRules, PointList } from './types/points'
import { env } from './types/env'

import { labelColor } from '@/config/bio/label'
import config from '@/config'

const { host, domains } = config

export function getTransformNumber(value, type = 'string') {
  const newVal = value < 10 ? `0${value}` : value
  return !type || type === 'string' ? String(newVal) : Number(newVal)
}

export function getCurrentDate(time = null, insert = '') {
  const date = time ? new Date(time) : new Date()
  const year = date.getFullYear()
  const month = getTransformNumber(date.getMonth() + 1)
  const day = getTransformNumber(date.getDate())
  const week = ['末', '一', '二', '三', '四', '五', '六'][date.getDay()]
  return insert ? [year, month, day, week].join(insert) : [year, month, day, week]
}

/**
 * 全局唯一标识符（uuid，Globally Unique Identifier）,也称作 uuid(Universally Unique IDentifier)
 * 一般用于多个组件之间,给它一个唯一的标识符,或者v-for循环的时候,如果使用数组的index可能会导致更新列表出现问题
 * 最可能的情况是左滑删除item或者对某条信息流"不喜欢"并去掉它的时候,会导致组件内的数据可能出现错乱
 * v-for的时候,推荐使用后端返回的id而不是循环的index
 * @param {Number} len uuid的长度
 * @param {Boolean} firstU 将返回的首字母置为"u"
 * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
 */
export function getUid(len = 32, firstU = true, radix = null) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid = []
  radix = radix || chars.length

  if (len) {
    // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
    for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    let r
    // rfc4122标准要求返回的uuid中,某些位为固定的字符
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
  if (firstU) {
    uuid.shift()
    return `u${uuid.join('')}`
  }
  return uuid.join('')
}

/**
 * @date  2022-09-18
 * @desc  随机命中给定数组的一条作为结果返回
 * @param {Array} 给定数组
 * @author paul@nextme.one
 */
export function getRandomItem(arr = []) {
  const idx = Math.floor(Math.random() * arr.length)
  return arr[idx]
}
/**
 * @param {minNum} number 随机数最小值
 * @param {maxNum} number 随机数最大值
 */
export const getRandomIntNum = (minNum: number, maxNum: number) => {
  let randomNum = Math.floor(Math.random() * (maxNum - minNum) + minNum)
  return randomNum
}
export function getAdditiveNum(start = 0, arr = []) {
  let min = 0,
    max = arr.length
  return start + 1 < max ? start + 1 : min
}
/**
 * https://nextjs.org/docs/api-reference/next/image#blurdataurl
 * @param str
 * @returns
 */
export const getBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str)

/**
 * https://github.com/vercel/next.js/blob/canary/examples/image-component/pages/shimmer.tsx
 * @param w
 * @param h
 * @returns
 * @author paul@nextme.one
 */
export const getShimmer = (w: number, h: number) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#e5e7eb" offset="20%" />
        <stop stop-color="#d1d5db" offset="50%" />
        <stop stop-color="#e5e7eb" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#d1d5db" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`
/**
 * https://nextjs.org/docs/api-reference/next/image#placeholder
 * @param w
 * @param h
 * @returns
 * @author paul@nextme.one
 */
export const getBlurDataURL = (w, h) =>
  `data:image/svg+xml;base64,${getBase64(getShimmer(w || window?.screen?.width, h || window?.screen?.height))}`

/**
 * 根据code获取style/theme/backdrop等的index(默认规则为s001/t001/b001)
 * @param code
 */
export const getTemplateIndex = (code: string) => Number(code?.slice(1))

/**
 * 获取主题的对比色数组
 * @param colorArr 主题色数组的某个数组
 * @param currentIndex 数组中的第几个
 * @returns 返回一个数组 第一个元素为背景颜色,第二个元素为字体颜色
 */
export const getComparedColorList = ({
  initBgColor,
  initTextColor,
  colorArr,
  currentIndex,
}: {
  initBgColor: string
  initTextColor: string
  colorArr: string[]
  currentIndex: number
}) => {
  let colorList = [initBgColor, initTextColor]
  if (!currentIndex && currentIndex !== 0) return colorList
  let comparedIndex = 0
  if (colorArr.length === 2) {
    comparedIndex = currentIndex === 0 ? 1 : 0
  } else {
    comparedIndex = currentIndex + 2 <= colorArr.length - 1 ? currentIndex + 2 : 0
  }
  colorList = [colorArr[currentIndex], colorArr[comparedIndex]]
  return colorList
}

export const getRandomColor = ({ colorList, index, type }: { colorList: string[]; index: number; type?: string }) => {
  if (colorList.length === 2) {
    if (type === 'linkBg') {
      return index === 3 ? colorList[0] : 'transparent'
    } else if (type === 'linkColor') {
      return index === 4 ? colorList[1] : colorList[0]
    } else {
      // 黑白色卡的上半部分信息只返回白色
      return colorList[0]
    }
  } else if (index <= colorList.length - 1) {
    return colorList[index]
  } else {
    return colorList[index - colorList.length]
  }
}

/**
 *
 * @param data 原数组
 * @param count 每页展示个数
 * @returns
 */
export const getSwiperSplitData = ({ data, count }) => {
  const resData = []
  for (let i = 0; i < data?.length; i += count) {
    resData.push(data?.slice(i, i + count))
  }
  return resData
}

export const blobToBase64 = async (blob: any) => {
  let render = new FileReader()
  await render.readAsDataURL(blob)
  return new Promise((res, rej) => {
    render.onload = e => {
      res(render.result)
    }
  })
}
/**
 * @date 2022-07-13
 * @desc deeply copy object or arrays with nested attributes
 * @param  {any} obj
 * @return {any} a depply copied replica of arguement passed
 * @author  paul@nextme.one
 */
export function deepClone(obj) {
  return structuredClone(obj)
  // if (!obj || typeof obj !== 'object') {
  //   return obj
  // }
  // // 根据obj的类型判断是新建一个数组还是对象
  // const newObj = obj instanceof Array ? [] : {}
  // for (let key in obj) {
  //   if (obj.hasOwnProperty(key)) {
  //     newObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
  //   }
  // }
  // return newObj
}
export function base64ToBlob({ b64data = '', contentType = '', sliceSize = 512 } = {}): Promise<BlobPart> {
  return new Promise((resolve, reject) => {
    // 使用 atob() 方法将数据解码
    let byteCharacters = atob(b64data)
    let byteArrays = []
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize)
      let byteNumbers = []
      for (let i = 0; i < slice.length; i++) {
        byteNumbers.push(slice.charCodeAt(i))
      }
      // 8 位无符号整数值的类型化数组。内容将初始化为 0。
      // 如果无法分配请求数目的字节，则将引发异常。
      byteArrays.push(new Uint8Array(byteNumbers))
    }
    let result: BlobPart = new Blob(byteArrays, {
      type: contentType,
    })
    result = Object.assign(result, {
      // 这里一定要处理一下 URL.createObjectURL
      preview: URL.createObjectURL(result),
      name: `title.png`,
    })
    resolve(result)
  })
}
export const getTransPerce = (size: number, transNum: number, contentSize: number): number => {
  let heightPerce = 0
  if (size == contentSize) {
    return 0
  }
  heightPerce = transNum / ((size - contentSize) / 2)
  return heightPerce
}
export const getCropSize = (aspectRatio: number) => {
  if (aspectRatio == 1) {
    return {
      width: 400,
      height: 400,
    }
  } else if (aspectRatio < 1) {
    return {
      width: 240,
      height: 240 / aspectRatio,
    }
  } else {
    return {
      width: 450,
      height: 450 / aspectRatio,
    }
  }
}

export const saveFile = (props: { data: string; filename?: string; type?: string }) => {
  const { data, filename = 'Nextme_DID_Private_Key', type = 'application/json' } = props
  const file = new Blob([JSON.stringify({ key: data })], { type })
  const link = document.createElement('a')
  const url = URL.createObjectURL(file)
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }, 0)
}

/**
 * @date 2022-10-20
 * @desc 防抖函数
 * @param {Function} callBack
 * @return {Function} fn
 * @author  paul@nextme.one
 */
export function debounce(fn, delay = 500) {
  // 定时器，用来 setTimeout
  let timer
  return function (...args) {
    // 保存函数调用时的上下文和参数，传递给 fn
    const context = this
    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    clearTimeout(timer)
    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}
/**
 *
 * @param list array
 * @param startIndex prev
 * @param endIndex next
 * @returns new swap array
 * @author  paul@nextme.one
 */
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

/**
 * 2022-10-21
 * @desc 16进制颜色值转rgba值，支持透明度配置
 * @param {*} hex
 * @param {*} opacity
 * @returns rgba
 * @author  paul@nextme.one
 */
export function getHexToRgba(hex, opacity) {
  return (
    'rgba(' +
    parseInt('0x' + hex.slice(1, 3)) +
    ',' +
    parseInt('0x' + hex.slice(3, 5)) +
    ',' +
    parseInt('0x' + hex.slice(5, 7)) +
    ',' +
    opacity +
    ')'
  )
}
/**
 * 2022-10-22
 * @desc block social input 校验
 * @param val
 * @param type
 * @returns
 * @author  paul@nextme.one
 */
export function getInputRegExp(val, type) {
  let state, message
  // 一些校验
  if (['email', 'website', 'telegram', 'substack', 'whatsapp'].includes(type)) {
    switch (type) {
      case 'email':
        if (!/^[a-zA-Z0-9.%+_-]+@[a-zA-Z0-9,_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val)) {
          state = 'error'
          message = 'illegal email format'
        }
        break
      case 'substack':
      case 'website':
        if (!isUrl(val)) {
          state = 'error'
          message = 'illegal website format'
        }
        break
      case 'telegram':
        if (/^[\u4e00-\u9fa5]+$/.test(val)) {
          state = 'error'
          message = 'illegal telegram format'
        }
        break
      case 'whatsapp':
        debugger
        if (!Number.isFinite(Number(val))) {
          state = 'error'
          message = 'illegal whatsapp format'
        }
        break
      default:
        break
    }
  } else {
    // 禁止输入含有%&',;=?$"~等特殊字符、中文字符
    if (!['discord_personal'].includes(type) && (!/^[\w./#@-]+$/.test(val) || /^[\u4e00-\u9fa5]{0,}$/.test(val))) {
      state = 'error'
      message = 'illegal special character'
    }
    if (val?.length > 256) {
      state = 'error'
      message = 'cannot exceed 256 characters'
    }
  }
  return { state, message }
}
/**
 * 校验http、https url & email
 * @param url
 * @returns
 */
export function isUrl(url: string) {
  if (!url) return
  return /(?:https?|ftp):\/\/[\w-]+(?:\.[\w-]+)+[\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-]|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g.test(
    url
  )
}
/**
 * 仅匹配链接 http、https url
 */
export function isLink(url: string) {
  if (!url) return
  return url.match(/https?:\/\/(?:[\w-]+\.)+[a-zA-Z]{2,}(?:\/\S*)?/g)
}
/**
 * 匹配不带前缀的url
 */
export function isUrlDomain(url: string) {
  if (!url) return
  return url.match(/(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:\/\S*)?/g)
}
/**
 * 匹配email（非mailto格式开头）
 */
export function isEmail(url: string) {
  if (!url) return
  return url.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g)
}
/**
 * 匹配email（mailto格式开头）
 */
export function isEmailMailto(url: string) {
  if (!url) return
  return url.match(/mailto:[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)
}
/**
 * studio blocks url & email格式加工
 */
export function getBlocksUrlFactory(url: string) {
  if (!isUrl(url)) return
  if (isEmail(url) && !isEmailMailto(url)) {
    return `mailto:${url}`
  }
  return url
}
/**
 * @desc 将长字符串转为短字符串，超出部分显示为...
 * @param {*} str 待处理字符串
 * @param length 需保留的长度 默认为10
 * @return 返回处理后的字符串
 * @author cas@nextme.one
 */
export const getShortenEndDots = (str: string, length = 10): string => {
  if (typeof str !== 'string') return str
  if (str.length < length) return str
  return str.slice(0, length) + '...'
}
/**
 * @desc 截取str一定长度并设置中间三个点
 * @param string
 * @returns
 */
export const getShortenMidDots = (str: string, length = 8) => {
  if (!str) return
  return `${str?.slice(0, length)}...${str?.slice(-length)}`
}
/**
 * 加工alchemy nft数据返回nft资源url及类型
 * @param val
 * @returns
 * @author paul@nextme.one
 */
export function getNFTSource(val) {
  if (!val) return
  return {
    ...val,
    name:
      (val?.token_id && `${val?.contract?.name || val?.collection?.name} #${val?.token_id}`) ||
      val?.name ||
      'Empty NFT Title',
    description: val?.description || 'No relevant data found',
    scan: getNFTOrScanUrl({
      type: 'nft',
      chain: val?.chain,
      contractAddress: val?.contract_address,
      tokenId: val?.token_id || val?.nft_id,
      options: val,
    }),
    source_url: val?.image_url || val?.video_url || val?.audio_url || val?.previews?.image_large_url,
    source_type: /(mp4|mp3|avi|wmv|mpg|mpeg|mov|rm|ram|swf|flv|wma|mkv)$/g.test(val?.image_uri?.format)
      ? 'video'
      : 'image',
  }
}
/**
 * 加工徽章OATs数据资产
 */
export function getBadgeSource(val) {
  if (!val) return
  return /(mp4|mp3|avi|wmv|mpg|mpeg|mov|rm|ram|swf|flv|wma|mkv)$/g.test(val) ? 'video' : 'image'
}

/**
 * 获取手机端和pc端的不同动画效果
 * @param isShow number 0隐藏，1淡入，2淡出
 * @param isMobile boolean 是否移动端
 * @returns className
 */
export function getAnimateClass(isShow: number, isMobile: boolean, isStudio: boolean) {
  switch (isShow) {
    case 1:
      return isMobile ? 'animate__fadeInUpBig' : isStudio ? 'animate__fadeInRightBig' : 'animate__zoomIn'
      break
    case 2:
      return isMobile ? 'animate__slideOutDown' : isStudio ? 'animate__fadeOutRightBig' : 'animate__zoomOut'
      break
    default:
      break
  }
}

export const generateId = () => Math.random().toString(10).slice(2)

export const generateRandomString = (randomNum = 9) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < randomNum; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function textEllipsis(context, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(' ')
  let line = ''
  const ellipsis = '...'
  let lineCount = 0
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' '
    const metrics = context.measureText(testLine)

    // 超过最大宽度，需要换行
    if (metrics.width > maxWidth && i > 0) {
      // 如果超过最大行数，直接输出省略号并返回
      if (maxLines == 1) {
        context.fillText(ellipsis, x, y)
        return ellipsis
      }
      // 如果达到最大行数，输出省略号并返回
      if (lineCount == maxLines - 1) {
        context.fillText(line + ellipsis, x, y)
        return line + ellipsis
      }
      // 如果未达到最大行数，输出该行并进行下一行处理
      context.fillText(line, x, y)
      line = words[i] + ' '
      y += lineHeight
      lineCount++
    } else {
      line = testLine
    }

    // 处理换行符和汉字展开
    for (let j = 0; j < line.length; j++) {
      const char = line.charAt(j)
      const code = line.charCodeAt(j)

      // 判断是否为汉字
      if (code >= 0x4e00 && code <= 0x9fa5) {
        const newLine = line.slice(0, j + 1)
        const metrics = context.measureText(newLine)

        // 处理汉字宽度超过最大宽度的情况
        if (metrics.width > maxWidth) {
          // 如果达到最大行数，输出省略号并返回
          if (lineCount == maxLines - 1) {
            context.fillText(line.slice(0, j) + ellipsis, x, y)
            return line.slice(0, j) + ellipsis
          }
          // 如果未达到最大行数，输出该行并进行下一行处理
          context.fillText(line.slice(0, j), x, y)
          line = line.slice(j)
          j = -1
          y += lineHeight
          lineCount++
        }
      } else if (char === '\n') {
        // 处理换行符
        // 如果达到最大行数，输出省略号并返回
        if (lineCount == maxLines - 1) {
          context.fillText(line.slice(0, j) + ellipsis, x, y)
          return line.slice(0, j) + ellipsis
        }
        // 如果未达到最大行数，输出该行并进行下一行处理
        context.fillText(line.slice(0, j), x, y)
        line = line.slice(j + 1)
        j = -1
        y += lineHeight
        lineCount++
      }
    }
  }

  // 处理最后一行
  context.fillText(line, x, y)
}

export const DidTextStyle = (
  context: CanvasRenderingContext2D,
  str: string,
  isRow: boolean,
  isRounded: boolean,
  isColumn: boolean,
  x: number,
  y: number,
  isleft: boolean
) => {
  const letterSpacing = 8
  context.save()
  context.translate(x, y)
  context.textBaseline = 'bottom'
  context.fillStyle = '#2a5672'
  context.font = '10px DM Sans'
  if (isRow) {
    context.rotate((Math.PI / 180) * 90)
  } else if (isRounded) {
    context.rotate((Math.PI / 100) * 45)
  } else if (isColumn) {
    context.rotate(Math.PI / 180)
  }
  context.fillText(str, 0, 0)
  context.restore()
  if (!isleft) {
    if (isRow) {
      y -= context.measureText(str).width + letterSpacing // 计算文字宽度
    } else if (isRounded) {
      y -= context.measureText(str).width + 3 // 计算文字宽度
      x -= context.measureText(str).width + 3
    } else if (isColumn) {
      x -= context.measureText(str).width + letterSpacing
    }
  } else {
    if (isRow) {
      y += context.measureText(str).width + letterSpacing // 计算文字宽度
    } else if (isRounded) {
      y += context.measureText(str).width + 3 // 计算文字宽度
      x += context.measureText(str).width + 3
    } else if (isColumn) {
      x += context.measureText(str).width + letterSpacing
    }
  }
  return { x, y }
}
//六边形绘制
export function computeHexagonPoints(width, height, edge) {
  let centerX = width / 2
  let centerY = height / 2
  let x = edge / 2
  let left = centerX - x
  let x1, x2, x3, x4, x5, x6
  let y1, y2, y3, y4, y5, y6
  x6 = left - x
  x1 = x5 = left
  x2 = x4 = left + x * 2
  x3 = left + 3 * x
  let y = (edge * Math.sqrt(3)) / 2
  let top = centerY - y
  y1 = y2 = top
  y3 = y6 = top + y
  y5 = y4 = top + 2 * y

  let points = new Array()
  points[0] = [x1, y1]
  points[1] = [x2, y2]
  points[2] = [x3, y3]
  points[3] = [x4, y4]
  points[4] = [x5, y5]
  points[5] = [x6, y6]
  return points
}

/**
 *
 * @param type * nft（nft详情页）scan（浏览器主页）address（账户页）
 * @param chainId * 请求链id 参考 wagmi/chains
 * @param contractAddress * 合约地址
 * @param tokenId * 当前nft数据
 * @param hash * 当请求为测试网的数据时，需要获取交易哈希
 * @returns string 返回opensea或者是etherscan地址 如果是测试网，则etherscan不能查看详情页，只能查看交易数据
 */
interface INFTOrScanUrlProps {
  type?: 'nft' | 'scan' | 'address' | 'tx'
  chain?: string
  chainId?: number
  chainType?: string
  address?: string
  contractAddress?: string
  tokenId?: string | number
  hash?: string
  options?: object
}

export const getNFTOrScanUrl = ({
  type = 'nft',
  chain = 'ethereum',
  chainId,
  chainType = 'default', // 参考 useChainConnect 返回值
  address = '',
  contractAddress,
  tokenId,
  hash = '',
  ...options
}: INFTOrScanUrlProps): string => {
  let _item = nftAvailableChains.find(row => row.chain == chain?.toLowerCase()),
    _chainId = Number(chainId || _item?.id),
    _chainCurrency = _item?.currency,
    _sol = chainType == 'sol' || chain?.toLowerCase()?.includes('solana') // 兼容不同地方的solana数据

  switch (type) {
    case 'tx':
      if (_sol) return `https://solscan.io/tx/${hash}${env?.isProd ? '' : '?cluster=devnet'}`
      return `${chainIdToNetWork(_chainId).blockExplorers?.default?.url}/tx/${hash}`

    case 'scan':
      if (_sol) return `https://solscan.io/account/${contractAddress || address}${env?.isProd ? '' : '?cluster=devnet'}`
      return `${chainIdToNetWork(_chainId).blockExplorers?.default?.url}/nft/${contractAddress}/${tokenId}`

    case 'address':
      if (_sol) return `https://solscan.io/account/${contractAddress || address}${env?.isProd ? '' : '?cluster=devnet'}`
      return `${chainIdToNetWork(_chainId).blockExplorers?.default?.url}/address/${address}`

    case 'nft':
      if (_sol) return `https://magiceden.io/item-details/${contractAddress}`
      return `https://opensea.io/assets/${_chainCurrency || chain}/${contractAddress}/${tokenId}`
    default:
      return null
  }
}
/**
 *
 *
 * @param key 域名唯一key
 * @param origin 默认origin
 * @returns
 */
export function getAPIsOrigin(key = 'api', origin) {
  let client = typeof window !== 'undefined'
  origin = (process?.env?.NODE_ENV === 'development' ? domains.dev : origin).replace(host, `${key}.${host}`)
  return process?.env?.NODE_ENV === 'development' || !client
    ? origin
    : window.location.origin.replace(host, `${key}.${host}`)
}

export const getDefaultAvatarUrl = (avatarID: string | number): string => domains.cdn + '/avatars/' + avatarID + '.jpg'
/**该方法用来绘制一个有填充色的圆角矩形
 *@param context:canvas的上下文环境
 *@param x:左上角x轴坐标
 *@param y:左上角y轴坐标
 *@param width:矩形的宽度
 *@param height:矩形的高度
 *@param radius:圆的半径
 *@param fillColor:填充颜色
 **/
export function fillRoundRect(context, x, y, width, height, radius, /*optional*/ fillColor) {
  //圆的直径必然要小于矩形的宽高
  if (2 * radius > width || 2 * radius > height) {
    return false
  }

  context.save()
  context.translate(x, y)
  //绘制圆角矩形的各个边
  drawRoundRectPath(context, width, height, radius)
  context.fillStyle = fillColor || '#000' //若是给定了值就用给定的值否则给予默认值
  context.fill()
  context.restore()
}

/**该方法用来绘制圆角矩形
 *@param context:canvas的上下文环境
 *@param x:左上角x轴坐标
 *@param y:左上角y轴坐标
 *@param width:矩形的宽度
 *@param height:矩形的高度
 *@param radius:圆的半径
 *@param lineWidth:线条粗细
 *@param strokeColor:线条颜色
 **/
export function strokeRoundRect(
  context,
  x,
  y,
  width,
  height,
  radius,
  /*optional*/ lineWidth,
  /*optional*/ strokeColor
) {
  //圆的直径必然要小于矩形的宽高
  if (2 * radius > width || 2 * radius > height) {
    return false
  }

  context.save()
  context.translate(x, y)
  //绘制圆角矩形的各个边
  drawRoundRectPath(context, width, height, radius)
  context.lineWidth = lineWidth || 2 //若是给定了值就用给定的值否则给予默认值2
  context.strokeStyle = strokeColor || '#000'
  context.stroke()
  context.restore()
}

export function drawRoundRectPath(context, width, height, radius) {
  context.beginPath(0)
  //从右下角顺时针绘制，弧度从0到1/2PI
  context.arc(width - radius, height - radius, radius, 0, Math.PI / 2)

  //矩形下边线
  context.lineTo(radius, height)

  //左下角圆弧，弧度从1/2PI到PI
  context.arc(radius, height - radius, radius, Math.PI / 2, Math.PI)

  //矩形左边线
  context.lineTo(0, radius)

  //左上角圆弧，弧度从PI到3/2PI
  context.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2)

  //上边线
  context.lineTo(width - radius, 0)

  //右上角圆弧
  context.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2)

  //右边线
  context.lineTo(width, height - radius)
  context.closePath()
}

export function getEncodeQuery(data: Dictionary<string | number | boolean>): string {
  let query = ''
  for (let d in data) query += encodeURIComponent(d) + '=' + encodeURIComponent(data[d]) + '&'
  return query.slice(0, -1)
}

/**
 * 根据不同策略计算一次性积分
 */
export function calcOncePoints(_props: { type: number; created_at: any }[], scores: { type: number; score: number }[]) {
  const props = _props.map(prop => {
    const { created_at, ...rest } = prop
    return {
      ...rest,
      created_at: typeof created_at === 'string' ? created_at : created_at?.['$date'],
    }
  })
  const findScore = (type: number) => {
    return scores.find(score => score.type == type)?.score || 0
  }

  let result = 0
  let records = []
  let find = null

  PointList.forEach(POINT => {
    find = null
    // 注册
    find = props.find(prop => prop.type == POINT)
    if (find) {
      result += findScore(find.type)
      records.push(find)
    }
  })

  find = null
  // 邀请
  let finds = props.filter(prop => prop.type == PointRules.INVITE)
  if (finds && finds.length) {
    result += findScore(PointRules.INVITE) * finds.length
    records = records.concat(finds)
  }

  find = null
  // more
  finds = props.filter(prop => Number(prop.type) > PointRules.TWITTER && Number(prop.type) < 10000)
  if (finds) {
    result += finds.reduce((prev, f) => prev + findScore(f.type), 0)
    records = records.concat(finds)
  }

  return {
    score: result,
    records,
  }
}

export const processTime = (time: any) => {
  if (typeof time === 'object' && time && time['$date']) {
    const _time = time['$date']
    return `${_time?.split('T')[0] || ''}`
  } else {
    const ymd = time?.split('T')[0]
    const hms = time?.split('T')[1]
    return `${ymd || ''}` //`${ymd} ${hms.split('.')[0]}`
  }
}

export type ListProps = {
  type: number
  created_at: string
  userId: string
  extra?: {
    username: string
  }
}[]

export const filterPointList = (list: ListProps) => {}

export const formatObjToArray = <T>(obj: T | Array<T>): Array<T> => {
  if (obj instanceof Array) {
    return obj
  } else if (!obj) {
    return []
  } else {
    return [obj]
  }
}

/**
 * 模糊搜索
 * @param queryString 搜索的字符串
 * @param allMsg
 * @param formatFN 数据过滤方法
 */

export const fuzzySearch = (queryString: string, allMsg: string[], formatFN = str => str) => {
  let queryStringArr = queryString.split('')
  let str = '(.*?)'
  let filterMsg = []
  let regStr = str + queryStringArr.join(str) + str
  let reg = RegExp(regStr, 'i') // 以nextme为例生成的正则表达式为/(.*?)n(.*?)m/i
  allMsg.map(item => {
    if (reg.test(formatFN(item))) {
      filterMsg.push(item)
    }
  })
  return filterMsg
}

export const formatAlchemyNFTValue = nftObj => {
  return nftObj?.name || ''
}

export const diffStudioData = (studioBlocks, studioServerBlocks) => {
  let [
    socialDataStudio,
    textDataStudio,
    linkDataStudio,
    cardDataStudio,
    groupDataStudio,
    careerDataStudio,
    nftDataStudio,
    badgeDataStudio,
  ] = ['social', 'text', 'link', 'card', 'group', 'career', 'nft', 'badge'].map(type => {
    return studioBlocks.filter(block => block.type.includes(type))
  })
  socialDataStudio = socialDataStudio?.[0]?.data

  let [
    socialDataStudioServer,
    textDataStudioServer,
    linkDataStudioServer,
    cardDataStudioServer,
    groupDataStudioServer,
    careerDataStudioServer,
    nftDataStudioServer,
    badgeDataStudioServer,
  ] = ['social', 'text', 'link', 'card', 'group', 'career', 'nft', 'badge'].map(type => {
    return studioServerBlocks.filter(block => block.type.includes(type))
  })
  socialDataStudioServer = socialDataStudioServer?.[0]?.data

  return {
    social:
      socialDataStudio.length &&
      socialDataStudioServer &&
      (socialDataStudio.length !== socialDataStudioServer.length || !isEqual(socialDataStudio, socialDataStudioServer)),
    text:
      textDataStudio.length &&
      textDataStudioServer &&
      (textDataStudio.length !== textDataStudioServer.length || !isEqual(textDataStudio, textDataStudioServer)),
    link:
      linkDataStudio.length &&
      linkDataStudioServer &&
      (linkDataStudio.length !== linkDataStudioServer.length || !isEqual(linkDataStudio, linkDataStudioServer)),
    card:
      cardDataStudio.length &&
      cardDataStudioServer &&
      (cardDataStudio.length !== cardDataStudioServer.length || !isEqual(cardDataStudio, cardDataStudioServer)),
    group:
      groupDataStudio.length &&
      groupDataStudioServer &&
      (groupDataStudio.length !== groupDataStudioServer.length || !isEqual(groupDataStudio, groupDataStudioServer)),
    career:
      careerDataStudio.length &&
      careerDataStudioServer &&
      (careerDataStudio.length !== careerDataStudioServer.length || !isEqual(careerDataStudio, careerDataStudioServer)),
    nft:
      nftDataStudio.length &&
      nftDataStudioServer &&
      (nftDataStudio.length !== nftDataStudioServer.length || !isEqual(nftDataStudio, nftDataStudioServer)),
    badge:
      badgeDataStudio.length &&
      badgeDataStudioServer &&
      (badgeDataStudio.length !== badgeDataStudioServer.length || !isEqual(badgeDataStudio, badgeDataStudioServer)),
  }
}

export function isAndroid() {
  return typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent)
}
export function isIOS() {
  return typeof navigator !== 'undefined' && /(iPhone|iPad|iPod|iOS|iPhone OS|Mac OS)/i.test(navigator.userAgent)
}
export function getEnvSplit(val) {
  if (!val) return
  let names = val?.split(/[(\r\n)\r\n]+/)
  if (names && Array.isArray(names)) return names
}
/**
 * 小数转变为分数
 * @param ratio 带转换数值
 * @param precision 最小公约数
 * @returns 分子，分母
 */
export function ratioToFraction(ratio) {
  // 将小数转换为分数
  let numerator = 1
  let denominator = 1
  while (Math.abs(ratio - numerator / denominator) > 1e-6) {
    if (ratio > numerator / denominator) {
      numerator += 1
    } else {
      denominator += 1
    }
  }
  // 将分数进行约分
  const gcd = getGcd(numerator, denominator)
  numerator /= gcd
  denominator /= gcd
  // 返回分数形式
  if (denominator === 1) {
    return numerator.toString()
  } else {
    return `${numerator}:${denominator}`
  }
}

function getGcd(a, b) {
  if (b === 0) {
    return a
  }
  return getGcd(b, a % b)
}

export function nFormatter(num?: number, digits?: number) {
  if (!num) return '0'
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })
  return item ? (num / item.value).toFixed(digits || 1).replace(rx, '$1') + item.symbol : '0'
}

export function capitalize(str: string) {
  if (!str || typeof str !== 'string') return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const userIsMember = (user): boolean => {
  if (user?.member) {
    return true
  }
  return false
}
export const getEnsAddressForEnsName = async (ensName: string): Promise<`0x${string}`> => {
  const client = createPublicClient({ chain: mainnet, transport: http() })
  const address = await client.getEnsAddress({ name: normalize(ensName) })
  return address
}

/**
 * @description 字符串转整数
 * @param str
 * @returns 返回转换后的数字
 */
export const convertToNumber = (str: string) => {
  if (typeof str !== 'string') {
    return null
  }
  // 检查字符串是否合法
  if (!/^\d+$/.test(str)) {
    return null // 或其他默认值或错误处理
  }
  // 尝试转换
  try {
    const num = parseInt(str, 10) // 或其他转换方法
    return num
  } catch (error) {
    return null // 或其他错误处理
  }
}

/**
 * @description 获取一个随机颜色
 * @returns
 */
export const getRandomLabelColor = () => {
  const randomIndex = Math.floor(Math.random() * labelColor.length)
  const randomItem = labelColor[randomIndex]
  return randomItem
}

/**
 * @description 给数组对象附加一个color字段为随机颜色
 * @param list
 * @returns
 */
export const appendRandomColor = (list: Array<any>) => {
  if (!Array.isArray(list)) {
    return []
  }
  if (list.length === 0) {
    return []
  }
  return list.map(item => ({
    ...item,
    color: randomcolor({
      hue: getRandomLabelColor(),
      luminosity: 'bright',
    }),
  }))
}

/**
 *
 * @param array
 * @returns
 */
export const shuffle = (array = []) => {
  if (!array || !array?.length) return
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
/**
 * 在两个数之间取带两位小数的随机数
 * @param min
 * @param max
 * @returns
 */
export function getRandomNumber(min, max) {
  let randomNumber = (Math.random() * (max - min) + min).toFixed(2)
  return Number(randomNumber)
}
