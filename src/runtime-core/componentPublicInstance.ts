/*
 * @Date: 2022-08-02 21:01:29
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-02 21:11:27
 */

const publicPropertiesMap: Record<string | symbol, (i: any) => any> = {
  $el: (i: any) => i.vNode.el
}

export const publicInstanceProxyHandlers = {
  get({ _: instance }: { _: any }, key: string | symbol) {
    const { setupState } = instance
    if (key in setupState) {
      // setup 中返回的属性
      return setupState[key]
    }

    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      return publicGetter(instance)
    }
  }
}
