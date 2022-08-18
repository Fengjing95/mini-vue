/*
 * @Date: 2022-08-18 19:38:07
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 处理 ast 的插值表达式 simple 类型
 * @LastEditTime: 2022-08-18 20:22:23
 */
import { NodeTypes } from '../ast'

export function transformExpression(node: any) {
  if (node.type === NodeTypes.INTERPOLATION) {
    node.content = processExpression(node.content)
  }
}

function processExpression(node: any): any {
  node.content = `_ctx.${node.content}`
  return node
}
