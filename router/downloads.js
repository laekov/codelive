var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var pathName = path.resolve(__dirname, '../../downloads');
var atob = require('atob');
var btoa = require('btoa');

router.post('/list', function(req, res, next) {
    fs.readdir(pathName, function(error, doc) {
        if (error) {
            return res.status(500).send(error);
        }
        var data = [];
        for (var i in doc) {
            var fileName = doc[i];
            if (fileName === '.' || fileName === '..') {
                continue;
            }
			var fileInfo = fs.statSync(path.resolve(pathName, fileName));
            data.push({
                name: fileName,
                time: fileInfo.ctime,
				size: fileInfo.size,
            });
        }
        res.status(200).send(data);
    });
});

router.post('/upload', function(req, res, next) {
    if (req.body.size > 1024 * 1024 * 10) {
        return res.status(400).send('file size execeeded');
    }
    if (typeof(req.body.name) !== 'string' || req.body.name.match(/\.\./) !== null) {
        return res.status(400).send('illegal content');
    }
    var stream = fs.createWriteStream(path.resolve(pathName, req.body.name));
	stream.write(req.body.content, 'base64');
	stream.end(function(err) {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send('done');
    });
});

router.get('/', function(req, res, next) {
    res.status(200).sendFile(path.resolve(__dirname, '../client/index.html'));
});

module.exports = router;
