/*
 * @Date: 2022-08-19 17:29:16
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 处理复合类型(文本 + 插值)
 * @LastEditTime: 2022-08-19 21:40:30
 */
import { NodeTypes } from '../ast'
import { isText } from '../utils'

export function transformText(node: any) {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      const { children } = node

      let currentContainer

      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (isText(child)) {
          // 如果子节点是文本
          for (let j = i + 1; j < children.length; j++) {
            // 向后遍历
            const next = children[j]
            if (isText(next)) {
              // 如果后面还有文本节点
              if (!currentContainer) {
                // 没有容器, 初始化
                currentContainer = children[i] = {
                  type: NodeTypes.COMPOUND_EXPRESSION,
                  children: [child]
                }
              }

              currentContainer.children.push(' + ')
              currentContainer.children.push(next)
              children.splice(j--, 1)
            } else {
              // 如果下一个元素不是文本, 跳出循环, 初始化容器
              currentContainer = undefined
              break
            }
          }
        }
      }
    }
  }
}
