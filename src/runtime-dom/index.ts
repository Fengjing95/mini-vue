/*
 * @Date: 2022-08-08 18:19:32
 * @Author: 枫
 * @LastEditors: 枫
 * @description: dom平台的渲染
 * @LastEditTime: 2022-08-08 18:39:49
 */
import { createRender } from '../runtime-core'
import { isOn } from '../shared'

function createElement(type: any) {
  return document.createElement(type)
}

function patchProps(el: any, key: string, val: any) {
  if (isOn(key)) {
    const eventName = key.slice(2).toLowerCase()
    el.addEventListener(eventName, val)
  } else {
    el.setAttribute(key, val)
  }
}

function insert(el: any, parent: any) {
  parent.appendChild(el)
}

const renderer = createRender({
  createElement,
  patchProps,
  insert
})

export function createApp(...args: any) {
  return renderer.createApp(...args)
}

export * from '../runtime-core'
