/*
 * @Date: 2022-06-29 20:17:44
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-05 16:44:24
 */
import {isReactive, reactive} from '../reactive'
describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 };
    const observed = reactive({ foo: 1 });
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
  })
})
