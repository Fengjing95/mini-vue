/*
 * @Date: 2022-08-17 22:27:19
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 代码生成
 * @LastEditTime: 2022-08-20 22:07:55
 */

import { isString } from '../../shared'
import { NodeTypes } from './ast'
import {
  CREATE_ELEMENT_VNODE,
  helperMapName,
  TO_DISPLAY_STRING
} from './runtimeHelpers'

export function generate(ast: any) {
  const context = createCodegenContext()
  const { push } = context

  genFunctionPreamble(ast, context)

  push('return ')

  const functionName = 'render'
  const args = ['_ctx', '_cache']
  const signature = args.join(', ')

  push(`function ${functionName}(${signature}) {`)

  push(`return `)
  genNode(context, ast.codegenNode)
  push('}')

  return { code: context.code }
}

function genFunctionPreamble(ast: any, context: any) {
  const VueBinging = 'Vue'
  const aliasHelpers = (s: symbol) =>
    `${helperMapName[s]} : _${helperMapName[s]}`

  // 生成 import 语句
  context.push(
    ast.helpers.length > 0
      ? `const { ${ast.helpers.map(aliasHelpers).join(', ')} } = ${VueBinging}
          
        `
      : ''
  )
}

// 根绝节点类型进行对应的代码生成
function genNode(context: any, node: any) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(context, node)
      break

    case NodeTypes.INTERPOLATION:
      genInterpolation(context, node)
      break

    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(context, node)
      break

    case NodeTypes.ELEMENT:
      genElement(context, node)
      break

    case NodeTypes.COMPOUND_EXPRESSION:
      genCompoundExpression(context, node)
      break

    default:
      break
  }
}

// 生成混合表达式代码: hi, {{message}}
function genCompoundExpression(context: any, node: any) {
  const children = node.children
  const { push } = context

  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (isString(child)) {
      // 如果是文本类型直接 push ('+')
      push(child)
    } else {
      genNode(context, child)
    }
  }
}

// 生成 DOM 元素代码
function genElement(context: any, node: any) {
  const { push, helper } = context
  const { tag, children, props } = node
  // console.log('genElement', children)
  // const child = children[0]

  push(`${helper(CREATE_ELEMENT_VNODE)}(`)
  // genNode(context, children)
  genNodeList(context, genNullable([tag, props, children]))
  push(')')
}

function genNodeList(context: any, nodes: any[]) {
  const { push } = context
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (isString(node)) {
      // 如果是文本类型,直接添加
      push(node)
    } else {
      // 否则 genNode
      genNode(context, node)
    }

    if (i < nodes.length - 1) {
      // 最后一个除外, 其余每个部分后面需要加逗号
      push(', ')
    }
  }
}

// 空值处理, 如果没有值返回字符串的 null
function genNullable(args: any[]) {
  return args.map(arg => arg || 'null')
}

// 生成表达式代码字符串
function genExpression(context: any, node: any) {
  const { push } = context
  push(`${node.content}`)
}

// 插值表达式代码
function genInterpolation(context: any, node: any) {
  const { push, helper } = context
  push(`${helper(TO_DISPLAY_STRING)}(`)
  genNode(context, node.content)
  push(')')
}

// 生成文本代码
function genText(context: any, node: any) {
  const { push } = context
  push(`'${node.content}'`)
}

// 创建 codegen 的上下文
function createCodegenContext() {
  const context = {
    code: '',
    // 追加 code
    push(source: string) {
      context.code += source
    },
    // 调用对应的渲染函数前加下划线
    helper(key: symbol) {
      return `_${helperMapName[key]}`
    }
  }

  return context
}
