/*
 * @Date: 2022-08-17 22:27:19
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 代码生成
 * @LastEditTime: 2022-08-19 21:29:44
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

  push('export ')

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
  const VueBinging = 'vue'
  const aliasHelpers = (s: symbol) =>
    `${helperMapName[s]} as _${helperMapName[s]}`

  context.push(
    ast.helpers.length > 0
      ? `import { ${ast.helpers
          .map(aliasHelpers)
          .join(', ')} } from "${VueBinging}"\n`
      : ''
  )
}

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
      push(node)
    } else {
      genNode(context, node)
    }

    if (i < nodes.length - 1) {
      push(', ')
    }
  }
}

function genNullable(args: any[]) {
  return args.map(arg => arg || 'null')
}

function genExpression(context: any, node: any) {
  const { push } = context
  push(`${node.content}`)
}

function genInterpolation(context: any, node: any) {
  const { push, helper } = context
  push(`${helper(TO_DISPLAY_STRING)}(`)
  genNode(context, node.content)
  push(')')
}

function genText(context: any, node: any) {
  const { push } = context
  push(`'${node.content}'`)
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source: string) {
      context.code += source
    },
    helper(key: symbol) {
      return `_${helperMapName[key]}`
    }
  }

  return context
}
