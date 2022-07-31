import { createComponentInstance, setupComponent } from "./component"

/*
 * @Date: 2022-07-30 20:18:41
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 渲染
 * @LastEditTime: 2022-07-31 21:46:31
 */
export function render(vNode: any, container: any) {
  // patch 为了方便后续递归
  patch(vNode, container)
}


function patch(vNode: any, container: any) {
  // 处理组件
  // TODO 判断是不是 element, 如果是 element 则处理 element, 如果是 component 就处理 component
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

