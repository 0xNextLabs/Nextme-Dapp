const time = (d_t: Date) => {
  let year = d_t.getFullYear()
  let month = ('0' + (d_t.getMonth() + 1)).slice(-2)
  let day = ('0' + d_t.getDate()).slice(-2)
  let hour = d_t.getHours()
  let minute = d_t.getMinutes()
  let seconds = d_t.getSeconds()
  let milSeconds = d_t.getMilliseconds()
  return `${year}-${month}-${day} ${hour}:${minute}:${seconds}.${milSeconds}`
}

/**
 * 简易埋点方案
 */
export class Tea {
  constructor() {}

  public report(name: string) {
    const now = new Date()

    console.log(`Tea: 【${name}】 【time: ${time(now)}】 【stamp: ${now.valueOf()}】`)
  }
}

export const tea = new Tea()
