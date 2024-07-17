export class oauthPopWindowClass {
  private popWindowClient: Window
  private oauthLinkStack: string[] = []
  private channelMessage
  constructor() {
    this.channelMessage = {
      redirect: true,
      url: '',
    }
  }
  public getWindow() {
    return this.popWindowClient
  }
  public openWindow(url: string) {
    if (!this.popWindowClient) {
      this.popWindowClient = window
    }

    this.oauthLinkStack.push(url)
    const width = 600
    const height = 700
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2
    // 打开登录页面
    const windowClient = this.popWindowClient.open(
      url,
      'Login',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    )
    this.channelMessage = {
      redirect: false,
      url: '',
    }
    this.setChannelMessage({
      redirect: false,
      url: '',
    })
    // 通过postmessage达成页面间的通信
    const channel = new BroadcastChannel('channelName')

    channel.onmessage = e => {
      this.channelMessage = e.data
      if (e?.data?.redirect) {
        location.href = e?.data?.url
      }
    }
  }
  public getChannelMessage() {
    return JSON.parse(localStorage.getItem('oauthPopWindow'))
  }
  public setChannelMessage({ redirect, url }: { redirect: boolean; url: string }) {
    localStorage.setItem(
      'oauthPopWindow',
      JSON.stringify({
        redirect: redirect,
        url: url,
      })
    )
  }
  public removeChannelMessage() {
    localStorage.removeItem('oauthPopWindow')
  }
}
export const oauthPopWindow = new oauthPopWindowClass()
