import { NodeTypes } from './ast'
import { TO_DISPLAY_STRING } from './runtimeHelpers'

/*
 * @Date: 2022-08-17 17:34:50
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 处理 ast 树
 * @LastEditTime: 2022-08-19 21:03:42
 */
export function transform(root: any, options: any = {}) {
  const context = createTransformContext(root, options)
  // 修改
  // 遍历--深度优先
  traverseNode(root, context)

  createRootCodegen(root)

  root.helpers = [...context.helpers.keys()]
}

function createRootCodegen(root: any) {
  let child = root.children[0]
  if (child.type === NodeTypes.ELEMENT && child.codegenNode) {
    root.codegenNode = child.codegenNode
  } else {
    root.codegenNode = child
  }
  // root.codegenNode = root.children[0]
}

function traverseNode(node: any, context: any) {
  const nodeTransforms = context.nodeTransforms
  const exitFns = []

  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i]
    const onExit = transform(node, context)
    if (onExit) {
      exitFns.push(onExit)
    }
  }

  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING)
      break
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context)
      break

    default:
      break
  }

  let i = exitFns.length
  while (i--) {
    exitFns[i]()
  }
}

function traverseChildren(node: any, context: any) {
  const children = node.children

  if (children) {
    // 递归遍历
    for (let i = 0; i < children.length; i++) {
      const node = children[i]
      traverseNode(node, context)
    }
  }
}

function createTransformContext(root: any, options: any) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(),
    helper(key: string) {
      context.helpers.set(key, 1)
    }
  }

  return context
}
