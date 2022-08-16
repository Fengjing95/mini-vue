/*
 * @Date: 2022-08-15 18:00:41
 * @Author: 枫
 * @LastEditors: 枫
 * @description: parse 单元测试
 * @LastEditTime: 2022-08-16 17:06:17
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
        tag: 'div',
        children: []
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

  test('hello world', () => {
    const ast = baseParse('<p>Hi, {{ message }}</p>')

    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: 'p',
      // tagType: ElementTypes.ELEMENT,
      children: [
        {
          type: NodeTypes.TEXT,
          content: 'Hi, '
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: 'message'
          }
        }
      ]
    })
  })

  test('next element', () => {
    const ast = baseParse('<div><p>Hi</p>{{ message }}</div>')

    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: 'div',
      // tagType: ElementTypes.ELEMENT,
      children: [
        {
          type: NodeTypes.ELEMENT,
          tag: 'p',
          children: [
            {
              type: NodeTypes.TEXT,
              content: 'Hi'
            }
          ]
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: 'message'
          }
        }
      ]
    })
  })

  test('should throw error', () => {
    expect(() => {
      baseParse('<div><span>/div>')
    }).toThrow('缺少闭合标签:span')
  })
})
