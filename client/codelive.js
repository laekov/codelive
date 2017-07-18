(function() {
	function escapeHtml(text) {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
	var prevCode = [];
	var displayCode = function(res, force) {
		var curCode = escapeHtml(res).split('\n');
		if (curCode.join('---') === prevCode.join('---') && !force) {
			return;
		}
		if (curCode[0] === 'ref') {
			window.location.href = window.location.href;
		}
		var resCode = [];
		for (var i = 0, j = 0; i < curCode.length; ++ i) {
			var linear = '';
			if ($('#plain').prop('checked')) {
				linear = '<code class="linear">' + (i + 1) + '</code>';
			}
			if (prevCode.indexOf(curCode[i]) === -1) {
				resCode.push(linear + '<code class="current content">' + curCode[i] + '</code>');
			} else {
				resCode.push(linear + '<code class="content">' + curCode[i] + '</code>');
			}
		}
		prevCode = curCode;
		$('#error').html('');
		$('#code').html(resCode.join('\n'));
		hljs.highlightBlock($('#code')[0]);
	};
	var displayError = function(res) {
		$('#error').html(res);
	};
	var fetchCode = function(resolve, reject) {
		$.get('/codelive/code', resolve).fail(reject);
	};
	var checkCode = function() {
		fetchCode(function(res) {
			displayCode(res);
		}, function(error) {
			displayError('Error ' + error.status + '. Retry in 10 seconds');
		});
	};
	var lastSend = 0;
	var sendDiff = function(id) {
		if (Date.now() - lastSend < 30 * 1000) {
			alert('半分钟才能点一次哦 qwq');
			return;
		}
		lastSend = Date.now();
		$.post('/codelive/api/remark', {
			diff: id
		}, function(data) {
			getDiff();
		});
	};
	$(document).ready(function() {
		$('#forceUpdate').click(function() {
			fetchCode(function(res) {
				displayCode(res, true);
			}, function(error) {
				displayError('Error ' + error.status + '.');
			});
		});
		$('#remarkhard').click(function() {
			sendDiff(0);
		});
		$('#remarkeasy').click(function() {
			sendDiff(1);
		});
	});
	setInterval(checkCode, 1000);
	var printDiffs = function(data) {
		if (data.count[0] === undefined) {
			data.count[0] = 0;
		}
		if (data.count[1] === undefined) {
			data.count[1] = 0;
		}
		$('#cnthard').html('(' + data.count[0] + ')');
		$('#cnteasy').html('(' + data.count[1] + ')');
		if (data.count[0] - data.count[1] > 10) {
			$('#remarkhard').addClass('btn-danger');
		} else {
			$('#reamrkhard').removeClass('btn-danger');
		}
		if (data.count[1] - data.count[0] > 10) {
			$('#remarkeasy').addClass('btn-danger');
		} else {
			$('#remarkeasy').removeClass('btn-danger');
		}
		var list = '';
		var sentences = {
			0: '太难了',
			1: '太水了'
		};
		var rlist = data.rec.reverse();
		for (var i in rlist) {
			var d = new Date;
			d.setTime(rlist[i].time);
			list += '<ul>有人在' + d.toLocaleTimeString() + '表示' + sentences[rlist[i].id] + '</ul>';
		}
		$('#recs').html(list);
	};
	var getDiff = function() {
		$.post('/codelive/api/get', {}, function(data) {
			printDiffs(data);
		});
	};
	setInterval(getDiff, 1000);
})();

