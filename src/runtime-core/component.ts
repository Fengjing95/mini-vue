/*
 * @Date: 2022-07-30 20:23:39
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 组件处理
 * @LastEditTime: 2022-08-04 20:55:14
 */
import { shallowReadonly } from '../reactivity/reactive'
import { emit } from './componentEmit'
import { initProps } from './componentProps'
import { publicInstanceProxyHandlers } from './componentPublicInstance'

export function createComponentInstance(vNode: any) {
  const component = {
    vNode,
    type: vNode.type,
    setupState: {},
    props: {},
    emit: (args: any): any => {}
  }

  component.emit = emit.bind(null, component)

  return component
}

export function setupComponent(instance: any) {
  // TODO
  initProps(instance, instance.vNode.props)
  // initSlots()

  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const Component = instance.vNode.type

  instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers)

  const { setup } = Component

  if (setup) {
    // function | object
    // function: 组件的 render 函数
    // object: 把 object 注入到上下文
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    })

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance: any, setupResult: any) {
  // TODO function
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type

  if (Component.render) {
    instance.render = Component.render
  }
}
