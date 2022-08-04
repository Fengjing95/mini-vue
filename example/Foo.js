/*
* @Date: 2022-08-04 16:54:13
* @Author: 枫
 * @LastEditors: 枫
* @description: Foo组件
 * @LastEditTime: 2022-08-04 17:58:56
*/

import { h } from "../lib/guide-mini-vue.esm.js";
export const Foo = {
  setup(props) {
    console.log(props);
    // debugger
    props.count++
    console.log(props);
  },

  render() {
    return h('div', {}, 'foo: ' + this.count)
  }
}
