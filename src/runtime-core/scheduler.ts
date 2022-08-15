/*
 * @Date: 2022-08-15 13:22:10
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 调度器
 * @LastEditTime: 2022-08-15 14:17:29
 */

const queue: any[] = []

let isFlushPending = false

export function queueJobs(job: any) {
  if (!queue.includes(job)) {
    queue.push(job)
  }

  queueFlush()
}

function queueFlush() {
  if (isFlushPending) return
  isFlushPending = true

  // Promise.resolve().then(() => {
  //   flushJobs()
  // })

  nextTick(flushJobs)
}

function flushJobs() {
  isFlushPending = false
  let job: Function

  while ((job = queue.shift())) {
    job && job()
  }
}

const p = Promise.resolve()

export function nextTick<T>(fn: () => T) {
  return fn ? p.then(fn) : p
}
