/*
 * @Date: 2022-08-15 18:00:41
 * @Author: 枫
 * @LastEditors: 枫
 * @description: parse 单元测试
 * @LastEditTime: 2022-08-15 18:41:03
 */
import { NodeTypes } from '../src/ast'
import { baseParse } from '../src/parse'

describe('parse', () => {
  describe('interpolation', () => {
    test('simple interpolation', () => {
      const ast = baseParse('{{ message }}')

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: 'message'
        }
      })
    })
  })
})
