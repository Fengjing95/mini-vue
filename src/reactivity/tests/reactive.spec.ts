/*
 * @Date: 2022-06-29 20:17:44
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-29 20:51:42
 */
import {reactive} from '../reactive'
describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 };
    const observed = reactive({ foo: 1 });
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);

  })
})
