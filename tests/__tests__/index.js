const { trimString, VERSIONS } = require('../helpers');

describe('base functions', () => {
  describe('scoped', () => {
    VERSIONS.forEach((v) => {
      test(`v${v} function declaration scope`, () => {
        const source = `
function test() {
  function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
}`;
        const trimed = trimString(v, source);
        expect(trimed.code.trim()).toBe(
          `
function test() {
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _instanceof = _interopRequireDefault(require("babel-runtime/helpers/instanceof")).default;

  var _createClass = _interopRequireDefault(require("babel-runtime/helpers/createClass")).default;
}
`.trim(),
        );
      });
    });

    VERSIONS.forEach((v) => {
      test(`v${v} block scope`, () => {
        const source = `
{
  function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
}
      `;
        const trimed = trimString(v, source);
        expect(trimed.code.trim()).toBe(
          `
{
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _instanceof = _interopRequireDefault(require("babel-runtime/helpers/instanceof")).default;

  var _createClass = _interopRequireDefault(require("babel-runtime/helpers/createClass")).default;
}
      `.trim(),
        );
      });
    });
  });

  // babel v6 v7 重叠场景
  test('无法区分，默认优先 v7', () => {
    const source = `
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
`;
    const trimed = trimString(6, source);
    expect(trimed.code.trim()).toBe(
      `
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var _defaults = _interopRequireDefault(require("@babel/runtime/helpers/defaults")).default;

var _defineProperty = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty")).default;
    `.trim(),
    );
  });

  test('无法区分，可以通过 preferV7 设置为false 优先使用 v6', () => {
    const source = `
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
`;
    const trimed = trimString(6, source, { preferV7: false });
    expect(trimed.code.trim()).toBe(
      `
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var _defaults = _interopRequireDefault(require("babel-runtime/helpers/defaults")).default;

var _defineProperty = _interopRequireDefault(require("babel-runtime/helpers/defineProperty")).default;
    `.trim(),
    );
  });

  test('存在v6 的helper，全部替换为 v6', () => {
    const source = `
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
`;
    const trimed = trimString(7, source);
    expect(trimed.code.trim()).toBe(
      `
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

var _defaults = _interopRequireDefault(require("babel-runtime/helpers/defaults")).default;

var _defineProperty = _interopRequireDefault(require("babel-runtime/helpers/defineProperty")).default;

var _extends = _interopRequireDefault(require("babel-runtime/helpers/extends")).default;
`.trim(),
    );
  });

  test('多文件测试', () => {
    const source1 = `var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };`;
    expect(trimString(6, source1).code.trim()).toMatch(
      `var _extends = _interopRequireDefault(require("babel-runtime/helpers/extends")).default;`,
    );

    const source2 =
      'function _classNameTDZError(name) { throw new Error("Class \\"" + name + "\\" cannot be referenced in computed property keys."); }';
    expect(trimString(6, source2).code.trim()).toMatch(
      `var _classNameTDZError = _interopRequireDefault(require("@babel/runtime/helpers/classNameTDZError")).default;`,
    );
  });
});
