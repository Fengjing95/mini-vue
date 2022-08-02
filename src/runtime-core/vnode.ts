/*
 * @Date: 2022-07-30 20:15:03
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-02 21:22:29
 */
export function createVNode(type: any, props?: any, children?: any) {
  const vNode = {
    type,
    props,
    children,
    el: null as Element
  }

  return vNode
}
