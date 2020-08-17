'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defaults = _interopRequireDefault(require('babel-runtime/helpers/defaults')).default;

var _temporalUndefined = _interopRequireDefault(require('babel-runtime/helpers/temporalUndefined')).default;

var _slicedToArray = _interopRequireDefault(require('babel-runtime/helpers/slicedToArray')).default;

var _set = _interopRequireDefault(require('babel-runtime/helpers/set')).default;

var _selfGlobal = _interopRequireDefault(require('babel-runtime/helpers/selfGlobal')).default;

var _get = _interopRequireDefault(require('babel-runtime/helpers/get')).default;

var _extends = _interopRequireDefault(require('babel-runtime/helpers/extends')).default;

var _createClass = _interopRequireDefault(require('babel-runtime/helpers/createClass')).default;

var _asyncGenerator = _interopRequireDefault(require('babel-runtime/helpers/asyncGenerator')).default;

var _jsx = _interopRequireDefault(require('babel-runtime/helpers/jsx')).default;

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var _toConsumableArray = _interopRequireDefault(require('babel-runtime/helpers/toConsumableArray')).default;

var _toArray = _interopRequireDefault(require('babel-runtime/helpers/toArray')).default;

var _temporalRef = _interopRequireDefault(require('babel-runtime/helpers/temporalRef')).default;

var _taggedTemplateLiteralLoose = _interopRequireDefault(require('babel-runtime/helpers/taggedTemplateLiteralLoose')).default;

var _taggedTemplateLiteral = _interopRequireDefault(require('babel-runtime/helpers/taggedTemplateLiteral')).default;

var _slicedToArrayLoose = _interopRequireDefault(require('babel-runtime/helpers/slicedToArrayLoose')).default;

var _possibleConstructorReturn = _interopRequireDefault(require('babel-runtime/helpers/possibleConstructorReturn')).default;

var _objectWithoutProperties = _interopRequireDefault(require('babel-runtime/helpers/objectWithoutProperties')).default;

var _objectDestructuringEmpty = _interopRequireDefault(require('babel-runtime/helpers/objectDestructuringEmpty')).default;

var _newArrowCheck = _interopRequireDefault(require('babel-runtime/helpers/newArrowCheck')).default;

var _interopRequireWildcard = _interopRequireDefault(require('babel-runtime/helpers/interopRequireWildcard')).default;

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var _instanceof = _interopRequireDefault(require('babel-runtime/helpers/instanceof')).default;

var _inherits = _interopRequireDefault(require('babel-runtime/helpers/inherits')).default;

var _defineProperty = _interopRequireDefault(require('babel-runtime/helpers/defineProperty')).default;

var _defineEnumerableProperties = _interopRequireDefault(require('babel-runtime/helpers/defineEnumerableProperties')).default;

var _classCallCheck = _interopRequireDefault(require('babel-runtime/helpers/classCallCheck')).default;

var _asyncToGenerator = _interopRequireDefault(require('babel-runtime/helpers/asyncToGenerator')).default;

var _asyncGeneratorDelegate = _interopRequireDefault(require('babel-runtime/helpers/asyncGeneratorDelegate')).default;

var _asyncIterator = _interopRequireDefault(require('babel-runtime/helpers/asyncIterator')).default;

var _typeof = 1;
var id = Symbol('id');

var Foo = function () {
  function Foo() {
    var _this = this;

    _classCallCheck(this, Foo);

    this.baz = function () {
      _this.log.apply(_this, _toConsumableArray(arg));
    };
  }

  _createClass(Foo, [{
    key: 'bar',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function bar() {
        return _ref.apply(this, arguments);
      }

      return bar;
    }()
  }, {
    key: 'log',
    value: function log() {}
  }, {
    key: id,
    value: function value() {
      console.log(typeof id === 'undefined' ? 'undefined' : _typeof2(id));
    }
  }]);

  return Foo;
}();

var foo = new Foo();
var Bar = function Bar() {};
var bar = new Bar();
console.log(foo instanceof Foo);