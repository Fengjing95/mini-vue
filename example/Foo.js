/*
* @Date: 2022-08-04 16:54:13
* @Author: 枫
 * @LastEditors: 枫
* @description: Foo组件
 * @LastEditTime: 2022-08-04 21:19:45
*/

import { h } from "../lib/guide-mini-vue.esm.js";
export const Foo = {
  setup(props, { emit }) {

    function emitAdd() {
      console.log('emit add');
      emit('add', 2)
      emit('add-foo')
    }

    return { emitAdd }
  },

  render() {
    const btn = h('button', {
      onClick: this.emitAdd
    }, '+')
    const foo = h(
      'p',
      {},
      'foo count: ' + this.count
    )
    return h('div', {}, [btn, foo])
  }
}
