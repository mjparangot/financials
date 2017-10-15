var express = require('express');
var path = require('path');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.load();

var app = express();

var wsj = require('./scripts/wsj-parser');

app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Production error handler
if (app.get('env') === 'production') {
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.sendStatus(err.status || 500);
    });
}

/*
app.get('*', function(req, res) {
    res.redirect('/#' + req.originalUrl);
});
*/

app.get('/moneyflows', function(req, res) {
    wsj.getMoneyflows(true).then((response) => {
        res.send(response);
    });
});

app.get('/moneyflows/buy', function(req, res) {
    wsj.getBuyStocks().then((response) => {
        res.send(response);
    });
});

app.get('/moneyflows/sell', function(req, res) {
    wsj.getSellStocks().then((response) => {
        res.send(response);
    });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
