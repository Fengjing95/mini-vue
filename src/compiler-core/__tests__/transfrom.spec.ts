/*
 * @Date: 2022-08-17 17:31:51
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-17 18:14:32
 */
import { NodeTypes } from '../src/ast'
import { baseParse } from '../src/parse'
import { transform } from '../src/transform'

describe('transform', () => {
  it('happy path', () => {
    const ast = baseParse('<div>Hi, {{message}}</div>')
    const plugin = (node: any) => {
      if (node.type === NodeTypes.TEXT) {
        node.content += 'mini-vue'
      }
    }

    transform(ast, {
      nodeTransforms: [plugin]
    })

    const nextText = ast.children[0].children[0]

    expect(nextText.content).toBe('Hi, mini-vue')
  })
})
