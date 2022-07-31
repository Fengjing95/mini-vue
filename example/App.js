/*
 * @Date: 2022-07-28 08:06:52
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-28 08:14:59
 */
export const App = {
  render() {
    return h('div', 'Hi, ' + this.msg)
  },
  setup() {
    // composition API
    return {
      msg: 'mini-vue',
    }
  }
}
