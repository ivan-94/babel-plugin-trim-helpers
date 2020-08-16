// @ts-check
const {
  INTEROP_REQUIRE_DEFAULT,
  _INTEROP_REQUIRE_DEFAULT,
  V6_MODULE_NAME,
  V7_MODULE_NAME,
} = require('./constants');
const { getHelperV6, getHelperV7, getHelperName } = require('./helpers');
const { calcNodeSimilarity, getClosestParentPath } = require('./utils');

/**
 *
 * @param {import('babel-core')} babel
 * @returns {import('babel-core').PluginObj<any>}
 */
module.exports = function (babel) {
  const { types: t, template } = babel;
  let isDebug = false;

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
  }

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
  }

  /**
   * @param {string} name
   * @param {import('babel-traverse').Node} test
   * @returns {{type: 'v6' | 'v7', name: string, deps?: any[]} | null}
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
          return v7Info;
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
      moduleNameV6 = V6_MODULE_NAME,
      moduleNameV7 = V7_MODULE_NAME,
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
          // 如果检测到当前程序使用指定版本的 helper，就会忽略其他版本的 helper 提高匹配速度
          state.helperVersion = undefined;
          // 版本上有歧义
          state.ambiguity = false;
        },
        exit(path, state) {
          // 调整版本
          if (state.ambiguity && state.helperVersion === 6) {
            const {
              moduleNameV6 = V6_MODULE_NAME,
              moduleNameV7 = V7_MODULE_NAME,
            } = state.opts;
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
                  node.arguments[0] = t.stringLiteral(
                    node.arguments[0].value.replace(moduleNameV7, moduleNameV6),
                  );
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
        const helper = matchHelper(name, path.node, state);
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
