var express = require('express'),
    path = require('path'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator');

var mongo = require('./scripts/mongo'),
    processor = require('./scripts/processor'),
    wsj = require('./scripts/wsj-parser');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Start processor
//processor.start();

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

app.get('/stocks', function(req, res) {
    var sort = req.query.sort || null,
        sortOrder = parseInt(req.query.sortOrder) || null;
    mongo.getStocks(sort, sortOrder).then((response) => {
        res.send(response);
    });
});

app.get('/stocks/timestamp', function(req, res) {
    mongo.getStocksByTimestamp().then((response) => {
        res.send(response);
    });
});


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
