import config from '@/config'
import { s3UploadSvc } from '@/services/s3'
import { useMemo } from 'react'
import { useAvatar, useDynamicExampleContract, useLocation, useStudioData, useUserData } from '.'
import { CONTRACT_ADDRESSES } from '../types/address'
import {
  base64ToBlob,
  DidTextStyle,
  fillRoundRect,
  getDefaultAvatarUrl,
  getRandomIntNum,
  getShortenEndDots,
  textEllipsis,
} from '../utils'
import { getPayMetaData } from '../web3'

const getRandomCardId = () => {
  const randomVal = getRandomIntNum(1, 20)
  const bgToSBTMap = {
    1: {
      cardId: 1,
    },
    2: {
      cardId: 1,
    },
    3: {
      cardId: 3,
    },
    4: {
      cardId: 2,
    },
    5: {
      cardId: 3,
    },
    6: {
      cardId: 5,
    },
    7: {
      cardId: 5,
    },
    8: {
      cardId: 5,
    },
    9: {
      cardId: 5,
    },
    10: {
      cardId: 5,
    },
    11: {
      cardId: 1,
    },
    12: {
      cardId: 6,
    },
    13: {
      cardId: 3,
    },
    14: {
      cardId: 8,
    },
    15: {
      cardId: 3,
    },
    16: {
      cardID: 2,
    },
    17: {
      cardId: 6,
    },
    18: {
      cardId: 2,
    },
    19: {
      cardId: 5,
    },
    20: {
      cardId: 8,
    },
  }
  return { bgId: randomVal, sbtCard: bgToSBTMap[randomVal] }
}

export const useDownloadQrCode = () => {
  const { avatar } = useAvatar()
  const { profile } = useStudioData()
  let { name } = profile
  const drawQrCode = async (id = 'QrCode') => {
    const canvas = document.createElement('canvas')
    const canvasSize = 1100
    const qrcodeSize = 1000
    const avatarSize = 200
    canvas.width = canvasSize
    canvas.height = canvasSize
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvasSize, canvasSize)
    const qrcode: any = document.getElementById(id)
    const qrImg = new Image()
    qrImg.crossOrigin = 'anonymous'
    qrImg.src = qrcode?.toDataURL('image/png')
    qrImg.onload = () => {
      ctx.drawImage(qrImg, (canvasSize - qrcodeSize) / 2, (canvasSize - qrcodeSize) / 2, qrcodeSize, qrcodeSize)
      const avatarImg = new Image()
      avatarImg.crossOrigin = 'anonymous'
      avatarImg.src = avatar
      ctx.fillStyle = '#fff'
      ctx.fillRect(
        (canvasSize - avatarSize) / 2 - 10,
        (canvasSize - avatarSize) / 2 - 10,
        avatarSize + 20,
        avatarSize + 20
      )
      avatarImg.onload = () => {
        ctx.drawImage(avatarImg, (canvasSize - avatarSize) / 2, (canvasSize - avatarSize) / 2, avatarSize, avatarSize)
        const a = document.createElement('a')
        document.getElementsByTagName('body')
        document.body.appendChild(a)
        a.download = `${config.title}_Social_QrCode.png`
        a.href = canvas?.toDataURL('image/png')
        a.click()
        document.body.removeChild(a)
      }
    }
  }
  return drawQrCode
}

