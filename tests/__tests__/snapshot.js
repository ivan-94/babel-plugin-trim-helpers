const { trimV6, trimV7 } = require('../helpers');
const fs = require('fs');
const path = require('path');
const list = require('../scripts/list');

describe('snapshot test', () => {
  list.forEach((desc) => {
    test(desc.target, () => {
      const _in = path.join(
        __dirname,
        `../fixtures/${desc.target}/untrimed.js`,
      );
      const _snapshot = path.join(
        __dirname,
        `../fixtures/${desc.target}/trimed.js`,
      );
      const trimer = desc.version === 6 ? trimV6 : trimV7;
      const result = trimer(_in, desc.options);
      const trimed = fs.readFileSync(_snapshot).toString();
      expect(result.code).toBe(trimed);
    });
  });
});
