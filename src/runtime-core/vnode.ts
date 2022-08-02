/*
 * @Date: 2022-07-30 20:15:03
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-02 20:10:53
 */
export function createVNode(type: any, props?: any, children?: any) {
  const vNode = { 
    type,
    props,
    children,
    el: null as Element,
  }

  return vNode
}