export const useCanvasImg = (isMintImg = false) => {
  const { profile } = useStudioData()
  let { name, description } = profile
  let { avatar } = useAvatar()
  const host = useLocation()
  const user = useUserData()
  const { prefix, domains } = config

  const DynamicExampleInstance = useDynamicExampleContract(CONTRACT_ADDRESSES, true)
  let image = ''
  let UUID = useMemo(
    () => getShortenEndDots(user?.uuid || 'a9b33123-4a70-4b78-8015-2c73c8afadbc', 50).toUpperCase(),
    [user?.uuid]
  )
  let cardUserName = user?.username
  const drawCanvas = async ({
    canvas = document.createElement('canvas'),
    isDownloadImg = false,
    username = '',
    progress = undefined,
    uuid: _uuid = '',
    cardName: _cardName = '',
    desc: _desc = '',
    avatar: _avatar = '',
  } = {}) => {
    const { bgId, sbtCard } = getRandomCardId()
    let LEFT = isDownloadImg ? 599 : isMintImg ? 184 : 39,
      TOP = isDownloadImg ? 62 : 42,
      BOTTOM = isDownloadImg ? 667 : 687,
      CARD_X1 = 0,
      CARD_Y1 = 0,
      CARD_X2 = 402,
      CARD_Y2 = BOTTOM,
      CANVAS_WIDTH = LEFT * 2 + CARD_X2,
      CANVAS_HEIGHT = 770
    cardUserName = _cardName || cardUserName
    name = username || _cardName || name
    UUID = getShortenEndDots(_uuid, 50).toUpperCase() || UUID
    description = _desc || description
    avatar = _avatar || avatar

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#18182c'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    var grad = ctx.createLinearGradient(300, 300, 0, 0) //创建一个渐变色线性对象
    grad.addColorStop(0, '#21FFA2') //定义渐变色颜色
    grad.addColorStop(1, '#226DFF')
    //背景
    return new Promise<any>((bgResolve, bgReject) => {
      progress?.setProgress('generate-sbt', 100)
      const cardBgImg = new Image()
      cardBgImg.crossOrigin = 'anonymous'
      cardBgImg.src = `${domains.cdn}/static/twitter/cards/${bgId}.png`
      ;(cardBgImg.width = CANVAS_WIDTH), (cardBgImg.height = CANVAS_HEIGHT)
      //头像
      cardBgImg.onload = () => {
        isDownloadImg && ctx.drawImage(cardBgImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        bgResolve(
          new Promise<any>((resolve, reject) => {
            progress?.setProgress('generate-sbt', 100)
            const bgimg = new Image()
            bgimg.crossOrigin = 'anonymous'
            bgimg.src = isDownloadImg
              ? `${domains.cdn}/pay/bg_cards/${sbtCard.cardId}.png`
              : `${domains.cdn}/status/pay_card_bg.png`
            bgimg.width = CARD_X2
            bgimg.height = CARD_Y2
            bgimg.onload = () => {
              progress?.setProgress('get-sbt', 100)
              ctx.drawImage(bgimg, LEFT, TOP, CARD_X2, CARD_Y2)
              var textgrad = ctx.createLinearGradient(300, 0, 0, 0) //创建一个渐变色线性对象
              textgrad.addColorStop(1, '#5D636D') //定义渐变色颜色
              textgrad.addColorStop(0, '#EEEEEE')
              ctx.fillStyle = textgrad
              ctx.font = '30px DM Sans'

              textEllipsis(ctx, name || cardUserName, LEFT + 54, TOP + 240, 285, 24, 2)
              ctx.fillStyle = textgrad
              ctx.font = '18px Dm Sans'
              textEllipsis(ctx, description || config.pay.name || username, LEFT + 54, TOP + 285, 300, 24, 6)
              ctx.fillStyle = '#fff'
              ctx.font = '16px DM Sans'
              ctx.fillText(`${host}/`, LEFT + 54, TOP + 604)
              ctx.lineJoin = 'round'
              ctx.lineWidth = 23
              fillRoundRect(
                ctx,
                LEFT + 59 + ctx.measureText(host + '/').width,
                TOP + 588.5,
                ctx.measureText(cardUserName).width + 20,
                23,
                4,
                '#000030'
              )
              ctx.beginPath()
              ctx.arc(LEFT + 122.5, TOP + 130, 20, 0, Math.PI * 2, true)
              ctx.lineWidth = 3
              ctx.closePath()
              ctx.strokeStyle = grad
              ctx.stroke()
              ctx.fillStyle = '#fff'
              ctx.font = '16px DM Sans'
              //username text
              ctx.fillText(`${cardUserName}`, LEFT + 68 + ctx.measureText(host + '/').width, TOP + 605)
              let x = LEFT + 20,
                y = TOP + 30 // 文字开始的坐标
              //左边DID样式
              for (let i = 0; i < UUID.length; i++) {
                let isRow: boolean
                let isRounded: boolean
                let isColumn: boolean
                const str = UUID.slice(i, i + 1).toString()
                isRow = str.match(/[A-Za-z0-9]/) && y < TOP + CARD_Y2 - 36 && x <= LEFT + 20
                isRounded = y > TOP + CARD_Y2 - 36 && x <= LEFT + 20
                isColumn = y > TOP + CARD_Y2 - 36 && x >= LEFT + 20 && x <= LEFT + 482
                const { x: _x, y: _y } = DidTextStyle(ctx, str, isRow, isRounded, isColumn, x, y, true)
                x = _x
                y = _y
              }
              // 右边DID样式
              ;(x = LEFT + 372), (y = TOP + CARD_Y2 - 30)
              for (let i = 0; i < UUID.length; i++) {
                const str = UUID.slice(i, i + 1).toString()
                let isRow: boolean
                let isRounded: boolean
                let isColumn: boolean
                isRow = y <= TOP + CARD_Y2 - 30 && x >= LEFT + 372 && y >= TOP + 36
                isRounded = y <= TOP + 36 && x >= LEFT + 382
                isColumn = y <= TOP + 36 && x > LEFT + 40
                const { x: _x, y: _y } = DidTextStyle(ctx, str, isRow, isRounded, isColumn, x, y, false)
                x = _x
                y = _y
              }
              const qrcode: any = document.getElementById('QrCode')
              const qrImg = new Image()
              qrImg.src = qrcode?.toDataURL('image/png')
              qrImg.onload = () => {
                progress?.setProgress('get-qr-code', 100)
                ctx.fillStyle = '#085679'
                ctx.drawImage(qrImg, LEFT + 54, TOP + 448, 108, 108)
                ctx.restore()
                const img = new Image()
                img.crossOrigin = 'anonymous'
                const avatarUrl =
                  profile?.avatar?.type == 'default' && typeof avatar == 'number' ? getDefaultAvatarUrl(avatar) : avatar
                img.src = avatarUrl

                resolve(
                  new Promise((resolve2, reject2) => {
                    img.onload = async function () {
                      var circle = {
                        x: 110 / 2,
                        y: 110 / 2,
                        r: 110 / 2,
                      }
                      ctx.beginPath()
                      //圆形头像
                      ctx.arc(LEFT + 107, TOP + 130, circle.r, 0, Math.PI * 2, true)
                      ctx.clip() //剪切路径
                      ctx.drawImage(img, LEFT + 52, TOP + 75, 110, 110)
                      ctx.restore()
                      if (isMintImg) {
                        image = canvas?.toDataURL('image/png')
                        const cid: any = await getPayMetaData(
                          user?.username,
                          profile?.name || user?.username,
                          avatarUrl,
                          profile?.description || '',
                          user.uuid,
                          process.env.NODE_ENV === 'development' ? `dev.${config.host}` : host,
                          profile?.avatar?.type || 'default',
                          image,
                          profile?.avatar?.imgStyle,
                          img.width,
                          img.height
                        )
                        try {
                          const data = await DynamicExampleInstance.mint(cid, user?.uuid)
                          progress?.setProgress('generate-img', 100)
                          resolve2(data)
                        } catch (error) {
                          reject2('avatar_error')
                          progress?.abort()
                        }
                      } else if (isDownloadImg) {
                        try {
                          image = canvas?.toDataURL('image/png')
                          const downloadImage = canvas?.toDataURL('image/png', 1)
                          const downloadBase64 = downloadImage.split(',')[1]
                          const fileBlob = await base64ToBlob({ b64data: downloadBase64, contentType: 'image/png' })
                          progress?.setProgress('generate-img', 50)
                          const imageFile = new File([fileBlob], `${prefix}_social_card.png`, { type: 'image/png' })
                          const imageUrl = await s3UploadSvc(imageFile, user.uuid, `${prefix}_social_card`)
                          progress?.setProgress('generate-img', 100)
                          resolve({ imageUrl })
                          resolve2({ imageUrl })
                        } catch {
                          progress?.abort()
                        }
                      } else {
                        const a = document.createElement('a')
                        document.getElementsByTagName('body')
                        document.body.appendChild(a)
                        a.download = `${config.title}_Pay_@${name}.png`
                        a.href = canvas?.toDataURL('image/png')
                        a.click()
                        resolve2({})
                        progress?.setProgress('generate-img', 100)
                      }
                    }
                    img.onerror = error => {
                      reject2('avatar_error')
                      progress?.abort()
                    }
                  })
                )
              }
              qrImg.onerror = error => {
                reject('qrcode img load error')
                progress?.abort()
              }
            }
            bgimg.onerror = error => {
              progress?.abort()
            }
          })
        )
      }
      cardBgImg.onerror = error => {
        console.error(error)

        bgReject('card bg not load')
        progress?.abort()
      }
    })
  }

  return drawCanvas
}
