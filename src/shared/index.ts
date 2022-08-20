/*
 * @Date: 2022-07-03 16:53:26
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 工具方法
 * @LastEditTime: 2022-08-20 21:57:23
 */
export * from './toDisplayString'
// 继承属性
export const extend = Object.assign

// 是否为对象
export const isObject = (val: any) => val !== null && typeof val === 'object'

// 是否为字符串
export const isString = (value: any) => typeof value === 'string'

// 比较两个值是否发生变化
export const hasChange = (newValue: any, value: any) =>
  !Object.is(newValue, value)

// 判断是否为事件
export const isOn = (key: string) => {
  return /^on[A-Z]/.test(key)
}

// 检查制定对象上是否有 key
export const hasOwn = (target: any, key: string | symbol) =>
  Object.prototype.hasOwnProperty.call(target, key)

// 首字母转为大写
export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

// 转为事件命名
export const toHandlerKey = (str: string) => (str ? 'on' + capitalize(str) : '')

// 转驼峰命名
export const camelize = (str: string) =>
  str.replace(/-(\w)/g, (_, c: string) => c.toUpperCase() || '')
