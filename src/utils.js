const { IGNORE_PROPERTIES } = require('./constants');

/**
 * @typedef {import('@babel/traverse').Node} BabelNode
 * @typedef {import('@babel/traverse').NodePath} BabelNodePath
 * @typedef {import('@babel/types')} Types
 */

/**
 * 规范化块作用域, 如果是单语句, 则单独拎出来比较
 * @param {BabelNode} node
 * @param {Types} t
 */
function preNormalize(node, t) {
  if (t.isBlockStatement(node) && node.body.length === 1) {
    return node.body[0];
  }

  return node;
}

/**
 *
 * @param {BabelNode} node
 * @param {Types} t
 */
function postNormalize(node, t) {
  // 如果是函数，则忽略 id 的比较
  if (t.isFunction(node)) {
    return { ...node, id: null };
  }
  return node;
}

/**
 *
 * @param {BabelNode} a
 * @param {BabelNode} b
 * @param {Types} t
 */
function isSameType(a, b, t) {
  if (a.type === b.type) {
    return true;
  } else if (t.isFunction(a) && t.isFunction(b)) {
    return true;
  }

  return false;
}

/**
 * 计算两个节点的相似度
 * @param {any} src
 * @param {any} obj
 * @param {Types} t
 */
function calcNodeSimilarity(src, obj, t) {
  if (src === obj) {
    return 100;
  } else if (src == null && obj != null) {
    return 0;
  } else if (obj == null && src != null) {
    return 0;
  } else if (obj == null && obj == null) {
    return 100;
  } else if (typeof src !== typeof obj) {
    return 0;
  } else if (Array.isArray(src) && Array.isArray(obj)) {
    if (src.length !== obj.length) {
      return 0;
    } else if (src.length === 0) {
      return 100;
    }

    const length = getNodeCounts(src) - 1;
    let sum = 0;

    for (let i = 0; i < src.length; i++) {
      const similarity = calcNodeSimilarity(src[i], obj[i], t);
      const ratio = similarity && 100 * (getNodeCounts(src[i]) / length);
      sum += ratio * (similarity / 100);
    }

    return sum;
  } else if (typeof src !== 'object') {
    return src === obj ? 100 : 0;
  }

  src = preNormalize(src, t);
  obj = preNormalize(obj, t);

  if (!isSameType(src, obj, t)) {
    return 0;
  }

  const keys = getNodeKeys(src);
  const length = getNodeCounts(src) - 1;
  let sum = 0;

  for (const key of keys) {
    const similarity = calcNodeSimilarity(src[key], obj[key], t);
    const ratio = similarity && 100 * (getNodeCounts(src[key]) / length);
    sum += ratio * (similarity / 100);
  }
  return sum;
}

/**
 * @param {BabelNode} node
 */
function getNodeKeys(node) {
  return Object.keys(node).filter((key) => {
    return !(key === 'type' || key[0] === '_' || IGNORE_PROPERTIES.has(key));
  });
}

/**
 * 获取节点数量，包含自身
 * @param {any} node
 * @returns {number}
 */
function getNodeCounts(node) {
  if (node && typeof node === 'object') {
    if (node.__length) {
      return node.__length;
    }

    if (Array.isArray(node)) {
      // @ts-ignore
      return (node.__length = node.reduce((sum, cur) => {
        return sum + getNodeCounts(cur);
      }, 1));
    }
    const keys = getNodeKeys(node);
    return (node.__length = keys.reduce((sum, cur) => {
      return sum + getNodeCounts(node[cur]);
    }, 1));
  }

  return 1;
}

/**
 * 比较两个节点是否相等
 * @deprecated
 * @param {any} src
 * @param {any} obj
 * @param {Types} t
 */
function isNodeEqual(src, obj, t) {
  if (src === obj) {
    return true;
  } else if (src == null && obj != null) {
    return false;
  } else if (obj == null && src != null) {
    return false;
  } else if (obj == null && obj == null) {
    return true;
  } else if (typeof src !== typeof obj) {
    return false;
  } else if (Array.isArray(src) && Array.isArray(obj)) {
    if (src.length !== obj.length) {
      return false;
    }

    for (let i = 0; i < src.length; i++) {
      if (!isNodeEqual(src[i], obj[i], t)) {
        return false;
      }
    }

    return true;
  } else if (typeof src !== 'object') {
    return src === obj;
  }

  src = preNormalize(src, t);
  obj = preNormalize(obj, t);

  if (!isSameType(src, obj, t)) {
    return false;
  }

  src = postNormalize(src, t);
  obj = postNormalize(obj, t);

  const keys = getNodeKeys(src);

  for (const key of keys) {
    if (!isNodeEqual(src[key], obj[key], t)) {
      return false;
    }
  }
  return true;
}
/**
 * 获取最近的指定类型的父节点
 * @param {BabelNodePath} path
 * @param {string} type
 * @param {number} maxDepth 最多层数
 */
function getClosestParentPath(path, type, maxDepth = 8) {
  while (maxDepth-- && path && path.node) {
    if (path.node && path.node.type === type) {
      return path;
    }
    path = path.parentPath;
  }

  return null;
}

module.exports = {
  isNodeEqual,
  calcNodeSimilarity,
  getClosestParentPath,
};
