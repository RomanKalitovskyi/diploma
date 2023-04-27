const fs = require('fs');

const filePath = './dist/index.html';
const searchString = '/assets';
const replaceString = '/diploma/assets';

fs.readFile(filePath, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const result = data.replace(searchString, replaceString);

  fs.writeFile(filePath, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
