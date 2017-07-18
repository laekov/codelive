var express = require('express');
var router = express.Router();
var path = require('path');
var FileCache = require('../modules/live');
var fileCache = new FileCache(path.resolve(__dirname, '../../downloads/live.cc'));

router.get('/', function(req, res) {
	res.status(200).sendFile(path.resolve(__dirname, '../client/codelive.html'));
});
router.get('/code', function(req, res) {
	res.status(200).send(fileCache.getContent());
});

router.use('/api', require('./api'));

module.exports = router;
