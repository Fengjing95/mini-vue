/*
 * @Date: 2022-08-15 18:05:45
 * @Author: 枫
 * @LastEditors: 枫
 * @description: parse
 * @LastEditTime: 2022-08-16 15:28:38
 */

import { NodeTypes } from './ast'

type ContextType = { source: string }

const enum TagType {
  TAG_START,
  TAG_END
}

export function baseParse(content: string) {
  const context = createParseContext(content)

  return createRoot(parseChildren(context))
}

function parseChildren(context: ContextType) {
  const nodes = []

  let node
  const s = context.source
  if (s.startsWith('{{')) {
    node = parseInterpolation(context)
  } else if (s[0] === '<') {
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context)
    }
  }

  if (!node) {
    // 如果不是插值和 element
    node = parseText(context)
  }

  nodes.push(node)

  return nodes
}

function parseText(context: ContextType) {
  const content = parseTextData(context, context.source.length)
  return {
    type: NodeTypes.TEXT,
    content
  }
}

function parseTextData(context: ContextType, length: number) {
  // 获取 content
  const content = context.source.slice(0, length)

  // 推进
  advanceBy(context, content.length)
  return content
}

function parseElement(context: ContextType) {
  // 解析 tag
  const element = parseTag(context, TagType.TAG_START)
  parseTag(context, TagType.TAG_END)

  return element
}

function parseTag(context: ContextType, type: TagType) {
  // 匹配标签
  // /<(\w+)[^>]*>(.*?<\/\1>)?/
  const match = /^<(\/?[a-z]*)/i.exec(context.source)
  const tag = match[1]

  // 删除解析完的代码
  advanceBy(context, match[0].length)
  advanceBy(context, 1)

  if (type === TagType.TAG_END) {
    return
  }
  return {
    type: NodeTypes.ELEMENT,
    tag
  }
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
  // const rawContent = context.source.slice(0, rawContextLength) // 取出变量名
  const rawContent = parseTextData(context, rawContextLength)
  const content = rawContent.trim()

  advanceBy(context, closeDelimiter.length) // 去掉整个插值表达式

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
