const path = require('path');
const list = require('../scripts/list');

/**
 * 确保转换后的代码正常执行
 */
describe('eval', () => {
  describe('require', () => {
    list.forEach((i) => {
      test(`require ${i.target}`, () => {
        const p = path.join(__dirname, `../fixtures/${i.target}/trimed.js`);
        expect(() => {
          require(p);
        }).not.toThrow();
      });
    });
  });
});
