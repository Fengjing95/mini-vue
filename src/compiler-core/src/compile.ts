/*
 * @Date: 2022-08-20 18:48:52
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 模板编译
 * @LastEditTime: 2022-08-20 20:55:26
 */

import { generate } from './codegen'
import { baseParse } from './parse'
import { transform } from './transform'
import { transformElement } from './transforms/transformElement'
import { transformExpression } from './transforms/transformExpression'
import { transformText } from './transforms/transformText'

export function baseCompile(template: string) {
  const ast: any = baseParse(template)
  transform(ast, {
    nodeTransforms: [transformExpression, transformElement, transformText]
  })

  return generate(ast)
}
