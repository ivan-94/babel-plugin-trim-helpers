const { UNIQ_NAME_REG, BLACK_LIST } = require('./constants');
const HELPERS_V6 = require('./helpers_v6');
const HELPERS_V7 = require('./helpers_v7');

/**
 * 是否为 helper 名称
 * @param {string} name
 */
function isHelperDefined(name) {
  if (BLACK_LIST.has(name)) {
    return false;
  } else if (name in HELPERS_V6 || name in HELPERS_V7) {
    return true;
  }
}

function getHelperName(name) {
  if (name[0] !== '_') {
    return null;
  }

  const normalized = normalizeName(name);
  if (isHelperDefined(normalized)) {
    return normalized;
  }

  return null;
}

/**
 * @param {import('babel-template')} factory
 * @param {string} template
 */
function template2AST(factory, template, options) {
  if (typeof factory.ast === 'function') {
    return factory.ast(template);
  }
  return factory(template, options)();
}

/**
 * @type {{[name: string]: import('babel-traverse').Node}}
 */
const helperCacheV6 = {};

/**
 * 获取 v6 helper AST 节点
 * @param {string} name
 * @param {import('babel-template')} template
 * @returns {import('babel-traverse').Node | null}
 */
function getHelperV6(name, template) {
  if (name in HELPERS_V6) {
    if (name in helperCacheV6) {
      return helperCacheV6[name];
    }
    const node = template2AST(template, HELPERS_V6[name]).expression;
    return (helperCacheV6[name] = node);
  }
  return null;
}

/**
 * @type {{[name: string]: {ast: import('babel-traverse').Node, deps: any[]}}}}
 */
const helperCacheV7 = {};

/**
 * 获取 v7 helper AST 节点
 * @param {string} name
 * @param {import('babel-template')} template
 * @param {import('babel-types')} t
 * @returns {{ast: import('babel-traverse').Node | null, deps: any[]} | null}
 */
function getHelperV7(name, template, t) {
  if (name in HELPERS_V7) {
    if (name in helperCacheV7) {
      return helperCacheV7[name];
    }

    try {
      const node = template2AST(template, HELPERS_V7[name], {
        sourceType: 'module',
      });
      const nodes = Array.isArray(node) ? node : [node];
      let ast,
        deps = [];

      for (const item of nodes) {
        // main helper
        if (t.isExportDefaultDeclaration(item)) {
          ast = item.declaration;
        } else if (!t.isImportDeclaration(item)) {
          deps.push(item);
        }
      }

      // 节点解析
      return (helperCacheV7[name] = {
        ast,
        deps,
      });
    } catch (err) {
      return null;
    }
  }

  return null;
}

/**
 * @param {string} name
 */
function normalizeName(name) {
  const matched = name.match(UNIQ_NAME_REG);
  if (matched) {
    return matched[1];
  }
  return null;
}

module.exports = {
  HELPERS_V6,
  HELPERS_V7,
  isHelperDefined,
  getHelperV6,
  getHelperV7,
  normalizeName,
  getHelperName,
};
