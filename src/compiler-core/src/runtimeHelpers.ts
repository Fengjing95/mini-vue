/*
 * @Date: 2022-08-18 20:23:40
 * @Author: 枫
 * @LastEditors: 枫
 * @description: helpers 常量
 * @LastEditTime: 2022-08-19 13:56:23
 */
export const TO_DISPLAY_STRING = Symbol('toDisplayString')

export const CREATE_ELEMENT_VNODE = Symbol('createElementVNode')

export const helperMapName: Record<symbol, string> = {
  [TO_DISPLAY_STRING]: 'toDisplayString',
  [CREATE_ELEMENT_VNODE]: 'createElementVNode'
}
