/*
 * @Date: 2022-08-15 18:00:41
 * @Author: 枫
 * @LastEditors: 枫
 * @description: parse 单元测试
 * @LastEditTime: 2022-08-16 15:20:42
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

  describe('element', () => {
    it('simple element div', () => {
      const ast = baseParse('<div></div>')

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: 'div'
      })
    })
  })

  describe('text', () => {
    it('simple text', () => {
      const ast = baseParse('some text')

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.TEXT,
        content: 'some text'
      })
    })
  })
})
