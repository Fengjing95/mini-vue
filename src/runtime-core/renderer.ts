/*
 * @Date: 2022-07-30 20:18:41
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 渲染
 * @LastEditTime: 2022-08-06 22:59:13
 */
import { isObject, isOn } from '../shared'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vnode'

export function render(vNode: any, container: any) {
  // patch 为了方便后续递归
  patch(vNode, container)
}

function patch(vNode: any, container: any) {
  const { type, shapeFlags } = vNode

  switch (type) {
    case Fragment:
      mountChildren(vNode.children, container)
      break

    case Text:
      processText(vNode, container)
      break

    default:
      // console.log(vNode.type);
      if (shapeFlags & ShapeFlags.ELEMENT) {
        //  * 如果是 element 则处理 element,
        // element
        processElement(vNode, container)
      } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        // * 如果是 component 就处理 component
        // component
        processComponent(vNode, container)
      }
  }
}

function processComponent(vNode: any, container: any) {
  mountComponent(vNode, container)
}

function mountComponent(initialVNode: any, container: any) {
  const instance = createComponentInstance(initialVNode)

  setupComponent(instance)
  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect(instance: any, initialVNode: any, container: any) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)

  // vNode -> component -> render -> patch
  // vNode -> element -> mountElement
  patch(subTree, container)
  initialVNode.el = subTree
}

function processElement(vNode: any, container: any) {
  mountElement(vNode, container)
}

function mountElement(vNode: any, container: any) {
  const el = (vNode.el = document.createElement(vNode.type))

  // 内容
  const { children, props, shapeFlags } = vNode

  if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
    // string
    el.textContent = children
  } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    // array
    mountChildren(children, el)
  } else {
    // vnode
    patch(children, el)
  }

  // props
  for (let key in props) {
    const val = props[key]
    if (isOn(key)) {
      const eventName = key.slice(2).toLowerCase()
      el.addEventListener(eventName, val)
    } else {
      el.setAttribute(key, val)
    }
  }

  container.appendChild(el)
}
function mountChildren(children: any, container: any) {
  children.forEach((child: any) => {
    patch(child, container)
  })
}

function processText(vNode: any, container: any) {
  const { children } = vNode

  const textNode = document.createTextNode(children)
  container.appendChild(textNode)
}
