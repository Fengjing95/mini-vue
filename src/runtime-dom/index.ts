/*
 * @Date: 2022-08-08 18:19:32
 * @Author: 枫
 * @LastEditors: 枫
 * @description: dom平台的渲染
 * @LastEditTime: 2022-08-11 22:36:41
 */
import { createRender } from '../runtime-core'
import { isOn } from '../shared'

// 新建元素
function createElement(type: any) {
  return document.createElement(type)
}

// 对比属性
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

// 插入节点
function insert(child: any, parent: any, anchor: any) {
  // parent.appendChild(el)
  parent.insertBefore(child, anchor || null)
}

// 移除节点
function remove(child: any) {
  const parent = child.parentNode
  if (parent) {
    parent.removeChild(child)
  }
}

// 设置文本节点
function setElementText(el: any, text: string) {
  el.textContent = text
}

const renderer = createRender({
  createElement,
  patchProps,
  insert,
  remove,
  setElementText
})

export function createApp(...args: any) {
  return renderer.createApp(...args)
}

export * from '../runtime-core'
