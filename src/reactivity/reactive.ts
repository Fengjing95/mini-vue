/*
 * @Date: 2022-06-29 20:50:44
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-05 16:50:01
*/

import { mutableHandlers, readonlyHandlers } from './baseHandlers';

export function reactive<T extends object>(raw: T): T {
  return createActiveObject<T>(raw, mutableHandlers)
}

export function readonly<T extends object>(raw: T): Readonly<T> {
  return createActiveObject<Readonly<T>>(raw, readonlyHandlers)
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