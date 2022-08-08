/*
 * @Date: 2022-07-30 20:18:41
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 渲染
 * @LastEditTime: 2022-08-08 19:16:13
 */
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { createAppAPI } from './createApp'
import { Fragment, Text } from './vnode'

export function createRender(options: any): any {
  const {
    createElement: hostCreateElement,
    patchProps: hostPatchProps,
    insert: hostInsert
  } = options

  function render(vNode: any, container: any, parentComponent: any) {
    // patch 为了方便后续递归
    patch(vNode, container, null)
  }

  function patch(vNode: any, container: any, parentComponent: any) {
    // FIXME 是否如此解决
    if (!vNode) return
    const { type, shapeFlags } = vNode

    switch (type) {
      case Fragment:
        mountChildren(vNode.children, container, parentComponent)
        break

      case Text:
        processText(vNode, container)
        break

      default:
        // console.log(vNode.type);
        if (shapeFlags & ShapeFlags.ELEMENT) {
          //  * 如果是 element 则处理 element,
          // element
          processElement(vNode, container, parentComponent)
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          // * 如果是 component 就处理 component
          // component
          processComponent(vNode, container, parentComponent)
        }
    }
  }

  function processComponent(vNode: any, container: any, parentComponent: any) {
    mountComponent(vNode, container, parentComponent)
  }

  function mountComponent(
    initialVNode: any,
    container: any,
    parentComponent: any
  ) {
    const instance = createComponentInstance(initialVNode, parentComponent)

    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect(instance: any, initialVNode: any, container: any) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)

    // vNode -> component -> render -> patch
    // vNode -> element -> mountElement
    patch(subTree, container, instance)
    initialVNode.el = subTree
  }

  function processElement(vNode: any, container: any, parentComponent: any) {
    mountElement(vNode, container, parentComponent)
  }

  function mountElement(vNode: any, container: any, parentComponent: any) {
    const el = (vNode.el = hostCreateElement(vNode.type))

    // 内容
    const { children, props, shapeFlags } = vNode

    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      // string
      el.textContent = children
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      // array
      mountChildren(children, el, parentComponent)
    } else {
      // vnode
      patch(children, el, parentComponent)
    }

    // props
    for (let key in props) {
      const val = props[key]
      // if (isOn(key)) {
      //   const eventName = key.slice(2).toLowerCase()
      //   el.addEventListener(eventName, val)
      // } else {
      //   el.setAttribute(key, val)
      // }
      hostPatchProps(el, key, val)
    }

    // container.appendChild(el)
    hostInsert(el, container)
  }
  function mountChildren(children: any, container: any, parentComponent: any) {
    children.forEach((child: any) => {
      patch(child, container, parentComponent)
    })
  }

  function processText(vNode: any, container: any) {
    const { children } = vNode

    const textNode = document.createTextNode(children)
    container.appendChild(textNode)
  }

  return {
    createApp: createAppAPI(render)
  }
}
