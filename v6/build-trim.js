const { transformFile } = require('babel-core');
const fs = require('fs');
const path = require('path');

function trimbyHelperTrim() {
  transformFile(
    path.join(__dirname, './out.js'),
    {
      plugins: [
        [
          require('../src'),
          {
            moduleName: 'babel-runtime',
          },
        ],
      ],
    },
    (err, res) => {
      if (err) {
        console.error(err);
      } else {
        fs.writeFileSync(path.join(__dirname, './out-trim.js'), res.code);
      }
    },
  );
}

trimbyHelperTrim();
