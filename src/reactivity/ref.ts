/*
 * @Date: 2022-07-18 20:53:42
 * @Author: 枫
 * @LastEditors: 枫
 * @description: ref
 * @LastEditTime: 2022-08-09 19:43:31
 */

import { hasChange, isObject } from '../shared'
import {
  isTracking,
  ReactiveEffect,
  trackEffects,
  triggerEffects
} from './effect'
import { reactive } from './reactive'

export class RefImpl<T> {
  private _value: T
  private _rawValue: T
  public dep: Set<ReactiveEffect>
  private __v_isRef = true

  constructor(value: any) {
    this._rawValue = value
    this._value = convert(value)
    this.dep = new Set()
  }
  get value() {
    // 收集依赖
    trackRefValue(this)
    return this._value
  }

  set value(newValue) {
    if (hasChange(newValue, this._rawValue)) {
      this._rawValue = newValue
      // 先修改 value 再触发依赖
      this._value = convert(newValue)
      triggerEffects(this.dep)
    }
  }
}

// 不同的 value 类型返回不同的值
function convert(value: any) {
  return isObject(value) ? reactive(value) : value
}

// 收集 ref 依赖
function trackRefValue(ref: RefImpl<unknown>) {
  if (isTracking()) trackEffects(ref.dep)
}

export function ref(value: any) {
  return new RefImpl(value)
}

export function isRef(value: any) {
  return !!value.__v_isRef
}

export function unRef(value: any) {
  return isRef(value) ? value.value : value
}

export function proxyRefs<T extends object>(objectWithRef: T): T {
  return new Proxy(objectWithRef, {
    get(target, key, receiver) {
      return unRef(Reflect.get(target, key, receiver))
    },
    set(target: Record<any, any>, key: string, newValue) {
      if (isRef(target[key]) && !isRef(newValue)) {
        // 如果原值是 ref 并且 newValue 不是 ref,  赋值给 .value,
        return (target[key].value = newValue)
      }
      // target[key] 是原始值,或者 newValue 是 ref 对象直接赋值
      return Reflect.set(target, key, newValue)
    }
  })
}
