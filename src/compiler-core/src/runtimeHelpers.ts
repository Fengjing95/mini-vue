/*
 * @Date: 2022-08-18 20:23:40
 * @Author: 枫
 * @LastEditors: 枫
 * @description: helpers 常量
 * @LastEditTime: 2022-08-18 20:27:50
 */
export const TO_DISPLAY_STRING = Symbol('toDisplayString')

export const helperMapName: Record<symbol, string> = {
  [TO_DISPLAY_STRING]: 'toDisplayString'
}
