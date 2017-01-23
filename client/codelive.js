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
			setTimeout(function() {
				checkCode();
			}, 1000);
			displayCode(res);
		}, function(error) {
			setTimeout(function() {
				checkCode();
			}, 10000);
			displayError('Error ' + error.status + '. Retry in 10 seconds');
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
	});
	checkCode();
})();
