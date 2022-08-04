/*
 * @Date: 2022-08-04 20:05:35
 * @Author: 枫
 * @LastEditors: 枫
 * @description: emit 事件
 * @LastEditTime: 2022-08-04 21:23:34
 */
import { camelize, toHandlerKey } from '../shared'

export function emit(instance: any, eventName: string, ...args: any[]) {
  const { props } = instance

  const handler = props[toHandlerKey(camelize(eventName))]

  handler && handler(...args)
}
