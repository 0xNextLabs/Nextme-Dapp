/**
 * 创建一个通用的异步执行器
 */
export function promiseValue<T>() {
  let resolve: (value: T) => void, reject: (value: T) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return {
    promise,
    resolve,
    reject,
  }
}

/**
 * @description 比较两个数组的相同和不同的元素
 * @param source
 * @param target
 * @returns
 */
export function compareArrays(source: Array<string>, target: Array<string>) {
  const added = []
  const removed = []

  // 检查 target 相对于 source 的新增元素
  for (const item of target) {
    if (!source.some(aItem => aItem === item)) {
      added.push(item)
    }
  }

  // 检查 source 相对于 target 的删除元素
  for (const item of source) {
    if (!target.some(bItem => bItem === item)) {
      removed.push(item)
    }
  }

  return { added, removed }
}
