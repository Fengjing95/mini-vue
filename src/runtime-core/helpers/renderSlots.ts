/*
 * @Date: 2022-08-05 21:36:14
 * @Author: 枫
 * @LastEditors: 枫
 * @description: slots 渲染函数
 * @LastEditTime: 2022-08-05 22:25:33
 */

import { createVNode } from '../vnode'

export function renderSlots(
  slots: Record<string, any>,
  name: string,
  props: any
) {
  const slot = slots[name]

  if (slot) {
    if (typeof slot === 'function') {
      return createVNode('div', {}, slot(props))
    }
  }
}
