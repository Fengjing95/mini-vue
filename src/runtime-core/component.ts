/*
 * @Date: 2022-07-30 20:23:39
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 组件处理
 * @LastEditTime: 2022-08-05 21:30:10
 */
import { shallowReadonly } from '../reactivity/reactive'
import { emit } from './componentEmit'
import { initProps } from './componentProps'
import { publicInstanceProxyHandlers } from './componentPublicInstance'
import { initSlots } from './componentSlots'

export function createComponentInstance(vNode: any) {
  const component = {
    vNode,
    type: vNode.type,
    setupState: {},
    props: {},
    slots: {},
    emit: (args: any): any => {}
  }

  component.emit = emit.bind(null, component)

  return component
}

export function setupComponent(instance: any) {
  initProps(instance, instance.vNode.props)
  initSlots(instance, instance.vNode.children)

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
