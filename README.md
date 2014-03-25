html-to-pdf
===========

A Node wrapper around a Java HTML to PDF converter to allow users to make HTML templates for automated generation of PDFs. While often in Node this is achieved through phantomjs, for larger PDF reports each report being a large image can make the file very large very quickly. This aims to fix that problem by using the Java library flyingsaucer to do the heavy lifting and providing a Node wrapper around it for ease of use with web applications.

## Installation ##
To install html-to-pdf simply use NPM:

`npm install html-to-pdf`

## How To Use html-to-pdf ##
To use html-to-pdf in your Node application, just require it:

`var htmlToPdf = require('html-to-pdf');`

### Basic Example ###
`pdfConverter.convertHTMLFile('path/to/source.html', 'path/to/destination.pdf', `
`    function (error, success) {`
`       if (error) {`
`            console.log('Oh noes! Errorz!');`
`            console.log(error);`
`        } else {`
`            console.log('Woot! Success!');`
`            console.log(success);`
`        }`
`    }`
`);`
