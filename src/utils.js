const { IGNORE_PROPERTIES } = require('./constants');
/**
 * 规范化块作用域, 如果是单语句, 则单独拎出来比较
 * @param {import('babel-traverse').Node} node
 * @param {import('babel-types')} t
 */
function preNormalize(node, t) {
  if (t.isBlockStatement(node) && node.body.length === 1) {
    return node.body[0];
  }

  return node;
}

/**
 *
 * @param {import('babel-traverse').Node} node
 * @param {import('babel-types')} t
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
 * @param {import('babel-traverse').Node} a
 * @param {import('babel-traverse').Node} b
 * @param {import('babel-types')} t
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
 * 比较两个节点是否相等
 * @param {any} src
 * @param {any} obj
 * @param {import('babel-types')} t
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

  const keys = Object.keys(src);

  for (const key of keys) {
    if (key === 'type' || key[0] === '_' || IGNORE_PROPERTIES.has(key)) {
      continue;
    }
    if (!isNodeEqual(src[key], obj[key], t)) {
      return false;
    }
  }
  return true;
}

module.exports = {
  isNodeEqual,
};
