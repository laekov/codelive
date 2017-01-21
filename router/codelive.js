var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res) {
	res.status(200).sendFile(path.resolve(__dirname, '../client/codelive.html'));
});

module.exports = router;
