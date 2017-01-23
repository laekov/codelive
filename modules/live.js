var fs = require('fs');
var FileCache = function(path) {
	var self = this;
	self.path = path;
	self.content = '';
	self.getContent = function() {
		return self.content;
	};
	self.fetchFile = function() {
		fs.readFile(self.path, function(err, data) {
			if (!err) {
				self.content = String(data);
			} else {
				console.error(error);
			}
		});
		setTimeout(function() {
			self.fetchFile();
		}, 1000);
	};
	self.fetchFile();
};

module.exports = FileCache;
