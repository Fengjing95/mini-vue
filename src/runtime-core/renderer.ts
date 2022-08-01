import { isObject } from "../shared";
import { createComponentInstance, setupComponent } from "./component"

/*
 * @Date: 2022-07-30 20:18:41
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 渲染
 * @LastEditTime: 2022-08-01 16:32:54
 */
export function render(vNode: any, container: any) {
  // patch 为了方便后续递归
  patch(vNode, container)
}


function patch(vNode: any, container: any) {
  /*
  * 处理组件
  * 判断是不是 element, 
  * 如果是 element 则处理 element, 
  * 如果是 component 就处理 component
  */
  // console.log(vNode.type);
  if (typeof vNode.type === 'string') {
    // element
    processElement(vNode, container)
  } else if (isObject(vNode.type)) {
    // component
    processComponent(vNode, container)
  }
  
}


function processComponent(vNode: any, container: any) {
  mountComponent(vNode, container)
}

function mountComponent(vNode: any, container: any) {
  const instance = createComponentInstance(vNode)

  setupComponent(instance)
  setupRenderEffect(instance, container)
}


function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render()

  // vNode -> patch
  // vNode -> element -> mountElement
  patch(subTree, container)
}

function processElement(vNode: any, container: any) {
  mountElement(vNode, container)
}

function mountElement(vNode: any, container: any) {
  const el = document.createElement(vNode.type)

  // 内容
  const {children, props} = vNode

  if (typeof children === 'string') {
    // string
    el.textContent = children
  } else if (Array.isArray(children)) {
    // array
    children.forEach(child => {
      patch(child, el)
    })
  } else {
    // vnode
    patch(children, el)
  }

  // props
  for (let key in props) {
    const val = props[key]
    el.setAttribute(key, val)
  }

  container.appendChild(el)
}

