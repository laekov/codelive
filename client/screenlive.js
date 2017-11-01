(function() {
	setInterval(function() {
		$.get('/screenlive/get', function(data) {
			$('#scrimg').attr('src', 'data:image/png;base64,' + data);
		});
	}, 200);
})();

