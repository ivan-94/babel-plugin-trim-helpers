const BLACK_LIST = new Set(['interopRequireDefault', 'interopRequireWildcard']);
const IGNORE_PROPERTIES = new Set(['start', 'end', 'loc', 'comments', 'extra']);
const INTEROP_REQUIRE_DEFAULT = 'interopRequireDefault';
const _INTEROP_REQUIRE_DEFAULT = '_interopRequireDefault';
const V6_MODULE_NAME = 'babel-runtime';
const V7_MODULE_NAME = '@babel/runtime';

const UNIQ_NAME_REG = /^_([a-zA-Z]+)\d*$/;

module.exports = {
  BLACK_LIST,
  IGNORE_PROPERTIES,
  UNIQ_NAME_REG,
  INTEROP_REQUIRE_DEFAULT,
  _INTEROP_REQUIRE_DEFAULT,
  V6_MODULE_NAME,
  V7_MODULE_NAME,
};
