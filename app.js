var fs = require('fs');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config');
var routes = require('./routes/index');
var ethClient = require('./routes/eth-client');
var async = require('async');
var os = require('os');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
    res.send({'index': 'home'});
})

app.get('/connection', function (req, res) {
    //res.send({'status': 'success'});
    res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
    var data = {
            "status": "ok"
    };
    data = JSON.stringify(data);
    var callback = req.query.callback+'('+data+');';
    res.end(callback);

})

app.get('/getinstancename', function (req, res) {
    //res.send({'status': 'success'});
/*
    fs.readFile('/etc/hostname', 'utf8', function(err, data) {
        if (!err) {
            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
            var host = {
                    "instance-name": data
            };
            host = JSON.stringify(host);
            var callback = req.query.callback+'('+host+');';
            res.end(callback);
        }
    });
*/
    {
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
        var data = os.hostname();
        var host = {
                "instance-name": data
        };
        host = JSON.stringify(host);
        var callback = req.query.callback+'('+host+');';
        res.end(callback);
    }

})

app.get('/totalaccounts', ethClient.total_accounts)

app.get('/newaccount', ethClient.new_account)

app.get('/getbalance', ethClient.get_balance)

app.get('/transfer', ethClient.transfer)

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
