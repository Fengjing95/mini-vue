/*
 * @Date: 2022-07-03 16:53:26
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-03 20:42:03
 */
// 继承属性
export const extend = Object.assign

// 是否为对象
export const isObject = (val: any) => val !== null && typeof val === 'object'

// 比较两个值是否发生变化
export const hasChange = (newValue: any, value: any) =>
  !Object.is(newValue, value)

// 判断是否为事件
export const isOn = (key: string) => {
  return /^on[A-Z]/.test(key)
}
