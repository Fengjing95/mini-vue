/*
 * @Date: 2022-07-31 21:34:10
 * @Author: 枫
 * @LastEditors: 枫
 * @description: vnode
 * @LastEditTime: 2022-07-31 21:39:50
 */
import { createVNode } from './vnode'

export function h(type: any, props?: any, children?: any) {
  return createVNode(type, props, children)
}
