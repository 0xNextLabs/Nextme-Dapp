import { callModal } from '@/components/widgets/modal'

export class ObserverValue {
  public changedQueue: string[] = []

  constructor() {}

  public pushChanged(id: string) {
    if (this.changedQueue.find(item => item === id)) return
    this.changedQueue.push(id)
  }

  public removeChanged(id: string) {
    const index = this.changedQueue.findIndex(item => item === id)
    if (index > -1) {
      this.changedQueue.splice(index, 1)
    }
  }

  public isNeedConfirm() {
    return this.changedQueue.length > 0
  }

  public hasChanged(id: string) {
    return this.changedQueue.find(item => item === id)
  }

  public tip(cb: () => void) {
    callModal({
      type: 'confirm',
      async onOk() {
        cb()
        return true
      },
    })
  }
}

export const obValue = new ObserverValue()
