import { createComponentInstance, setupComponent } from "./component"

/*
 * @Date: 2022-07-30 20:18:41
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-30 20:56:24
 */
export function render(vNode: any, container: any) {
  // patch 为了方便后续递归
  patch(vNode, container)
}


function patch(vNode: any, container: any) {
  // 处理组件
  // 判断是不是 element
  processComponent(vNode, container)
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

