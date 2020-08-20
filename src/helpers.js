const { UNIQ_NAME_REG, BLACK_LIST } = require('./constants');
const HELPERS_V6 = require('./helpers_v6');
const HELPERS_V7 = require('./helpers_v7');

/**
 * @typedef {import('@babel/traverse').Node} BabelNode
 * @typedef {import('@babel/template').default} TemplateBuilder
 * @typedef {import('@babel/template').TemplateBuilderOptions} TemplateBuilderOptions
 * @typedef {import('@babel/types')} Types
 */

/**
 * 是否为 helper 名称
 * @param {string} name
 */
function isHelperDefined(name) {
  if (BLACK_LIST.has(name)) {
    return false;
  } else if (name in HELPERS_V7 || name in HELPERS_V6) {
    return true;
  }
  return false;
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

/**
 * 获取helper 名称，目前假设helper 都是以 _helper 形式命名的
 * 当用户代码和 helper 名称出现冲突时，可以会加上数字。这种情况我们不处理，因为概率比较低
 * @param {*} name
 */
function getHelperName(name) {
  // 通常都是以 _ 为前缀
  if (name[0] !== '_') {
    return null;
  }

  const normalized = name.slice(1);
  if (isHelperDefined(normalized)) {
    return normalized;
  }

  return null;
}

/**
 * @param {TemplateBuilder} factory
 * @param {string} template
 * @param {TemplateBuilderOptions} [options]
 */
function template2AST(factory, template, options) {
  if (typeof factory.ast === 'function') {
    return factory.ast(template);
  }
  return factory(template, options)();
}

/**
 * @type {{[name: string]: BabelNode}}
 */
const helperCacheV6 = {};

/**
 * 获取 v6 helper AST 节点
 * @param {string} name
 * @param {TemplateBuilder} template
 * @returns {BabelNode | null}
 */
function getHelperV6(name, template) {
  if (name in HELPERS_V6) {
    if (name in helperCacheV6) {
      return helperCacheV6[name];
    }

    // @ts-ignore
    const node = template2AST(template, HELPERS_V6[name]).expression;
    return (helperCacheV6[name] = node);
  }
  return null;
}

/**
 * @type {{[name: string]: {ast: BabelNode, deps: any[]}}}}
 */
const helperCacheV7 = {};

/**
 * 获取 v7 helper AST 节点
 * @param {string} name
 * @param {TemplateBuilder} template
 * @param {Types} t
 * @returns {{ast: BabelNode | undefined, deps: any[]} | null}
 */
function getHelperV7(name, template, t) {
  if (name in HELPERS_V7) {
    if (name in helperCacheV7) {
      return helperCacheV7[name];
    }

    try {
      // @ts-ignore
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
        // @ts-ignore
        ast,
        deps,
      });
    } catch (err) {
      return null;
    }
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
