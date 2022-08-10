/*
 * @Date: 2022-08-10 17:44:18
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-10 18:12:31
 */
import { h, ref } from '../../lib/guide-mini-vue.esm.js'

export default {
  name: 'ArrayToText',
  setup() {
    const isChange = ref(false)
    window.isChange = isChange

    return { isChange }
  },
  render() {
    const self = this

    const nextChildren = [
      h('div', {}, 'A'),
      h('div', {}, 'B'),
    ]
    const prevChildren = 'oldChildren'

    return self.isChange === true ?
      h('div', {}, nextChildren) :
      h('div', {}, prevChildren)
  }
}