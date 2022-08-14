/*
 * @Date: 2022-08-14 21:15:14
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-14 21:25:14
 */
// 在 render 中使用 proxy 调用 emit 函数
// 也可以直接使用 this
// 验证 proxy 的实现逻辑
import { h, ref } from '../../lib/guide-mini-vue.esm.js'
import Child from "./Child.js";

export default {
  name: "App",
  setup() {
    const msg = ref("123");
    window.msg = msg

    const changeChildProps = () => {
      msg.value = "456";
    };

    const count = ref(1)

    const changeCount = () => {
      count.value++
    }

    return { msg, changeChildProps, count, changeCount };
  },

  render() {
    return h("div", {}, [
      h("div", {}, "你好"),
      h(
        "button",
        {
          onClick: this.changeChildProps,
        },
        "change child props"
      ),
      h(Child, {
        msg: this.msg,
      }),
      h('div', {}, 'count: ' + this.count),
      h('button', { onClick: this.changeCount }, 'count++')
    ]);
  },
};
