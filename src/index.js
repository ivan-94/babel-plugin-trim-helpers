const { INTEROP_REQUIRE_DEFAULT, _INTEROP_REQUIRE_DEFAULT, V6_MODULE_NAME, V7_MODULE_NAME } = require('./constants');
const { getHelperV6, getHelperV7, getHelperName } = require('./helpers');
const { calcNodeSimilarity, getClosestParentPath } = require('./utils');

/**
 * @template T
 * @typedef {import('@babel/traverse').NodePath<T>} GBabelNodePath
 */

/**
 * @typedef {import('@babel/traverse').Node} BabelNode
 * @typedef {import('@babel/traverse').NodePath} BabelNodePath
 * @typedef {import('@babel/types').Identifier} BabelIdentifier
 * @typedef {import('@babel/types').FunctionExpression} BabelFunctionExpression
 *
 * @typedef {{type: 'v6' | 'v7', name: string, deps?: any[]}} HelperInfo
 *
 * @typedef {{
 *  moduleNameV6: string // babel v6 runtime name
 *  moduleNameV7: string // babel v7 runtime name
 *  preferV7: boolean    // 优先按照 v7 helper 识别
 *  debug?: boolean
 * }} PluginOptions 插件配置项
 *
 * @typedef {{
 *  opts: Partial<PluginOptions>
 *  helperVersion?: number
 *  preferV7?: boolean
 *  ambiguity?: boolean
 * }} State
 */

/**
 *
 * @param {import('@babel/core')} babel
 * @returns {import('@babel/core').PluginObj<State>}
 */
