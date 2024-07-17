// import CryptoJS from 'crypto-js'
import CryptoJS from 'crypto'
// const _KEY = 'hasje123bhjas'
// const _SECRET = crypto.createHash('sha256').update(_KEY).digest('hex').substr(0, 32)
const _SECRET = 'hasje123bhjas'

export const random_str = (e = 4) => {
  e = e || 4
  var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
    a = t.length,
    n = ''
  for (var i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a))
  return n
}

export const generateRandom = () => {
  const csrfToken = CryptoJS.randomBytes(32).toString('hex')
  const csrfTokenHash = CryptoJS.createHash('sha256').update(`${csrfToken}${_SECRET}`).digest('hex')
  return csrfTokenHash
}

// const key = CryptoJS.enc.Utf8.parse('oiqmshj89qmjsuyz') //十六位十六进制数作为密钥
// const iv = CryptoJS.enc.Utf8.parse('powmksi874njsuz0') //十六位十六进制数作为密钥偏移量

// export function decrypt(word) {
//   let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
//   let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
//   let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
//   let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
//   return decryptedStr.toString()
// }

// //加密方法
// export function encrypt(word) {
//   let srcs = CryptoJS.enc.Utf8.parse(word)
//   let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
//   return encrypted.ciphertext.toString().toUpperCase()
// }

export const encrypt = str => {
  // str = new TextEncoder().encode(str).toString('base64')
  str = Buffer.from(str).toString('base64')
  var prand = ''
  for (var i = 0; i < _SECRET.length; i++) {
    prand += _SECRET.charCodeAt(i).toString()
  }
  var sPos = Math.floor(prand.length / 5)
  var mult = parseInt(
    prand.charAt(sPos) +
      prand.charAt(sPos * 2) +
      prand.charAt(sPos * 3) +
      prand.charAt(sPos * 4) +
      prand.charAt(sPos * 5)
  )
  var incr = Math.ceil(_SECRET.length / 2)
  var modu = Math.pow(2, 31) - 1
  if (mult < 2) {
    alert('Please choose a more complex or longer password.')
    return null
  }
  var salt = Math.round(Math.random() * 1000000000) % 100000000
  prand += salt
  while (prand.length > 10) {
    prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString()
  }
  prand = (mult * prand + incr) % modu
  var enc_chr = ''
  var enc_str = ''
  for (var i = 0; i < str.length; i++) {
    enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255))
    if (enc_chr < 16) {
      enc_str += '0' + enc_chr.toString(16)
    } else enc_str += enc_chr.toString(16)
    prand = (mult * prand + incr) % modu
  }
  salt = salt.toString(16)
  while (salt.length < 8) salt = '0' + salt
  enc_str += salt
  return enc_str
}

export const decrypt = str => {
  var prand = ''
  for (var i = 0; i < _SECRET.length; i++) {
    prand += _SECRET.charCodeAt(i).toString()
  }
  var sPos = Math.floor(prand.length / 5)
  var mult = parseInt(
    prand.charAt(sPos) +
      prand.charAt(sPos * 2) +
      prand.charAt(sPos * 3) +
      prand.charAt(sPos * 4) +
      prand.charAt(sPos * 5)
  )
  var incr = Math.round(_SECRET.length / 2)
  var modu = Math.pow(2, 31) - 1
  var salt = parseInt(str.substring(str.length - 8, str.length), 16)
  str = str.substring(0, str.length - 8)
  prand += salt
  while (prand.length > 10) {
    prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString()
  }
  prand = (mult * prand + incr) % modu
  var enc_chr = ''
  var enc_str = ''
  for (var i = 0; i < str.length; i += 2) {
    enc_chr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255))
    enc_str += String.fromCharCode(enc_chr)
    prand = (mult * prand + incr) % modu
  }
  // return new TextEncoder().encode(enc_str).toString('base64')
  return Buffer.from(enc_str, 'base64').toString()
}

// https://blog.kaciras.com/article/26/aes-crypto-in-node-and-browser

// async function generateKey() {
//   return await crypto.subtle.generateKey(
//     {
//       name: 'AES-GCM',
//       length: 256, //可以是128, 192, 256, 但Chrome当前不支持192
//     },
//     true,
//     ['encrypt', 'decrypt']
//   )
// }

// const key = await generateKey()
// console.log(key)
// let iv = new TextEncoder().encode('uibnm') // crypto.getRandomValues(new Uint8Array(12)) // 推荐12字节

// async function encryptMessage(message, key) {
//   const encoder = new TextEncoder()
//   const data = encoder.encode(message)
//   return await crypto.subtle.encrypt(
//     {
//       name: 'AES-GCM',
//       iv,
//       tagLength: 128, //可选，默认128，还可以是32, 64, 96, 104, 112, 120
//     },
//     key,
//     data
//   )
// }

// async function decryptMessage(cipherText, iv, key) {
//   const result = await crypto.subtle.decrypt(
//     {
//       name: 'AES-GCM',
//       iv,
//       tagLength: 128,
//     },
//     key,
//     cipherText
//   )
//   const decoder = new TextDecoder()
//   return decoder.decode(result)
// }

// function ab2str(buf) {
//   //   return String.fromCharCode.apply(null, new Uint16Array(buf))
//   return new TextDecoder().decode(buf)
// }

// function str2ab(str) {
//   //   var buf = new ArrayBuffer(str.length * 2) // 2 bytes for each char
//   //   var bufView = new Uint16Array(buf)
//   //   for (var i = 0, strLen = str.length; i < strLen; i++) {
//   //     bufView[i] = str.charCodeAt(i)
//   //   }
//   //   return buf
//   return new TextEncoder().encode(str)
// }

// const encrypt = async text => {
//   return ab2str(await encryptMessage(text, key))
// }

// const decrypt = async str => {
//   return await decryptMessage(str2ab(str), iv, key)
// }

// const text =
//   '{ content: An obscure body in the S-K System, your majesty. The inhabitants refer to it as the planet Earth.}'

// const cipherText = await encrypt(text)
// const plainText = await decrypt(cipherText)
// console.log(plainText)
