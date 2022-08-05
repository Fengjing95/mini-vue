/*
 * @Date: 2022-08-02 21:01:29
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 代理组建绑定器
 * @LastEditTime: 2022-08-05 21:21:43
 */

import { hasOwn } from '../shared'

const publicPropertiesMap: Record<string | symbol, (i: any) => any> = {
  $el: (i: any) => i.vNode.el,
  $slots: (i: any) => i.slots
}

export const publicInstanceProxyHandlers = {
  get({ _: instance }: { _: any }, key: string | symbol) {
    const { setupState, props } = instance

    if (hasOwn(setupState, key)) {
      // setup 中返回的属性
      return setupState[key]
    } else if (hasOwn(props, key)) {
      // props 中的属性
      return props[key]
    }

    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      return publicGetter(instance)
    }
  }
}
