var test = require('tape');
var path = require('path');
var fs = require('fs');
var htmlToPdf = require('../html-to-pdf');

htmlToPdf.setDebug(true);

test('convertHTMLFile', function (t) {
  htmlToPdf.convertHTMLFile(path.join(__dirname, 'test.html'), null, true, function (err, result) {
    t.equal(result. process_code, 0, 'Exits with code 0');
    t.ok(typeof result.base64 === 'string', 'Returns a base64 property as a string');
    t.end();
  });
});

test('convertHTMLString', function (t) {
  fs.readFile(path.join(__dirname, 'test.html'), function (err, string) {
    htmlToPdf.convertHTMLString(string, null, true, function (err, result) {
      t.equal(result. process_code, 0, 'Exits with code 0');
      t.ok(typeof result.base64 === 'string', 'Returns a base64 property as a string');
      t.end();
    });
  });
});
