var child_process = require('child_process'),
    fs = require('fs'),
    debug = false;

exports.setDebug = function (newDebug) {
    debug = newDebug;
};

exports.convertHTMLString = function (html, pdfPath, callback) {
    var self = this;
    fs.writeFile('temp.html', html, function (err) {
        if (err) {
            callback(err)
        } else {
            self.convertHTMLFile('temp.html', pdfPath, function (error, results) {
                fs.unlink('temp.html', function (deleteError) {
                    if (deleteError) {
                        callback(deleteError);
                    } else {
                        callback(null, results);
                    }
                });
            });
        }
    });
};

exports.convertHTMLFile = function (htmlPath, pdfPath, callback) {
    var renderer = child_process.spawn('java', ['-jar', __dirname + '/PDFRenderer.jar', htmlPath, pdfPath]);
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
