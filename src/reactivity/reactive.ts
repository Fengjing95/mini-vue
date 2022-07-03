/*
 * @Date: 2022-06-29 20:50:44
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-03 23:13:48
*/

import { mutableHandlers, readonlyHandlers } from './baseHandlers';
import { track, trigger } from "./effect";

export function reactive<T extends object>(raw: T): T {
  return createActiveObject<T>(raw, mutableHandlers)
}

export function readonly<T extends object>(raw: T): Readonly<T> {
  return createActiveObject<Readonly<T>>(raw, readonlyHandlers)
}

function createActiveObject<T extends object>(raw: T, baseHandlers: any): T {
  return new Proxy(raw, baseHandlers);
}