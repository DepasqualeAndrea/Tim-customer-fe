const path = require('path');
const fs = require('fs');

const mockDirectory = path.resolve(__dirname, '../mocks');

const createDB = () => {
  const files = fs.readdirSync(mockDirectory);
  const mocks = {};
  files.forEach((filename) => {
    const fileNamePrefix = filename.split('.').shift();
    const newObj = {};
    // eslint-disable-next-line import/no-dynamic-require, global-require
    newObj[fileNamePrefix] = require(`${mockDirectory}/${filename}`);
    Object.assign(mocks, newObj);
  });
  return mocks;
};

module.exports = () => createDB();
