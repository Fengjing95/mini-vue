import { generate } from '../src/codegen'
import { baseParse } from '../src/parse'
import { transform } from '../src/transform'
import { transformElement } from '../src/transforms/transformElement'
import { transformExpression } from '../src/transforms/transformExpression'
import { transformText } from '../src/transforms/transformText'

/*
 * @Date: 2022-08-17 22:24:22
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-19 21:04:22
 */
describe('codegen', () => {
  it('string', () => {
    const ast = baseParse('hi')
    transform(ast)
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })

  it('interpolation', () => {
    const ast = baseParse('{{message}}')
    transform(ast, {
      nodeTransforms: [transformExpression]
    })
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })

  it('element', () => {
    const ast: any = baseParse('<div>hi, {{message}}</div>')
    transform(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText]
    })

    const { code } = generate(ast)
    // console.log('ast======', JSON.stringify(ast))
    expect(code).toMatchSnapshot()
  })
})
