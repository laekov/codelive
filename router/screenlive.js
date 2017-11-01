var express = require('express');
var router = express.Router();
var path = require('path');
var cp = require('child_process');
var fs = require('fs');

var fileContent = {};
var lastRef = 0;
var mtx = false;

setInterval(function() {
	if (Date.now() - 200 < lastRef || mtx) {
		return;
	}
	mtx = true;
	lastRef = Date.now();
	cp.exec('screencapture client/rtest.png');
	cp.exec('convert -resize 40% client/rtest.png client/test.png', function() {
		fs.readFile('client/test.png', function(error, raw) {
			fileContent.raw = new Buffer(raw).toString('base64');
			mtx = false;
		});
	});
}, 200);

router.get('/', function(req, res) {
	res.status(200).sendFile(path.resolve(__dirname, '../client/screenlive.html'));
});
router.get('/get', function(req, res) {
	res.status(200).send(fileContent.raw);
});

module.exports = router;
