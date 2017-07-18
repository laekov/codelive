var express = require('express');
var router = express.Router();

var datas = (function() {
	var self = this;
	self.diffs = [];
	self.diffc = {};
	self.addDiff = function(id) {
		self.diffs.push({
			id: id,
			time: Date.now()
		});
		if (self.diffc[id] === undefined) {
			self.diffc[id] = 0;
		}
		++ self.diffc[id];
		var dt = Date.now() - 5 * 60 * 1000;
		while (self.diffs.length > 0 && self.diffs[0].time < dt) {
			-- self.diffc[self.diffs[0].id];
			self.diffs.shift();
		}
	};
	self.get = function() {
		return {
			count: self.diffc,
			rec: self.diffs.slice(-32)
		};
	};
	return self;
})();

router.post('/remark', function(req, res, next) {
	datas.addDiff(req.body.diff);
	res.status(200).send({});
});

router.post('/get', function(req, res, next) {
	res.status(200).send(datas.get());
});

module.exports = router;