module.exports = function (babel) {
  const { types: t, template } = babel;
  let isDebug = false;

  /**
   * v6 匹配器
   * @param {string} name 标识符名称
   * @param {string} helperName helper 名称
   * @param {BabelNode} test
   * @returns {HelperInfo | null}
   */
  function v6Checker(name, helperName, test) {
    const helper = getHelperV6(helperName, template);
    if (helper) {
      const similarity = calcNodeSimilarity(helper, test, t);
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
    return null;
  }

  /**
   * v6 匹配器
   * @param {string} name 标识符名称
   * @param {string} helperName helper 名称
   * @param {BabelNode} test
   * @returns {HelperInfo | null}
   */
  function v7Checker(name, helperName, test) {
    const helper = getHelperV7(helperName, template, t);
    if (helper) {
      const similarity = calcNodeSimilarity(helper.ast, test, t);
      if (isDebug) {
        console.log(`v7 ${name} -> ${helperName} similarity: ${similarity}`);
      }

      if (similarity > 60) {
        return {
          type: 'v7',
          name: helperName,
          deps: helper.deps,
        };
      }
    }
    return null;
  }

  /**
   * helper 匹配
   * @param {string} name
   * @param {BabelNode} test
   * @param {State} state
   * @returns {HelperInfo | null}
   */
  function matchHelper(name, test, state) {
    const helperName = getHelperName(name);

    if (helperName) {
      if (state.helperVersion != null) {
        const checker = state.helperVersion === 6 ? v6Checker : v7Checker;
        return checker(name, helperName, test);
      } else {
        // 某些 helper 在 v6 和 v7 都存在
        const v7Info = v7Checker(name, helperName, test);
        const v6Info = v6Checker(name, helperName, test);

        if (v7Info && !v6Info) {
          state.helperVersion = 7;
          return v7Info;
        } else if (!v7Info && v6Info) {
          state.helperVersion = 6;
          return v6Info;
        } else if (v7Info && v6Info) {
          // 有歧义，暂定为 v7
          state.ambiguity = true;
          return state.preferV7 ? v7Info : v6Info;
        }
      }
    }

    return null;
  }

  /**
   * 构造导入函数
   * @param {'v6' | 'v7'} type
   * @param {BabelNodePath} path
   * @param {string} name
   * @param {State} state
   */
  function createRequirement(type, name, path, state) {
    const { moduleNameV6 = V6_MODULE_NAME, moduleNameV7 = V7_MODULE_NAME } = state.opts;
    const moduleName = type === 'v6' ? moduleNameV6 : moduleNameV7;

    // 导入 _interopRequireDefault
    if (!path.scope.hasBinding(_INTEROP_REQUIRE_DEFAULT)) {
      const funcExpr = /** @type {BabelFunctionExpression} */ (getHelperV6(INTEROP_REQUIRE_DEFAULT, template));
      const funcDesc = t.functionDeclaration(t.identifier(_INTEROP_REQUIRE_DEFAULT), funcExpr.params, funcExpr.body);
      const parentScope = path.scope.parent || path.scope;

      // 插入
      if (parentScope.path.isFunction()) {
        // 函数作用域
        const bodyPath = /** @type {GBabelNodePath<BabelFunctionExpression>} */ (parentScope.path.get('body'));
        bodyPath.unshiftContainer('body', funcDesc);
        bodyPath.scope.registerDeclaration(bodyPath.get('body')[0]);
      } else {
        // program 作用域
        parentScope.path.unshiftContainer('body', funcDesc);
        parentScope.registerDeclaration(parentScope.path.get('body')[0]);
      }
    }
    return t.memberExpression(
      t.callExpression(t.identifier(_INTEROP_REQUIRE_DEFAULT), [
        t.callExpression(t.identifier('require'), [t.stringLiteral(`${moduleName}/helpers/${name}`)]),
      ]),
      t.identifier('default')
    );
  }

  /**
   *
   * @param {BabelNodePath} path
   * @param {Array<[string, BabelNode]>} ids
   */
  function removeBindings(path, ids) {
    for (const [name, ast] of ids) {
      const binding = path.scope.getBinding(name);
      if (binding && binding.path.node && calcNodeSimilarity(ast, binding.path.node, t) > 60) {
        binding.path.remove();
      }
    }
  }

  /**
   * 删除依赖的语句
   * @param {BabelNodePath} path
   * @param {BabelNode} dep
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
   * @param {BabelNodePath} path
   * @param {BabelNode[] | undefined} deps
   */
  function removeDeps(path, deps) {
    if (deps == null || deps.length === 0) {
      return;
    }

    /** @type Array<[string, BabelNode]> */
    const ids = [];
    for (const dep of deps) {
      if (t.isFunctionDeclaration(dep) && dep.id) {
        ids.push([dep.id.name, dep]);
      } else if (t.isVariableDeclaration(dep)) {
        dep.declarations.forEach((d) => {
          ids.push([/** @type BabelIdentifier */ (d.id).name, d]);
        });
      } else {
        // 非函数声明或者变量声明，可以是条件语句
        // 通过变量绑定查找对应的语句，并删除
        removeDepsStatements(path, dep);
      }
    }

    if (ids.length) {
      removeBindings(path, ids);
    }
  }

  return {
    name: 'babel-plugin-helper-trimer', // not required
    pre(file) {
      const { debug = false } = this.opts;
      isDebug = debug;
    },
    visitor: {
      Program: {
        enter(path, state) {
          const { preferV7 = true } = state.opts;
          // 如果检测到当前程序使用指定版本的 helper，就会忽略其他版本的 helper 提高匹配速度
          state.helperVersion = undefined;
          // 版本上有歧义
          state.ambiguity = false;
          state.preferV7 = preferV7;
        },
        exit(path, state) {
          // 调整版本
          if (state.ambiguity && state.helperVersion === 6) {
            const { moduleNameV6 = V6_MODULE_NAME, moduleNameV7 = V7_MODULE_NAME } = state.opts;
            // 纠正 v7 helper 导入为 v6
            path.traverse({
              CallExpression(path, state) {
                const node = path.node;
                if (
                  t.isIdentifier(node.callee) &&
                  node.callee.name === 'require' &&
                  node.arguments.length &&
                  t.isStringLiteral(node.arguments[0]) &&
                  node.arguments[0].value.indexOf(moduleNameV7) !== -1
                ) {
                  node.arguments[0] = t.stringLiteral(node.arguments[0].value.replace(moduleNameV7, moduleNameV6));
                }
              },
            });
          }
        },
      },
      // var 导入
      VariableDeclarator(path, state) {
        const name = path.node.id.name;
        const helper = matchHelper(name, path.node.init, state);

        if (helper) {
          // 移除依赖
          removeDeps(path, helper.deps);
          path.node.init = createRequirement(helper.type, helper.name, path, state);
        }
      },
      FunctionDeclaration(path, state) {
        const name = path.node.id.name;
        const helper = matchHelper(name, path.node, state);
        if (helper) {
          removeDeps(path, helper.deps);
          path.replaceWith(
            t.variableDeclaration('var', [
              t.variableDeclarator(t.identifier(name), createRequirement(helper.type, helper.name, path, state)),
            ])
          );
        }
      },
    },
  };
};
