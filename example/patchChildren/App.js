/*
 * @Date: 2022-08-10 16:42:50
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-10 17:32:37
 */
import { h } from '../../lib/guide-mini-vue.esm.js'
import ArrayToText from './ArrayToText.js'
import TextToText from './TextToText.js'
import TextToArray from './TextToArray.js'
import ArrayToArray from './ArrayToArray.js'

export default {
  name: 'App',
  setup() {

  },
  render() {
    return h('div', { tId: 1 }, [
      h('p', {}, '主页'),
      // h(ArrayToText),
      // h(TextToText),
      // h(TextToArray),
      h(ArrayToArray),
    ])
  }
}