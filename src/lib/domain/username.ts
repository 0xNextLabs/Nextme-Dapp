import { getUserNameClaimed } from '@/services/user'
import { isValidUserName } from './valid'
import { codes } from '@/lib/types/codes'

/**
 * checkusername是否已经被注册
 * @param username 用户名
 * @returns true:已经被使用 false：未被使用
 */
export const getUserNameUsed = async (username: string) => {
  if (!username) return true
  const { status, type: validType, message } = isValidUserName(username)
  let val_toLowerCase = username.toLowerCase()

  if (!status) {
    return {
      status: 'error',
      text: message,
    }
  } else {
    return false
  }
}
/**
 * check username是否有效
 * @param params
 * @param type
 * @returns
 * @author paul@nextme.one
 */

export async function getCheckUserName(params, type: string | undefined | null) {
  const { val } = params
  if (!val) return { redirect: true }
  let redirect = false,
    res: any

  if (type === 'claim') return { redirect: true }
  if (val) {
    const { status, type: validType, message } = isValidUserName(val)
    if (!status) {
      return {
        status: 'error',
        text: message,
        redirect,
      }
    }
    res = await getUserNameClaimed({ username: val })

    const isErrorCode = res['errCode'] === 1031 || res['errCode'] === 1032
    const claimStatus = () => {
      if (!res) return 'loading'
      if (res?.ok && !res?.claimed) return 'success'
      if (res?.ok && res?.claimed) return 'error'
      return 'warning'
    }

    return {
      status: claimStatus(),
      // 不可认领时不展示val
      text: `${res['errCode'] === 1031 || res['errCode'] === 1032 ? '' : val} ${codes[res['errCode']]}`,
      redirect: type === 'claim',
      url: 'https://forms.gle/4WKdCWJgoX4ndmAk9',
      apply: isErrorCode ? 'apply by official channel' : '',
    }
  } else {
    return {
      status: 'error',
      text: 'username cannot be null',
      redirect: type === 'claim',
    }
  }
}
