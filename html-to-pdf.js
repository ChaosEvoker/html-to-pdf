var child_process = require('child_process'),
    fs = require('fs'),
    UUIDGenerator = require('node-uuid'),
    debug = false,
    inputEncoding = null,
    outputEncoding = null;

exports.setDebug = function (newDebug) {
    debug = newDebug;
};

exports.setInputEncoding = function (enc) {
    inputEncoding = enc;
};

exports.setOutputEncoding = function (enc) {
    outputEncoding = enc;
};

var convertBase64 = function (pdfPath, callback) {
    fs.readFile(pdfPath, function (err, data) {
        if (err) {
            callback(err);
        } else {
            fs.unlink(pdfPath, function (deleteError) {
                if (deleteError) {
                    callback(deleteError);
                } else {
                    callback(null, data.toString('base64'));
                }
            });
        }
    });
}

exports.convertHTMLStringToBase64PDF = function (html, callback) {
    var self = this, pdfFileName = UUIDGenerator.v4() + '.pdf';

    self.convertHTMLString(html, pdfFileName, function (error, result) {
        if (error) {
            callback(error);
        } else {
            convertBase64(pdfFileName, function (err, base64) {
                if (err) {
                    callback(err);
                } else {
                    result.base64 = base64;
                    callback(null, result);
                }
            });
        }
    });
};

exports.convertHTMLFileToBase64PDF = function (html, callback) {
    var self = this, pdfFileName = UUIDGenerator.v4() + '.pdf';

    self.convertHTMLFile(html, pdfFileName, function (error, result) {
        if (error) {
            callback(error);
        } else {
            convertBase64(pdfFileName, function (err, base64) {
                if (err) {
                    callback(err);
                } else {
                    result.base64 = base64;
                    callback(null, result);
                }
            });
        }
    });
};

exports.convertHTMLString = function (html, pdfPath, callback) {
    var self = this, uniqueID = UUIDGenerator.v4();

    fs.writeFile(uniqueID + '.html', html, function (err) {
        if (err) {
            callback(err);
        } else {
            self.convertHTMLFile(uniqueID + '.html', pdfPath, function (error, results) {
                if (error) {
                    callback(error);
                } else {
                    fs.unlink(uniqueID + '.html', function (deleteError) {
                        if (deleteError) {
                            callback(deleteError);
                        } else {
                            callback(null, results);
                        }
                    });
                }
            });
        }
    });
};

exports.convertHTMLFile = function (htmlPath, pdfPath, callback) {
    var args = ['-jar', __dirname + '/PDFRenderer.jar'];
    if (inputEncoding !== null) {
        args.push('--input-encoding', inputEncoding);
    }
    if (outputEncoding !== null) {
        args.push('--output-encoding', outputEncoding);
    }
    args.push(htmlPath, pdfPath);
    var renderer = child_process.spawn('java', args);
    renderer.on('error', function (error) {
        callback(error);
    });
    if (debug) {
        renderer.stdout.on('data', function (data) {
            console.log('STDOUT: ' + data);
        });
        renderer.stderr.on('data', function (data) {
            console.log('STDERR: ' + data);
        });
    }
    renderer.on('exit', function (code) {
        callback(null, {process_code: code});
    });
};
