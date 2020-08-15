'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

var _temporalUndefined2 = require('babel-runtime/helpers/temporalUndefined');

var _temporalUndefined3 = _interopRequireDefault(_temporalUndefined2);

var _temporalRef2 = require('babel-runtime/helpers/temporalRef');

var _temporalRef3 = _interopRequireDefault(_temporalRef2);

var _taggedTemplateLiteralLoose2 = require('babel-runtime/helpers/taggedTemplateLiteralLoose');

var _taggedTemplateLiteralLoose3 = _interopRequireDefault(_taggedTemplateLiteralLoose2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _slicedToArrayLoose2 = require('babel-runtime/helpers/slicedToArrayLoose');

var _slicedToArrayLoose3 = _interopRequireDefault(_slicedToArrayLoose2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _set2 = require('babel-runtime/helpers/set');

var _set3 = _interopRequireDefault(_set2);

var _selfGlobal2 = require('babel-runtime/helpers/selfGlobal');

var _selfGlobal3 = _interopRequireDefault(_selfGlobal2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _objectDestructuringEmpty2 = require('babel-runtime/helpers/objectDestructuringEmpty');

var _objectDestructuringEmpty3 = _interopRequireDefault(_objectDestructuringEmpty2);

var _newArrowCheck2 = require('babel-runtime/helpers/newArrowCheck');

var _newArrowCheck3 = _interopRequireDefault(_newArrowCheck2);

var _instanceof2 = require('babel-runtime/helpers/instanceof');

var _instanceof3 = _interopRequireDefault(_instanceof2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _defaults2 = require('babel-runtime/helpers/defaults');

var _defaults3 = _interopRequireDefault(_defaults2);

var _defineEnumerableProperties2 = require('babel-runtime/helpers/defineEnumerableProperties');

var _defineEnumerableProperties3 = _interopRequireDefault(_defineEnumerableProperties2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _asyncGeneratorDelegate2 = require('babel-runtime/helpers/asyncGeneratorDelegate');

var _asyncGeneratorDelegate3 = _interopRequireDefault(_asyncGeneratorDelegate2);

var _asyncGenerator2 = require('babel-runtime/helpers/asyncGenerator');

var _asyncGenerator3 = _interopRequireDefault(_asyncGenerator2);

var _asyncIterator2 = require('babel-runtime/helpers/asyncIterator');

var _asyncIterator3 = _interopRequireDefault(_asyncIterator2);

var _jsx2 = require('babel-runtime/helpers/jsx');

var _jsx3 = _interopRequireDefault(_jsx2);

var _typeof3 = require('babel-runtime/helpers/typeof');

var _typeof4 = _interopRequireDefault(_typeof3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _typeof = 1;
var id = Symbol('id');

var Foo = function () {
  function Foo() {
    var _this = this;

    (0, _classCallCheck3.default)(this, Foo);

    this.baz = function () {
      _this.log.apply(_this, (0, _toConsumableArray3.default)(arg));
    };
  }

  (0, _createClass3.default)(Foo, [{
    key: 'bar',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
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
      console.log(typeof id === 'undefined' ? 'undefined' : (0, _typeof4.default)(id));
    }
  }]);
  return Foo;
}();

var foo = new Foo();
var Bar = function Bar() {};
var bar = new Bar();
console.log(foo instanceof Foo);