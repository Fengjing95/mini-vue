/*
 * @Date: 2022-08-17 22:27:19
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 代码生成
 * @LastEditTime: 2022-08-18 20:34:28
 */

import { NodeTypes } from './ast'
import { helperMapName, TO_DISPLAY_STRING } from './runtimeHelpers'

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

    default:
      break
  }
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
