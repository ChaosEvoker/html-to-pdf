var test = require('tape');
var path = require('path');
var fs = require('fs');
var htmlToPdf = require('../html-to-pdf');

var htmlPath = path.join(__dirname, 'test.html');
// Left debugging logs out as there were annoying warnings with the html file.
// htmlToPdf.setDebug(true);

test('convertHTMLFile with base64', function (t) {
  htmlToPdf.convertHTMLFile(htmlPath, null, function (err, result) {
    t.equal(result.process_code, 0, 'Exits with code 0');
    t.ok(typeof result.base64 === 'string', 'Returns a base64 property as a string');
    t.end();
  });
});

test('convertHTMLFile without base64', function (t) {
  htmlToPdf.convertHTMLFile(htmlPath, 'output.pdf', function (err, result) {
    t.equal(result.process_code, 0, 'Exits with code 0');
    t.notOk(result.base64, 'No base64 property');
    fs.unlink('output.pdf', function (err) {
      t.notOk(err, 'PDF removed correctly');
      t.end();
    });
  });
});

test('convertHTMLString with base64', function (t) {
  fs.readFile(htmlPath, function (err, string) {
    htmlToPdf.convertHTMLString(string, null, function (err, result) {
      t.equal(result.process_code, 0, 'Exits with code 0');
      t.ok(typeof result.base64 === 'string', 'Returns a base64 property as a string');
      t.end();
    });
  });
});

test('convertHTMLString without base64', function (t) {
  fs.readFile(htmlPath, function (err, string) {
    htmlToPdf.convertHTMLString(string, 'output.pdf', function (err, result) {
      t.equal(result.process_code, 0, 'Exits with code 0');
      t.notOk(result.base64, 'No base64 property');
      fs.unlink('output.pdf', function (err) {
        t.notOk(err, 'PDF removed correctly');
        t.end();
      });
    });
  });
});
