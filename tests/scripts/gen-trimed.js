/**
 * 生成 trimed 后的 snapshot
 */
const path = require('path');
const fs = require('fs');
const { trimV6, trimV7 } = require('../helpers');
const list = require('./list');

list.forEach((i) => {
  const _in = path.join(__dirname, `../fixtures/${i.target}/untrimed.js`);
  const _out = path.join(__dirname, `../fixtures/${i.target}/trimed.js`);
  const trimer = i.version === 6 ? trimV6 : trimV7;
  const res = trimer(_in, i.options);
  fs.writeFileSync(_out, res.code);
});
