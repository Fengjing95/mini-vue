/*
 * @Date: 2022-07-28 08:16:53
 * @Author: 枫
 * @LastEditors: 枫
 * @description: createApp 函数, 主入口
 * @LastEditTime: 2022-08-04 17:11:09
 */

import { render } from './renderer'
import { createVNode } from './vnode'

export function createApp(rootComponent: any) {
  return {
    mount(rootContainer: string | Element) {
      if (typeof rootContainer === 'string') {
        rootContainer = document.querySelector(rootContainer)
      }
      // 首先转 vNode
      // component => vNode
      // 所有的逻辑都基于 vNode 操作
      const vNode = createVNode(rootComponent)

      render(vNode, rootContainer)
    }
  }
}
