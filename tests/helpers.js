const { list: v6List } = require('babel-helpers');
const { list: v7List } = require('@babel/helpers');
const { transform: v6Transform } = require('babel-core');
const { transform: v7Transform } = require('@babel/core');
const fs = require('fs');
const path = require('path');

const VERSIONS = [6, 7];

/**
 * 注入所有的 helpers
 */
function generateHelpers(version) {
  return function () {
    return {
      pre(file) {},
      visitor: {
        Program(path, state) {
          (version === 6 ? v6List : v7List).forEach((i) => {
            state.file.addHelper(i);
          });
        },
      },
    };
  };
}

function transformV6(
  inputPath,
  outputPath,
  { helpers = false, injectAll = false, envOptions = {} } = {},
) {
  const input = fs.readFileSync(inputPath).toString();
  const res = v6Transform(input, {
    presets: [[require('babel-preset-env'), envOptions]],
    plugins: [
      injectAll && generateHelpers(6),
      [
        require('babel-plugin-transform-runtime'),
        {
          helpers: helpers,
          polyfill: false,
          regenerator: true,
          moduleName: 'babel-runtime',
        },
      ],
    ].filter(Boolean),
  });

  fs.writeFileSync(outputPath, res.code);
}

function transformV7(
  inputPath,
  outputPath,
  { helpers = false, injectAll = false, envOptions = {} } = {},
) {
  const input = fs.readFileSync(inputPath).toString();
  const res = v7Transform(input, {
    presets: [[require('@babel/preset-env'), envOptions]],
    plugins: [
      injectAll && generateHelpers(7),
      [
        require('@babel/plugin-transform-runtime'),
        {
          helpers: helpers,
          regenerator: true,
        },
      ],
    ].filter(Boolean),
  });

  fs.writeFileSync(outputPath, res.code);
}

function trimV6(inputPath, options = {}) {
  const input = fs.readFileSync(inputPath).toString();
  return v6Transform(input, {
    plugins: [[require('../src'), options]],
  });
}

function trimV7(inputPath, options = {}) {
  const input = fs.readFileSync(inputPath).toString();
  return v7Transform(input, {
    plugins: [[require('../src'), options]],
  });
}

function trim(version, inputPath, options = {}) {
  if (version == 6) {
    return trimV6(inputPath, options);
  } else {
    return trimV7(inputPath, options);
  }
}

function trimV6String(input, options = {}) {
  return v6Transform(input, {
    plugins: [[require('../src'), options]],
  });
}

function trimV7String(input, options = {}) {
  return v7Transform(input, {
    plugins: [[require('../src'), options]],
  });
}

function trimString(version, input, options = {}) {
  if (version == 6) {
    return trimV6String(input, options);
  } else {
    return trimV7String(input, options);
  }
}

module.exports = {
  VERSIONS,
  transformV6,
  transformV7,
  trimV6,
  trimV7,
  trim,
  trimV6String,
  trimV7String,
  trimString,
  v6List,
  v7List,
};
