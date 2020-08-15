const { list } = require('babel-helpers');
const { transformFile } = require('babel-core');
const fs = require('fs');
const path = require('path');

/**
 * 注入所有的 helpers
 */
function generateHelpers(babel) {
  return {
    pre(file) {},
    visitor: {
      Program(path, state) {
        list.forEach((i) => {
          state.file.addHelper(i);
        });
      },
    },
  };
}

function transform(output, helpers) {
  transformFile(
    './demo.js',
    {
      presets: [require('babel-preset-env')],
      plugins: [
        generateHelpers,
        [
          require('babel-plugin-transform-runtime'),
          {
            helpers: helpers,
            polyfill: false,
            regenerator: true,
            moduleName: 'babel-runtime',
          },
        ],
      ],
    },
    (err, res) => {
      if (err) {
        console.error(err);
      } else {
        fs.writeFileSync(output, res.code);
      }
    },
  );
}

transform(path.join(__dirname, './out.js'), false);
transform(path.join(__dirname, './out-module.js'), true);
