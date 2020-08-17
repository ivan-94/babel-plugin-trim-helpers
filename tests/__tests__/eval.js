const path = require('path');
const { VERSIONS } = require('../helpers');
const list = require('../scripts/list');

/**
 * 确保转换后的代码正常执行
 */
describe('eval', () => {
  describe('require', () => {
    list.forEach((i) => {
      describe(`require ${i.target}`, () => {
        VERSIONS.forEach((v) => {
          test(`v${v} runtime`, () => {
            const p = path.join(
              __dirname,
              `../fixtures/${i.target}/trimed-v${v}.js`,
            );
            expect(() => {
              require(p);
            }).not.toThrow();
          });
        });
      });
    });
  });
});
