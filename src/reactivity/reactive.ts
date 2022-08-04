/*
 * @Date: 2022-06-29 20:50:44
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-04 18:04:50
 */

import { isObject } from '../shared'
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers
} from './baseHandlers'

export function reactive<T extends object>(raw: T): T {
  return createReactiveObject<T>(raw, mutableHandlers)
}

export function readonly<T extends object>(raw: T): Readonly<T> {
  return createReactiveObject<Readonly<T>>(raw, readonlyHandlers)
}

export function shallowReadonly<T extends object>(raw: T): Readonly<T> {
  return createReactiveObject<Readonly<T>>(raw, shallowReadonlyHandlers)
}

export function isProxy(value: unknown) {
  return isReadonly(value) || isReactive(value)
}

function createReactiveObject<T extends object>(
  target: T,
  baseHandlers: any
): T {
  if (!isObject(target)) {
    console.warn(`target ${target} must be an object`)
    return target
  }
  return new Proxy(target, baseHandlers)
}

export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

export function isReactive(value: any) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value: any) {
  return !!value[ReactiveFlags.IS_READONLY]
}
