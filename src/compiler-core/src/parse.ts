/*
 * @Date: 2022-08-15 18:05:45
 * @Author: 枫
 * @LastEditors: 枫
 * @description: parse
 * @LastEditTime: 2022-08-15 18:43:59
 */

import { NodeTypes } from './ast'

type ContextType = { source: string }

export function baseParse(content: string) {
  const context = createParseContext(content)

  return createRoot(parseChildren(context))
}

function parseChildren(context: ContextType) {
  const nodes = []

  let node
  if (context.source.startsWith('{{')) {
    node = parseInterpolation(context)
  }

  nodes.push(node)

  return nodes
}

function parseInterpolation(context: ContextType) {
  const openDelimiter = '{{'
  const closeDelimiter = '}}'

  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  ) // 闭合标识的索引
  advanceBy(context, openDelimiter.length) // 去除起始表示

  const rawContextLength = closeIndex - openDelimiter.length // 变量名长度
  const rawContent = context.source.slice(0, rawContextLength) // 取出变量名
  const content = rawContent.trim()

  advanceBy(context, rawContextLength + closeDelimiter.length) // 去掉整个插值表达式

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content
    }
  }
}

// 推进
function advanceBy(context: ContextType, length: number) {
  context.source = context.source.slice(length)
}

function createRoot(children: any) {
  return { children }
}

function createParseContext(content: string): ContextType {
  return {
    source: content
  }
}
