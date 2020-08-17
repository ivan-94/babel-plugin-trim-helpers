module.exports = [
  {
    target: 'v6-all',
    // helper 由什么 版本的 babel 生成
    version: 6,
    helpers: false,
    options: {},
  },
  {
    target: 'v7-all',
    version: 7,
    helpers: false,
    options: {},
  },
  {
    target: 'v6-transformed',
    version: 6,
    helpers: true,
    options: {},
  },
  {
    target: 'v7-transformed',
    version: 7,
    helpers: true,
    options: {},
  },
];
