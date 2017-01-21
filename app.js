var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

app.use(bodyParser.urlencoded({ 
    extended: false,
    limit: 128 * 1024 * 1024
}));
app.use(bodyParser.json({
    limit: 128 * 1024 * 1024
}));

app.use('/cdn', express.static(path.resolve(__dirname, 'client/bower_components')));
app.use('/static', express.static(path.resolve(__dirname, 'client')));
app.use('/downloads', express.static(path.resolve(__dirname, '../downloads')));
app.use('/d', require('./router/downloads'));
app.use('/codelive', require('./router/codelive'));
app.use(function(req, res, next) {
    res.status(404).send('Page not found');
});

module.exports = app;
