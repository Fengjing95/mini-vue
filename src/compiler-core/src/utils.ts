/*
 * @Date: 2022-08-19 21:39:29
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 工具函数
 * @LastEditTime: 2022-08-19 21:39:30
 */

import { NodeTypes } from './ast'

// 是否为文本或者插值
export function isText(node: any): boolean {
  return node.type === NodeTypes.TEXT || node.type === NodeTypes.INTERPOLATION
}
