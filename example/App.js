/*
 * @Date: 2022-07-28 08:06:52
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-01 16:34:23
 */
import { h } from '../lib/guide-mini-vue.esm.js';

export const App = {
  render() {
    return h('div',
      {
        id: 'root',
        class: ['bg'],
      },
      // 'Hi, ' + this.msg, 
      h('p', { class: ['green'] },
        [h('p', { class: ['red'] }, 'hi'), h('p', { class: ['green'] }, 'mini-vue')]
      ),
    )
  },
  setup() {
    // composition API
    return {
      msg: 'mini-vue',
    }
  }
}
