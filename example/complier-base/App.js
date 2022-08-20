/*
 * @Date: 2022-08-20 18:45:57
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-20 22:10:31
 */
import { ref } from '../../lib/guide-mini-vue.esm.js'

export default {
  name: 'App',
  template: '<div>hi, {{message}}</div>',
  setup() {
    const message = window.message = ref('mini-vue')
    return { message }
  }
}
