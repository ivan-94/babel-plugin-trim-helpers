const { trimV6, trimV7, VERSIONS } = require('../helpers');
const fs = require('fs');
const path = require('path');
const list = require('../scripts/list');

describe('snapshot test', () => {
  list.forEach((desc) => {
    describe(desc.target, () => {
      VERSIONS.forEach((v) => {
        test(`v${v} runtime`, () => {
          const _in = path.join(
            __dirname,
            `../fixtures/${desc.target}/untrimed.js`,
          );
          const _snapshot = path.join(
            __dirname,
            `../fixtures/${desc.target}/trimed-v${v}.js`,
          );
          const trimer = v === 6 ? trimV6 : trimV7;
          const result = trimer(_in, desc.options);
          const trimed = fs.readFileSync(_snapshot).toString();
          expect(result.code).toBe(trimed);
        });
      });
    });
  });
});
