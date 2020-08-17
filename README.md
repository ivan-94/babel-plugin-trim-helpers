# babel-plugin-trim-helpers

将内联的 Helper 转换为模块导入

## Example

```js
class Count {
  method() {}
}
```

Babel 转译结果:

```js
'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var Count = /*#__PURE__*/ (function () {
  function Count() {
    _classCallCheck(this, Count);
  }

  _createClass(Count, [
    {
      key: 'method',
      value: function method() {},
    },
  ]);

  return Count;
})();
```

经过 babel-plugin-trim-helpers 转译：

```js
'use strict';

function _interopRequireDefault(obj) {
  return obj && obj.__esModule
    ? obj
    : {
        default: obj,
      };
}

var _classCallCheck = _interopRequireDefault(
  require('@babel/runtime/helpers/classCallCheck'),
).default;

var _createClass = _interopRequireDefault(
  require('@babel/runtime/helpers/createClass'),
).default;

var Count = /*#__PURE__*/ (function () {
  function Count() {
    _classCallCheck(this, Count);
  }

  _createClass(Count, [
    {
      key: 'method',
      value: function method() {},
    },
  ]);

  return Count;
})();
```

## Usage

```shell
$ yarn add babel-plugin-trim-helpers -D
```

Babel 配置:

```json
{
  "plugins": [
    [
      "trim-helpers",
      {
        "moduleNameV6": "babel-runtime",
        "moduleNameV7": "@babel/runtime",
        "preferV7": true
      }
    ]
  ]
}
```

| 选项         | 可选 | 默认值         | 描述                                                                                                              |
| ------------ | ---- | -------------- | ----------------------------------------------------------------------------------------------------------------- |
| moduleNameV6 | √    | babel-runtime  | Babel v6 runtime 模块名称                                                                                         |
| moduleNameV7 | √    | @babel/runtime | Babel v7 runtime 模块名称                                                                                         |
| preferV7     | √    | true           | 某些 Helper 在 v6 和 v7 都存在，所以可能无法判断是要导入 v6 还是 v7 模块， 某人如果存在歧义，会优先以 v7 形式导入 |
