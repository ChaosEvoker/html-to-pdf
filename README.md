html-to-pdf
===========

A Node wrapper around a Java HTML to PDF converter to allow users to make HTML templates for automated generation of PDFs. While often in Node this is achieved through phantomjs, for larger PDF reports each report being a large image can make the file very large very quickly. This aims to fix that problem by using the Java library flyingsaucer to do the heavy lifting and providing a Node wrapper around it for ease of use with web applications.

## Installation ##
To install html-to-pdf simply use NPM:
```sh
npm install html-to-pdf
```
## How To Use html-to-pdf ##
To use html-to-pdf in your Node application, just require it:
```js
var htmlToPdf = require('html-to-pdf');
```
### HTML File Conversion Example ###
You can use `convertHTMLFile` to convert HTML files to PDFs. Simply provide a path to a source HTML file and a path to a destination PDF file for conversion.
```js
htmlToPdf.convertHTMLFile('path/to/source.html', 'path/to/destination.pdf',
    function (error, success) {
       if (error) {
            console.log('Oh noes! Errorz!');
            console.log(error);
        } else {
            console.log('Woot! Success!');
            console.log(success);
        }
    }
);
```
### HTML String Conversion Example ###
You can use `convertHTMLString` to turn a string of HTML into a PDF file. Simply pass in a string of HTML and a path to a destination PDF file for conversion. This is useful for using other templating languages (like Jade or Mustache) where you can convert the template into HTML and then use this to convert it to a PDF.
```js
var html = ...; //Some HTML String from code above

htmlToPdf.convertHTMLString(html, 'path/to/destination.pdf',
    function (error, success) {
        if (error) {
            console.log('Oh noes! Errorz!');
            console.log(error);
        } else {
            console.log('Woot! Success!');
            console.log(success);
        }
    }
);
```
### Debug Mode ###
If you want to see the output you can set debug mode to true to see the output of the PDF Renderer (debug is false by default):
```js
htmlToPdf.setDebug(true);
```

### Encoding Settings ###
If using a particular encoding type is important to getting the output you want, you can set the encoding types for both the input and output:
```js
htmlToPdf.setInputEncoding('UTF-8');
htmlToPdf.setOutputEncoding('UTF-8');
```
Thanks to bplaa-yai for this feature!

## Heads Up ##
html-to-pdf uses a Java process in the background. That means you will need Java installed to use it. Additionally, the Java process utilizes a library called flyingsaucer:

https://github.com/flyingsaucerproject/flyingsaucer

Flyingsaucer has some contraints on CSS styling and some extra styling features to define PDF parameters. html-to-pdf also uses these features by extension. Other than these two contraints, html-to-pdf is very lightweight.

Also, html-to-pdf creates a temporary file while converting. While it will clean up after itself, this file creation/deletion can trigger things like [forever](https://github.com/nodejitsu/forever) to restart the server. Adding the temp file to the ignore list should prevent this from happening.

## Thanks ##
If you decide to use html-to-pdf, thanks for the support! Let me know if you run into any issues or have any ideas!

## License ##
html-to-pdf uses the MIT license. Feel free to use it anywhere for anything!
