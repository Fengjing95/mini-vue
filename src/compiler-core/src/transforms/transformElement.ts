/*
 * @Date: 2022-08-19 13:53:10
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 处理 element
 * @LastEditTime: 2022-08-19 21:39:00
 */
import { createVNodeCall, NodeTypes } from '../ast'

export function transformElement(node: any, context: any) {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      // tag
      const vNodeTag = `'${node.tag}'`

      // props
      let vNodeProps

      // children
      let children = node.children
      let vNodeChildren = children[0]

      node.codegenNode = createVNodeCall(
        context,
        vNodeTag,
        vNodeProps,
        vNodeChildren
      )
    }
  }
}
