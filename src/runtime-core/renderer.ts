/*
 * @Date: 2022-07-30 20:18:41
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 渲染
 * @LastEditTime: 2022-08-10 18:12:28
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
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
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
        processFragment(n1, n2, container, parentComponent)
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
    else patchElement(n1, n2, container, parentComponent)
  }

  function patchElement(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any
  ) {
    console.log('n1', n1)
    console.log('n2', n2)

    // 比对 props 差异
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el)
    patchProps(el, oldProps, newProps)

    patchChildren(n1, n2, el, parentComponent)
  }

  function patchChildren(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any
  ) {
    const prevShapeFlags = n1.shapeFlags
    const shapeFlags = n2.shapeFlags

    const c1 = n1.children
    const c2 = n2.children

    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      // 原值是 text 类型
      if (prevShapeFlags & ShapeFlags.ARRAY_CHILDREN) {
        // array -> text
        // 1 把老的children 清除;
        unmountChildren(n1.children)
        // 当 array -> text 时, c1 一定不等于 c2,所以可以省略
        // // 2 设置 text
        // hostSetElementText(container, c2)
      }
      // else {
      if (c1 !== c2) {
        hostSetElementText(container, c2)
      }
      // }
    } else {
      // 原值是 array
      if (prevShapeFlags & ShapeFlags.TEXT_CHILDREN) {
        // 清空文本
        hostSetElementText(container, '')
        // mount children
        mountChildren(c2, container, parentComponent)
      }
    }
  }

  function unmountChildren(children: any) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el
      // remove
      hostRemove(el)
    }
  }

  // 空对象, {} !== {} 恒为 true
  const EMPTY_OBJ = {}

  function patchProps(el: any, oldProps: any, newProps: any) {
    if (oldProps !== newProps) {
      // props 是否变化或者是否为 undefined 的情况
      for (const key in newProps) {
        const prevProp = oldProps[key]
        const nextProp = newProps[key]

        if (prevProp !== nextProp) {
          hostPatchProps(el, key, prevProp, nextProp)
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        // props 消失的情况
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProps(el, key, oldProps[key], null)
          }
        }
      }
    }
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
      hostPatchProps(el, key, null, val)
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
    mountChildren(n2.children, container, parentComponent)
  }

  return {
    createApp: createAppAPI(render)
  }
}
