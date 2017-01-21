var app = require('./app');
var port = process.env.PORT || '3773';
var addr = process.env.ADDR || '127.0.0.1';
app.listen(port, addr, function(error) {
    console.log('App listening on ' + addr + ':' + port);
});
