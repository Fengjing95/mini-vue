/*
 * @Date: 2022-08-05 21:22:33
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 初始化 slots
 * @LastEditTime: 2022-08-05 22:31:24
 */

import { ShapeFlags } from '../shared/ShapeFlags'

export function initSlots(instance: any, children: any[]) {
  // instance.slots = Array.isArray(children) ? children : [children]
  const { vNode } = instance
  if (vNode.shapeFlags & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots)
  }
}

function normalizeObjectSlots(children: any[], slots: Record<string, any>) {
  for (const key in children) {
    const value = children[key]

    // slot
    slots[key] = (props: any) => normalizeSlotValue(value(props))
  }
}

function normalizeSlotValue(value: any): any {
  return Array.isArray(value) ? value : [value]
}
