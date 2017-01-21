(function() { 
    var app = new Vue({
        el: '#fileapp',
        data: {
            loading: true,
            uploading: false,
            files: [],
            error: undefined
        },
        created: function() {
            this.updateList();
        },
        methods: {
            updateList: function() {
				this.$http.post('/d/list').then(function(res) {
                    this.$data.loading = false;
                    this.$data.files = res.body.sort(function(a, b) {
                        return (a.time === b.time) ? 0 : (a.time < b.time) ? 1 : -1;
                    });
                }).catch(function(error) {
                    this.$data.error = error;
                });
            },
			uploadFile: function(fileList) {
                for (var i in fileList) {
                    var file = fileList[i];
                    if (typeof(file) !== 'object') {
                        return false;
                    }
                    var reader = new FileReader();
                    var frm = {
                        size: file.size,
                        name: file.name,
                    };
                    reader.onload = function() {
                        frm.content = btoa(this.result);
                        app.$data.uploading = true;
                        Vue.http.post('/d/upload', frm).then(function(res) {
                            app.$data.uploading = false;
                            app.updateList();
                        }).catch(function(error) {
                            app.$data.uploading = false;
                            app.$data.error = error.body;
                        });
                    };
                    reader.readAsBinaryString(file);
                }
            },
            uploadSelect: function() {
                app.uploadFile(document.getElementById('uploader').files);
            }
        }
    });
    document.body.addEventListener('dragover', function(e) { 
		e.preventDefault();
	});
	document.body.addEventListener('dragenter', function(e) { 
        e.preventDefault();
    });
    document.body.addEventListener('dragleave', function(e) { 
        e.preventDefault();
    });
    document.body.addEventListener('drop', function(e) { 
        e.preventDefault();
        e = e || window.event;
        var fileList = e.dataTransfer.files;
        app.uploadFile(fileList);
    });
})();

