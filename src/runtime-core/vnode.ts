/*
 * @Date: 2022-07-30 20:15:03
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-30 20:51:19
 */
export function createVNode(type, props?, children?) {
  const vNode = { 
    type, props, children
  }

  return vNode
}
