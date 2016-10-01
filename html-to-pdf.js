var child_process = require('child_process'),
    fs = require('fs'),
    UUIDGenerator = require('node-uuid'),
    debug = false,
    inputEncoding = null,
    outputEncoding = null;
    getBase64 = false;

exports.setDebug = function (newDebug) {
    debug = newDebug;
};

exports.setInputEncoding = function (enc) {
    inputEncoding = enc;
};

exports.setOutputEncoding = function (enc) {
    outputEncoding = enc;
};

exports.setBase64Output = function (bool) {
    getBase64 = bool;
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

exports.convertHTMLFile = function (htmlPath, pdfPath, callback) {
    var pdfFileName = pdfPath;
    
    if (getBase64) {
        pdfFileName = UUIDGenerator.v4() + '.pdf';
    }

    var args = ['-jar', __dirname + '/PDFRenderer.jar'];
    if (inputEncoding !== null) {
        args.push('--input-encoding', inputEncoding);
    }
    if (outputEncoding !== null) {
        args.push('--output-encoding', outputEncoding);
    }
    args.push(htmlPath, pdfFileName);
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
        var result = {process_code: code};
        if (getBase64) {
            convertBase64(pdfFileName, function (err, base64) {
                if (err) {
                    callback(err);
                } else {
                    result.base64 = base64;
                    callback(null, result);
                }
            });
        } else {
            callback(null, result);
        }
    });
};
