html-to-pdf
===========

A Node wrapper around a Java HTML to PDF converter to allow users to make HTML templates for automated generation of PDFs. While often in Node this is achieved through phantomjs, for larger PDF reports each report being a large image can make the file very large very quickly. This aims to fix that problem by using the Java library flyingsaucer to do the heavy lifting and providing a Node wrapper around it for ease of use with web applications.

## Installation ##
To install html-to-pdf simply use NPM:
`npm install html-to-pdf`
