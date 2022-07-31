/*
 * @Date: 2022-07-30 20:15:03
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-31 21:20:23
 */
export function createVNode(type: any, props?: any, children?: any) {
  const vNode = { 
    type, props, children
  }

  return vNode
}
