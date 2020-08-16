// @ts-check
const {
  INTEROP_REQUIRE_DEFAULT,
  _INTEROP_REQUIRE_DEFAULT,
} = require('./constants');
const {
  isHelperDefined,
  getHelperV6,
  getHelperV7,
  normalizeName,
} = require('./helpers');
const { calcNodeSimilarity } = require('./utils');

/**
 *
 * @param {import('babel-core')} babel
 * @returns {import('babel-core').PluginObj<any>}
 */
module.exports = function (babel) {
  const { types: t, template } = babel;
  let isDebug = false;

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
   * @param {string} name
   * @param {import('babel-traverse').Node} node
   * @returns {{type: 'v6' | 'v7', name: string, deps?: any[]} | null}
   */
  function matchHelper(name, node) {
    const helperName = getHelperName(name);

    if (helperName) {
      const helperV6 = getHelperV6(helperName, template);
      if (helperV6) {
        const similarity = calcNodeSimilarity(helperV6, node, t);
        if (isDebug) {
          console.log(`v6 ${name} -> ${helperName} similarity: ${similarity}`);
        }
        if (similarity > 60) {
          return {
            type: 'v6',
            name: helperName,
          };
        }
      }

      const helperV7 = getHelperV7(helperName, template, t);
      if (helperV7) {
        const similarity = calcNodeSimilarity(helperV7.ast, node, t);
        if (isDebug) {
          console.log(`v7 ${name} -> ${helperName} similarity: ${similarity}`);
        }

        if (similarity > 60) {
          return {
            type: 'v7',
            name: helperName,
            deps: helperV7.deps,
          };
        }
      }
    }

    return null;
  }

  /**
   * 构造导入函数
   * @param {'v6' | 'v7'} type
   * @param {import('babel-traverse').NodePath} path
   * @param {string} name
   * @param {any} opt
   */
  function createRequirement(type, name, path, opt) {
    const {
      moduleNameV6 = 'babel-runtime',
      moduleNameV7 = '@babel/runtime',
    } = opt;
    const moduleName = type === 'v6' ? moduleNameV6 : moduleNameV7;

    // 导入 _interopRequireDefault
    if (!path.scope.hasBinding(_INTEROP_REQUIRE_DEFAULT)) {
      path.scope.push({
        id: t.Identifier(_INTEROP_REQUIRE_DEFAULT),
        init: getHelperV6(INTEROP_REQUIRE_DEFAULT, template),
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

  /**
   *
   * @param {import('babel-traverse').NodePath} path
   * @param {Array<[string, import('babel-traverse').Node]>} ids
   */
  function removeBindings(path, ids) {
    for (const [name, ast] of ids) {
      const binding = path.scope.getBinding(name);
      if (
        binding &&
        binding.path.node &&
        calcNodeSimilarity(ast, binding.path.node, t) > 60
      ) {
        binding.path.remove();
      }
    }
  }

  /**
   * 获取最近的指定类型的父节点
   * @param {import('babel-traverse').NodePath} path
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

  /**
   * 删除依赖的语句
   * @param {import('babel-traverse').NodePath} path
   * @param {import('babel-traverse').Node} dep
   */
  function removeDepsStatements(path, dep) {
    const binding = path.scope.getBinding(path.node.id.name);
    if (binding && binding.referencePaths.length) {
      binding.referencePaths.forEach((r) => {
        const closestPath = getClosestParentPath(r, dep.type);
        if (closestPath && calcNodeSimilarity(dep, closestPath.node, t) > 60) {
          closestPath.remove();
        }
      });
    }
  }

  /**
   * 移除 helper 导入的其他标识符，有可能这些标识符已经被改名了，不过没关系，
   * 因为这些依赖最后没有被任何代码引用，在代码压缩时会被移除
   * @param {import('babel-traverse').NodePath} path
   * @param {import('babel-traverse').Node[] | null} deps
   */
  function removeDeps(path, deps) {
    if (deps == null || deps.length === 0) {
      return;
    }
    const ids = [];
    for (const dep of deps) {
      if (t.isFunctionDeclaration(dep) && dep.id) {
        ids.push([dep.id.name, dep]);
      } else if (t.isVariableDeclaration(dep)) {
        dep.declarations.forEach((d) => {
          ids.push([d.id.name, d]);
        });
      } else {
        // 非函数声明或者变量声明，可以是条件语句
        // 通过变量绑定查找对应的语句，并删除
        removeDepsStatements(path, dep)
      }
    }

    if (ids.length) {
      removeBindings(path, ids);
    }
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
        const helper = matchHelper(name, path.node.init);

        if (helper) {
          // 移除依赖
          removeDeps(path, helper.deps);
          path.node.init = createRequirement(
            helper.type,
            helper.name,
            path,
            state.opts,
          );
        }
      },
      FunctionDeclaration(path, state) {
        const name = path.node.id.name;
        const helper = matchHelper(name, path.node);
        if (helper) {
          removeDeps(path, helper.deps);
          path.replaceWith(
            t.variableDeclaration('var', [
              t.variableDeclarator(
                t.Identifier(name),
                createRequirement(helper.type, helper.name, path, state.opts),
              ),
            ]),
          );
        }
      },
    },
  };
};
