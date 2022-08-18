/*
 * @Date: 2022-08-15 18:05:45
 * @Author: 枫
 * @LastEditors: 枫
 * @description: parse
 * @LastEditTime: 2022-08-18 20:16:27
 */

import { NodeTypes } from './ast'

type ContextType = { source: string }

const enum TagType {
  TAG_START,
  TAG_END
}

export function baseParse(content: string) {
  const context = createParseContext(content)

  return createRoot(parseChildren(context, []))
}

function parseChildren(context: ContextType, ancestors: any[]) {
  const nodes = []

  while (!isEnd(context, ancestors)) {
    let node
    const s = context.source
    if (s.startsWith('{{')) {
      node = parseInterpolation(context)
    } else if (s[0] === '<') {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors)
      }
    }

    if (!node) {
      // 如果不是插值和 element
      node = parseText(context)
    }

    nodes.push(node)
  }
  return nodes
}

function isEnd(context: ContextType, ancestors: any[]) {
  // 遇到结束标签
  const s = context.source
  if (ancestors && s.startsWith('</')) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const tag = ancestors[i].tag
      if (startsWithEndTagOpen(s, tag)) {
        return true
      }
    }
  }

  // source 没有值
  return !s
}

function parseText(context: ContextType) {
  let endTokens = ['<', '{{']
  let endIndex = context.source.length

  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i])
    if (index !== -1 && endIndex > index) {
      endIndex = index
    }
  }

  const content = parseTextData(context, endIndex)
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

function parseElement(context: ContextType, ancestors: any[]) {
  // 解析 tag
  const element: any = parseTag(context, TagType.TAG_START)
  // 标签栈
  ancestors.push(element)
  element.children = parseChildren(context, ancestors)
  ancestors.pop()

  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.TAG_END)
  } else {
    throw new Error(`缺少闭合标签:${element.tag}`)
  }

  return element
}

function startsWithEndTagOpen(source: string, tag: string) {
  // 1. 头部 是不是以  </ 开头的
  // 2. 看看是不是和 tag 一样
  return (
    startsWith(source, '</') &&
    source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
  )
}

function startsWith(source: string, searchString: string): boolean {
  return source.startsWith(searchString)
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
  return { children, type: NodeTypes.ROOT }
}

function createParseContext(content: string): ContextType {
  return {
    source: content
  }
}
