/*
 * @Date: 2022-08-14 21:15:14
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-14 21:18:24
 */
import { h, ref, reactive } from '../../lib/guide-mini-vue.esm.js'
export default {
  name: "Child",
  setup(props, { emit }) { },
  render(proxy) {
    return h("div", {}, [h("div", {}, "child" + this.$props.msg)]);
  },
};
