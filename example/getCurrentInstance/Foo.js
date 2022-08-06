/*
* @Date: 2022-08-04 16:54:13
* @Author: 枫
 * @LastEditors: 枫
* @description: Foo组件
 * @LastEditTime: 2022-08-06 23:14:01
*/

import { h, renderSlots, getCurrentInstance } from "../../lib/guide-mini-vue.esm.js";
export const Foo = {
  setup() {
    const instance = getCurrentInstance()
    console.log('Foo: ', instance);
    return {}
  },
  name: "Foo",
  render() {
    return h('div', {}, 'foo')
  }
}
