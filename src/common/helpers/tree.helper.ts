// src/common/helpers/tree.helper.ts
import { Injectable } from '@nestjs/common';

export interface TreeNode {
  id: number | string;
  parentId?: number | string | null;
  children?: TreeNode[];
  [key: string]: any;
}

@Injectable()
export class TreeHelper {
  /**
   * 数组转树形结构
   * @param items 平铺数组
   * @param parentId 父节点ID
   * @param options 配置项
   */
  arrayToTree<T extends TreeNode>(
    items: T[],
    parentId: number | string | null = null,
    options: {
      idKey?: string;
      parentKey?: string;
      childrenKey?: string;
    } = {},
  ): T[] {
    const { idKey = 'id', parentKey = 'parentId', childrenKey = 'children' } = options;

    return items
      .filter((item) => item[parentKey] === parentId)
      .map((item) => ({
        ...item,
        [childrenKey]: this.arrayToTree(items, item[idKey], options),
      }));
  }

  /**
   * 树形结构转数组
   */
  treeToArray<T extends TreeNode>(
    tree: T[],
    childrenKey = 'children',
  ): Omit<T, 'children'>[] {
    const result: Omit<T, 'children'>[] = [];

    const flatten = (nodes: T[]) => {
      nodes.forEach((node) => {
        const { [childrenKey]: children, ...rest } = node;
        result.push(rest as Omit<T, 'children'>);
        if (children && children.length > 0) {
          flatten(children as T[]);
        }
      });
    };

    flatten(tree);
    return result;
  }

  /**
   * 查找节点
   */
  findNode<T extends TreeNode>(
    tree: T[],
    predicate: (node: T) => boolean,
    childrenKey = 'children',
  ): T | null {
    for (const node of tree) {
      if (predicate(node)) {
        return node;
      }
      const children = node[childrenKey] as T[] | undefined;
      if (children && children.length > 0) {
        const found = this.findNode(children, predicate, childrenKey);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * 查找节点路径
   */
  findPath<T extends TreeNode>(
    tree: T[],
    predicate: (node: T) => boolean,
    childrenKey = 'children',
  ): T[] | null {
    const path: T[] = [];

    const find = (nodes: T[]): boolean => {
      for (const node of nodes) {
        path.push(node);
        if (predicate(node)) {
          return true;
        }
        const children = node[childrenKey] as T[] | undefined;
        if (children && children.length > 0 && find(children)) {
          return true;
        }
        path.pop();
      }
      return false;
    };

    return find(tree) ? path : null;
  }

  /**
   * 过滤树节点
   */
  filterTree<T extends TreeNode>(
    tree: T[],
    predicate: (node: T) => boolean,
    childrenKey = 'children',
  ): T[] {
    return tree
      .filter(predicate)
      .map((node) => {
        const children = node[childrenKey] as T[] | undefined;
        if (children && children.length > 0) {
          return {
            ...node,
            [childrenKey]: this.filterTree(children, predicate, childrenKey),
          };
        }
        return node;
      });
  }

  /**
   * 遍历树节点
   */
  traverseTree<T extends TreeNode>(
    tree: T[],
    callback: (node: T, level: number) => void,
    level = 0,
    childrenKey = 'children',
  ): void {
    tree.forEach((node) => {
      callback(node, level);
      const children = node[childrenKey] as T[] | undefined;
      if (children && children.length > 0) {
        this.traverseTree(children, callback, level + 1, childrenKey);
      }
    });
  }
}
