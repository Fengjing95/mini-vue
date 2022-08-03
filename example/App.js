/*
 * @Date: 2022-07-28 08:06:52
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-03 20:45:14
 */
import { h } from '../lib/guide-mini-vue.esm.js';

window.self = null // 用于方便获取 app 实例
export const App = {
  render() {
    window.self = this

    return h('div',
      {
        id: 'root',
        class: ['bg'],
        onClick: (e) => {
          console.log('click');
        },
        onMouseenter: () => {
          console.log('enter');
        }
      },
      'Hi, ' + this.msg,
      // h('p', { class: ['green'] },
      //   [h('p', { class: ['red'] }, 'hi'), h('p', { class: ['green'] }, 'mini-vue')]
      // ),
    )
  },
  setup() {
    // composition API
    return {
      msg: 'mini-vue',
    }
  }
}
