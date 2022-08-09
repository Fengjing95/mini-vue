/*
 * @Date: 2022-07-30 20:18:41
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 渲染
 * @LastEditTime: 2022-08-09 20:39:32
 */
import { effect } from '../reactivity'
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

  function render(vNode: any, container: any) {
    // patch 为了方便后续递归
    patch(null, vNode, container, null)
  }

  // n1 -> 旧的节点
  // n2 -> 新的节点
  function patch(n1: any, n2: any, container: any, parentComponent: any) {
    // FIXME 是否如此解决
    if (!n2) return
    const { type, shapeFlags } = n2

    switch (type) {
      case Fragment:
        processFragment(n1, n2.children, container, parentComponent)
        break

      case Text:
        processText(n1, n2, container)
        break

      default:
        // console.log(vNode.type);
        if (shapeFlags & ShapeFlags.ELEMENT) {
          //  * 如果是 element 则处理 element,
          // element
          processElement(n1, n2, container, parentComponent)
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          // * 如果是 component 就处理 component
          // component
          processComponent(n1, n2, container, parentComponent)
        }
    }
  }

  function processComponent(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any
  ) {
    mountComponent(n2, container, parentComponent)
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
    effect(() => {
      if (!instance.isMounted) {
        // 初始化
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))

        // vNode -> component -> render -> patch
        // vNode -> element -> mountElement
        patch(null, subTree, container, instance)
        initialVNode.el = subTree
        // init 完成将标识位状态修改
        instance.isMounted = true
      } else {
        // 更新
        const { proxy } = instance
        // 取出当次的 subTree 和上一次的 subTree
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        patch(prevSubTree, subTree, container, instance)
        // 更新subTree 用于下一次 update
        instance.subTree = subTree
      }
    })
  }

  function processElement(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any
  ) {
    if (!n1)
      // 首次渲染
      mountElement(n2, container, parentComponent)
    // update
    else patchElement(n1, n2, container)
  }

  function patchElement(n1: any, n2: any, container: any) {
    console.log('n1', n1)
    console.log('n2', n2)
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
      patch(null, child, container, parentComponent)
    })
  }

  function processText(n1: any, n2: any, container: any) {
    const { children } = n2

    const textNode = document.createTextNode(children)
    container.appendChild(textNode)
  }

  function processFragment(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any
  ) {
    mountChildren(n2, container, parentComponent)
  }

  return {
    createApp: createAppAPI(render)
  }
}
