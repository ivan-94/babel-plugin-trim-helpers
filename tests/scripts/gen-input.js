/**
 * 生成 helper 测试固件
 */
const path = require('path');
const { transformV6, transformV7 } = require('../helpers');
const list = require('./list');

list.forEach((i) => {
  const _in = path.join(__dirname, `../fixtures/${i.target}/input.js`);
  const _out = path.join(__dirname, `../fixtures/${i.target}/untrimed.js`);
  const transformer = i.version === 6 ? transformV6 : transformV7;
  transformer(_in, _out, i.helpers);
});
