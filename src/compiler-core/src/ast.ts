import { CREATE_ELEMENT_VNODE } from './runtimeHelpers'

/*
 * @Date: 2022-08-15 18:34:26
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-08-19 21:39:03
 */
export const enum NodeTypes {
  INTERPOLATION,
  SIMPLE_EXPRESSION,
  ELEMENT,
  TEXT,
  ROOT,
  COMPOUND_EXPRESSION
}

export function createVNodeCall(
  context: any,
  tag: any,
  props: any,
  children: any
) {
  context.helper(CREATE_ELEMENT_VNODE)
  return { type: NodeTypes.ELEMENT, tag, props, children }
}
