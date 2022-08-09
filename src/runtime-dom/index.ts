/*
 * @Date: 2022-08-08 18:19:32
 * @Author: 枫
 * @LastEditors: 枫
 * @description: dom平台的渲染
 * @LastEditTime: 2022-08-09 23:02:41
 */
import { createRender } from '../runtime-core'
import { isOn } from '../shared'

function createElement(type: any) {
  return document.createElement(type)
}

function patchProps(el: any, key: string, prevValue: any, nextVal: any) {
  if (isOn(key)) {
    const eventName = key.slice(2).toLowerCase()
    el.addEventListener(eventName, nextVal)
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, nextVal)
    }
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
