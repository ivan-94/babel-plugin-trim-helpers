// @ts-check
const {
  INTEROP_REQUIRE_DEFAULT,
  _INTEROP_REQUIRE_DEFAULT,
} = require('./constants');
const { isHelperDefined, getHelper, normalizeName } = require('./helpers');
const { calcNodeSimilarity } = require('./utils');

/**
 *
 * @param {import('babel-core')} babel
 * @returns {import('babel-core').PluginObj<any>}
 */
module.exports = function (babel) {
  const { types: t, template } = babel;
  let isDebug = false;

  function isHelperMaybe(name) {
    const normalized = normalizeName(name);
    if (isHelperDefined(normalized)) {
      return {
        name: normalized,
        binding: name,
      };
    }
    return null;
  }

  /**
   * @param {string} name
   * @param {import('babel-traverse').Node} node
   */
  function isHelper(name, node) {
    const info = isHelperMaybe(name);
    if (info) {
      const helper = getHelper(info.name, template);
      if (!helper) {
        return null;
      }

      const similarity = calcNodeSimilarity(helper, node, t);
      if (isDebug) {
        console.log(`${name} -> ${info.name} similarity: ${similarity}`);
      }
      if (similarity > 60) {
        return info;
      }
    }
    return null;
  }

  /**
   * 构造导入函数
   * @param {import('babel-traverse').NodePath} path
   * @param {string} name
   * @param {any} opt
   */
  function createRequirement(path, name, opt) {
    const { moduleName = 'babel-runtime' } = opt;

    // 导入 _interopRequireDefault
    if (!path.scope.hasBinding(_INTEROP_REQUIRE_DEFAULT)) {
      path.scope.push({
        id: t.Identifier(_INTEROP_REQUIRE_DEFAULT),
        init: getHelper(INTEROP_REQUIRE_DEFAULT, template),
      });
    }
    return t.memberExpression(
      t.callExpression(t.identifier(_INTEROP_REQUIRE_DEFAULT), [
        t.callExpression(t.identifier('require'), [
          t.stringLiteral(`${moduleName}/helpers/${name}`),
        ]),
      ]),
      t.identifier('default'),
    );
  }

  return {
    name: 'helper-trim', // not required
    pre(file) {
      if (this.opts.debug) {
        isDebug = true;
      }
    },
    visitor: {
      // var 导入
      VariableDeclarator(path, state) {
        const name = path.node.id.name;
        const helperInfo = isHelper(name, path.node.init);

        if (helperInfo) {
          path.node.init = createRequirement(path, helperInfo.name, state.opts);
        }
      },
      FunctionDeclaration(path, state) {
        const name = path.node.id.name;
        const helperInfo = isHelper(name, path.node);
        if (helperInfo) {
          path.replaceWith(
            t.variableDeclaration('var', [
              t.variableDeclarator(
                t.Identifier(name),
                createRequirement(path, helperInfo.name, state.opts),
              ),
            ]),
          );
        }
      },
    },
  };
};
