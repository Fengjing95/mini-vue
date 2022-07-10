import { isReadonly, shallowReadonly } from "../reactive"

/*
 * @Date: 2022-07-10 13:06:03
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-10 13:27:05
 */
describe('shallowReadonly', () => {
  it('should not make non-reactive properties reactive', () => {
    const props = shallowReadonly({ n: { foo: 1 } })

    expect(isReadonly(props)).toBe(true)
    expect(isReadonly(props.n)).toBe(false)
  })

  it("warn when set", () => {
    console.warn = jest.fn()

    const user = shallowReadonly({
      age: 10
    })

    // @ts-expect-error
    user.age = 11
    expect(console.warn).toBeCalled()
  })
})
