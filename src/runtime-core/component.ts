/*
 * @Date: 2022-07-30 20:23:39
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 组件处理
 * @LastEditTime: 2022-08-20 21:12:13
 */
import { proxyRefs } from '../reactivity'
import { shallowReadonly } from '../reactivity/reactive'
import { emit } from './componentEmit'
import { initProps } from './componentProps'
import { publicInstanceProxyHandlers } from './componentPublicInstance'
import { initSlots } from './componentSlots'

export function createComponentInstance(vNode: any, parent: any) {
  // console.log(parent)

  const component = {
    vNode,
    type: vNode.type,
    setupState: {},
    props: {},
    slots: {},
    provides: parent?.provides || {},
    parent,
    emit: (args: any): any => {},
    isMounted: false,
    next: null as any
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
    setCurrentInstance(instance)
    // function | object
    // function: 组件的 render 函数
    // object: 把 object 注入到上下文
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    })
    setCurrentInstance(null)

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance: any, setupResult: any) {
  // TODO function
  if (typeof setupResult === 'object') {
    instance.setupState = proxyRefs(setupResult)
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type

  if (compiler && !Component.render) {
    if (Component.template) {
      Component.render = compiler(Component.template)
    }
  }

  if (Component.render) {
    instance.render = Component.render
  }
}

let currentInstance: any = null
export function getCurrentInstance() {
  return currentInstance
}

function setCurrentInstance(instance: any) {
  currentInstance = instance
}

let compiler: Function
export function registerRuntimeCompiler(_compiler: any) {
  compiler = _compiler
}
