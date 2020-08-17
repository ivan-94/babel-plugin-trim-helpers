'use strict';

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = _interopRequireDefault(require('@babel/runtime/helpers/typeof')).default;

var _classCallCheck = _interopRequireDefault(require('@babel/runtime/helpers/classCallCheck')).default;

var _createClass = _interopRequireDefault(require('@babel/runtime/helpers/createClass')).default;

var _defineProperty = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty')).default;

var _objectSpread2 = _interopRequireDefault(require('@babel/runtime/helpers/objectSpread2')).default;

var _inherits = _interopRequireDefault(require('@babel/runtime/helpers/inherits')).default;

var _getPrototypeOf = _interopRequireDefault(require('@babel/runtime/helpers/getPrototypeOf')).default;

var _setPrototypeOf = _interopRequireDefault(require('@babel/runtime/helpers/setPrototypeOf')).default;

var _isNativeReflectConstruct = _interopRequireDefault(require('@babel/runtime/helpers/isNativeReflectConstruct')).default;

var _construct = _interopRequireDefault(require('@babel/runtime/helpers/construct')).default;

var _isNativeFunction = _interopRequireDefault(require('@babel/runtime/helpers/isNativeFunction')).default;

var _wrapNativeSuper = _interopRequireDefault(require('@babel/runtime/helpers/wrapNativeSuper')).default;

var _assertThisInitialized = _interopRequireDefault(require('@babel/runtime/helpers/assertThisInitialized')).default;

var _possibleConstructorReturn = _interopRequireDefault(require('@babel/runtime/helpers/possibleConstructorReturn')).default;

var _createSuper = _interopRequireDefault(require('@babel/runtime/helpers/createSuper')).default;

var _toConsumableArray = _interopRequireDefault(require('@babel/runtime/helpers/toConsumableArray')).default;

var _arrayWithoutHoles = _interopRequireDefault(require('@babel/runtime/helpers/arrayWithoutHoles')).default;

var _iterableToArray = _interopRequireDefault(require('@babel/runtime/helpers/iterableToArray')).default;

var _unsupportedIterableToArray = _interopRequireDefault(require('@babel/runtime/helpers/unsupportedIterableToArray')).default;

var _arrayLikeToArray = _interopRequireDefault(require('@babel/runtime/helpers/arrayLikeToArray')).default;

var _nonIterableSpread = _interopRequireDefault(require('@babel/runtime/helpers/nonIterableSpread')).default;

if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.assign = function (target) {
    // .length of function is 2
    if (target == null) {
      // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) {
        // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }

    return to;
  };
}

if (typeof Object.defineProperties !== 'function') {
  Object.defineProperties = function (obj, properties) {
    function convertToDescriptor(desc) {
      function hasProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      }

      function isCallable(v) {
        // NB: modify as necessary if other values than functions are callable.
        return typeof v === 'function';
      }

      if (_typeof(desc) !== 'object' || desc === null) {
        throw new TypeError('bad desc');
      }

      var d = {};
      if (hasProperty(desc, 'enumerable')) d.enumerable = !!desc.enumerable;

      if (hasProperty(desc, 'configurable')) {
        d.configurable = !!desc.configurable;
      }

      if (hasProperty(desc, 'value')) d.value = desc.value;
      if (hasProperty(desc, 'writable')) d.writable = !!desc.writable;

      if (hasProperty(desc, 'get')) {
        var g = desc.get;

        if (!isCallable(g) && typeof g !== 'undefined') {
          throw new TypeError('bad get');
        }

        d.get = g;
      }

      if (hasProperty(desc, 'set')) {
        var s = desc.set;

        if (!isCallable(s) && typeof s !== 'undefined') {
          throw new TypeError('bad set');
        }

        d.set = s;
      }

      if (('get' in d || 'set' in d) && ('value' in d || 'writable' in d)) {
        throw new TypeError('identity-confused descriptor');
      }

      return d;
    }

    if (_typeof(obj) !== 'object' || obj === null) throw new TypeError('bad obj');
    properties = Object(properties);
    var keys = Object.keys(properties);
    var descs = [];

    for (var i = 0; i < keys.length; i++) {
      descs.push([keys[i], convertToDescriptor(properties[keys[i]])]);
    }

    for (var i = 0; i < descs.length; i++) {
      Object.defineProperty(obj, descs[i][0], descs[i][1]);
    }

    return obj;
  };
}

var Component = function Component(props) {
  _classCallCheck(this, Component);

  this.state = {};
  this.props = props || {};
};