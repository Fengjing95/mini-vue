/*
 * @Date: 2022-06-29 20:50:44
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-10 13:18:19
*/

import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers';

export function reactive<T extends object>(raw: T): T {
  return createActiveObject<T>(raw, mutableHandlers)
}

export function readonly<T extends object>(raw: T): Readonly<T> {
  return createActiveObject<Readonly<T>>(raw, readonlyHandlers)
}

export function shallowReadonly<T extends object>(raw: T): Readonly<T> {
  return createActiveObject<Readonly<T>>(raw, shallowReadonlyHandlers)
}

function createActiveObject<T extends object>(raw: T, baseHandlers: any): T {
  return new Proxy(raw, baseHandlers);
}

export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export function isReactive(value: any) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value: any) {
  return !!value[ReactiveFlags.IS_READONLY]
}