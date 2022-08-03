/*
 * @Date: 2022-07-30 20:15:03
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-03 20:03:32
 */
import { ShapeFlags } from '../shared/ShapeFlags'

export function createVNode(type: any, props?: any, children?: any) {
  const vNode = {
    type,
    props,
    children,
    shapeFlags: getShapeFlags(type),
    el: null as Element
  }

  // children
  if (typeof children === 'string') {
    vNode.shapeFlags |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vNode.shapeFlags |= ShapeFlags.ARRAY_CHILDREN
  }

  return vNode
}

function getShapeFlags(type: any) {
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT
}
