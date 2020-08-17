/**
 * 生成 trimed 后的 snapshot
 */
const path = require('path');
const fs = require('fs');
const { trimV6, trimV7 } = require('../helpers');
const list = require('./list');

list.forEach((i) => {
  const _in = path.join(__dirname, `../fixtures/${i.target}/untrimed.js`);
  const _outV6 = path.join(__dirname, `../fixtures/${i.target}/trimed-v6.js`);
  const _outV7 = path.join(__dirname, `../fixtures/${i.target}/trimed-v7.js`);

  // v6 运行时转换
  let res = trimV6(_in, i.options);
  fs.writeFileSync(_outV6, res.code);

  res = trimV7(_in, i.options);
  fs.writeFileSync(_outV7, res.code);
});
