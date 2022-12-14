/*
 * @Date: 2022-07-30 20:15:03
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-20 21:59:07
 */
import { ShapeFlags } from '../shared/ShapeFlags'

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export { createVNode as createElementVNode }

export function createVNode(type: any, props?: any, children?: any) {
  const vNode = {
    type,
    props,
    key: props?.key,
    children,
    component: null as any,
    shapeFlags: getShapeFlags(type),
    el: null as Element
  }

  // children
  if (typeof children === 'string') {
    vNode.shapeFlags |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vNode.shapeFlags |= ShapeFlags.ARRAY_CHILDREN
  }

  // 组件 + children object
  if (vNode.shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === 'object') {
      vNode.shapeFlags |= ShapeFlags.SLOT_CHILDREN
    }
  }

  return vNode
}

function getShapeFlags(type: any) {
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT
}

export function createTextNode(text: string) {
  return createVNode(Text, {}, text)
}
