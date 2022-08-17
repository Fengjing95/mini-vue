/*
 * @Date: 2022-08-17 17:34:50
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 处理 ast 树
 * @LastEditTime: 2022-08-17 18:15:29
 */
export function transform(root: any, options: any) {
  const context = createTransformContext(root, options)
  // 遍历--深度优先
  traverseNode(root, context)
  // 修改
}

function traverseNode(node: any, context: any) {
  const nodeTransforms = context.nodeTransforms
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i]
    transform(node)
  }

  traverseChildren(node, context)
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
    nodeTransforms: options.nodeTransforms || []
  }

  return context
}