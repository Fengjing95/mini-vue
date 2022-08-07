/*
 * @Date: 2022-08-07 21:12:18
 * @Author: 枫
 * @LastEditors: 枫
 * @description: provide/inject
 * @LastEditTime: 2022-08-07 22:22:19
 */

import { getCurrentInstance } from './component'

export function provide(key: string, value: any) {
  const currentInstance = getCurrentInstance()

  if (currentInstance) {
    let { provides } = currentInstance
    const parentProvides = currentInstance.parent.provides

    // 只能调用一次, 否则会一直嵌套
    if (provides === parentProvides) {
      provides = currentInstance.provides = Object.create(parentProvides)
    }

    provides[key] = value
  }
}

export function inject(key: string, defaultVal: any) {
  const currentInstance = getCurrentInstance()

  if (currentInstance) {
    const { parent } = currentInstance
    const parentProvides = currentInstance.parent.provides

    if (key in parentProvides) {
      return parentProvides[key]
    } else if (defaultVal) {
      if (typeof defaultVal === 'function') {
        return defaultVal()
      }
      return defaultVal
    }
  }
}
