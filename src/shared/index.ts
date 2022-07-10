/*
 * @Date: 2022-07-03 16:53:26
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-10 12:47:47
 */
// 继承属性
export const extend = Object.assign

// 是否为对象
export const isObject = (val: any) => val !== null && typeof val === 'object'
