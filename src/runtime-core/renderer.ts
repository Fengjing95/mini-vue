/*
 * @Date: 2022-07-30 20:18:41
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 渲染
 * @LastEditTime: 2022-08-14 22:20:40
 */
import { effect } from '../reactivity'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { shouldUpdateComponent } from './componentUpdateUtils'
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
    patch(null, vNode, container, null, null)
  }

  // n1 -> 旧的节点
  // n2 -> 新的节点
  function patch(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    // FIXME 是否如此解决
    if (!n2) return
    const { type, shapeFlags } = n2

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor)
        break

      case Text:
        processText(n1, n2, container)
        break

      default:
        // console.log(vNode.type);
        if (shapeFlags & ShapeFlags.ELEMENT) {
          //  * 如果是 element 则处理 element,
          // element
          processElement(n1, n2, container, parentComponent, anchor)
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          // * 如果是 component 就处理 component
          // component
          processComponent(n1, n2, container, parentComponent, anchor)
        }
    }
  }

  function processComponent(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    if (!n1) {
      // 没有老节点,新增
      mountComponent(n2, container, parentComponent, anchor)
    } else {
      // 有老节点, 更新
      updateComponent(n1, n2)
    }
  }

  function updateComponent(n1: any, n2: any) {
    // 获取组件实例, 并且保存袋虚拟节点
    const instance = (n2.component = n1.component)
    if (shouldUpdateComponent(n1, n2)) {
      instance.next = n2

      // 执行 effect runner
      instance.update()
    } else {
      // 组件不更新也要保存状态, 否则下次更新将会丢失
      n2.el = n1.el
      n2.vNode = n2
    }
  }

  function mountComponent(
    initialVNode: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    const instance = (initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent
    ))

    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container, anchor)
  }

  function setupRenderEffect(
    instance: any,
    initialVNode: any,
    container: any,
    anchor: any
  ) {
    instance.update = effect(() => {
      if (!instance.isMounted) {
        // 初始化
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))

        // vNode -> component -> render -> patch
        // vNode -> element -> mountElement
        patch(null, subTree, container, instance, anchor)
        initialVNode.el = subTree
        // init 完成将标识位状态修改
        instance.isMounted = true
      } else {
        const { next, vNode } = instance
        if (next) {
          next.el = vNode.el
          updateComponentPreRender(instance, next)
        }

        // 更新
        const { proxy } = instance
        // 取出当次的 subTree 和上一次的 subTree
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        patch(prevSubTree, subTree, container, instance, anchor)
        // 更新subTree 用于下一次 update
        instance.subTree = subTree
      }
    })
  }

  function updateComponentPreRender(instance: any, nextVNode: any) {
    instance.vNode = nextVNode
    instance.next = null

    instance.props = nextVNode.props
  }

  function processElement(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    if (!n1)
      // 首次渲染
      mountElement(n2, container, parentComponent, anchor)
    // update
    else patchElement(n1, n2, container, parentComponent, anchor)
  }

  function patchElement(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    // console.log('n1', n1)
    // console.log('n2', n2)

    // 比对 props 差异
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el)
    patchProps(el, oldProps, newProps)

    patchChildren(n1, n2, el, parentComponent, anchor)
  }

  function patchChildren(
    n1: any,
    n2: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    const prevShapeFlags = n1.shapeFlags
    const shapeFlags = n2.shapeFlags

    const c1 = n1.children
    const c2 = n2.children

    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      // 新值是 text 类型
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
      // 新值是 array
      if (prevShapeFlags & ShapeFlags.TEXT_CHILDREN) {
        // 原值是 text
        // 清空文本
        hostSetElementText(container, '')
        // mount children
        mountChildren(c2, container, parentComponent, anchor)
      } else {
        // 原值是 array
        patchKeyedChildren(c1, c2, container, parentComponent, anchor)
      }
    }
  }

  function patchKeyedChildren(
    c1: any,
    c2: any,
    container: any,
    parentComponent: any,
    parentAnchor: any
  ) {
    const l2 = c2.length
    let i = 0, // diff 指针
      e1 = c1.length - 1, // c1 尾部
      e2 = l2 - 1 // c2 尾部

    // 判断两个节点是否相同
    function isSameVNodeType(n1: any, n2: any) {
      // type & key
      return n1.type === n2.type && n1.key === n2.key
    }

    // 左侧对比
    while (i <= e1 && i <= e2) {
      // 指针不能超过最短的那个
      const n1 = c1[i],
        n2 = c2[i]

      if (isSameVNodeType(n1, n2)) {
        // 如果两个节点是同一个节点, patch 两个节点(props等可能发生变化)
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }

      i++
    }

    // 右侧对比
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1],
        n2 = c2[e2]

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }

      e1--
      e2--
    }

    // 新的比老的多, 需要创建
    if (i > e1) {
      // 老节点全部存在, e1 小于 i
      if (i <= e2) {
        const nextPos = e2 + 1
        const anchor = nextPos < l2 ? c2[nextPos].el : null
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor)
          i++
        }
      }
    } else if (i > e2) {
      // 老的比新的多, 删除
      while (i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
    } else {
      // 用于优化, 减少不必要的 patch
      const toBePatched = e2 - i + 1
      let patched = 0

      // 中间对比
      const keyToNewIndexMap = new Map()
      const newIndexToOldIndex = Array.from({ length: toBePatched }, _ => 0)

      // 记录移动
      let moved = false
      let maxNewIndexSoFar = 0

      // 使用 c2 建立 map
      for (let j = i; j <= e2; j++) {
        const nextChild = c2[j]
        keyToNewIndexMap.set(nextChild.key, j)
      }

      // 查找 c1 中的元素是否有用
      for (let k = i; k <= e1; k++) {
        const prevChild = c1[k]
        let newIndex: number

        if (patched >= toBePatched) {
          // 如果新元素的所有元素都已经找到后续元素可以直接删除
          hostRemove(prevChild.el)
          continue
        }

        // null | undefined
        if (prevChild.key != null) {
          // 如果有 key 就使用 key
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          // 没有 key 使用循环方案
          for (let l = i; l <= e2; l++) {
            if (isSameVNodeType(prevChild, c2[l])) {
              // 找到相同的节点记录新的 index, 跳出
              newIndex = l
              break
            }
          }
        }

        if (newIndex === undefined) {
          // 如果没有 newIndex 说明节点不存在了, 删除
          hostRemove(prevChild.el)
        } else {
          if (maxNewIndexSoFar <= newIndex) {
            maxNewIndexSoFar = newIndex
          } else {
            moved = true
          }

          newIndexToOldIndex[newIndex - i] = k + 1 // 减去前面比较过的部分
          // 如果找到了节点就进行比对
          patch(prevChild, c2[newIndex], container, parentComponent, null)
          patched++
        }
      }

      // 获取最长递增子序列
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndex)
        : []
      let j = increasingNewIndexSequence.length - 1

      // 倒序插入
      for (let p = toBePatched - 1; p >= 0; p--) {
        const nextIndex = p + i
        const nextChild = c2[nextIndex]
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null

        if (newIndexToOldIndex[p] === 0) {
          // 新增元素
          patch(null, nextChild, container, parentComponent, anchor)
        } else if (moved) {
          if (j < 0 || p !== increasingNewIndexSequence[j]) {
            // 如果递增序列已经消费完, 或者当前元素不是递增序列中的节点
            hostInsert(nextChild.el, container, anchor)
          } else {
            j--
          }
        }
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

  function mountElement(
    vNode: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    const el = (vNode.el = hostCreateElement(vNode.type))

    // 内容
    const { children, props, shapeFlags } = vNode

    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      // string
      el.textContent = children
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      // array
      mountChildren(children, el, parentComponent, anchor)
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
    hostInsert(el, container, anchor)
  }

  function mountChildren(
    children: any,
    container: any,
    parentComponent: any,
    anchor: any
  ) {
    children.forEach((child: any) => {
      patch(null, child, container, parentComponent, anchor)
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
    parentComponent: any,
    anchor: any
  ) {
    mountChildren(n2.children, container, parentComponent, anchor)
  }

  return {
    createApp: createAppAPI(render)
  }
}

// 查找最长递增子序列
function getSequence(arr: number[]): number[] {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
