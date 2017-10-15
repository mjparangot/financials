var Baby = require('babyparse'),
    fs = require('fs'),
    request = require('request'),
    mongo = require('./mongo');

var getMoneyflows = function(buy) {
    return new Promise((resolve, reject) => {
        var url;
        if (buy) {
            url = 'http://www.wsj.com/mdc/public/npage/2_3045-mfgppl-mfxml2csv.html';
        } else {
            url = 'http://www.wsj.com/mdc/public/npage/2_3045-mflppg-mfxml2csv.html';
        }
        request.get(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                var csv = body;
                var parsed = Baby.parse(csv, {
                    skipEmptyLines: true,
                    delimiter: '\t'
                });
                resolve(parsed.data);
            } else {
                reject(error);
            }
        });
    })
};

var parseMoneyflows = function(data, flow) {
    var parsed = [],
        index = 3;
    while (data[index] != null) {
        var obj = {
            company:                    data[index][0],
            name:                       data[index][0].substring(0, data[index][0].lastIndexOf('(') - 1),
            symbol:                     data[index][0].substring(data[index][0].lastIndexOf('(') + 1, data[index][0].lastIndexOf(')')),
            price:                      parseFloat(data[index][1], 2),
            change:                     parseFloat(data[index][2], 2),
            percent_change:             parseFloat(data[index][3], 2),
            one_week_percent_change:    parseFloat(data[index][4], 2),
            total_money_flow:           parseFloat(data[index][5], 2),
            total_tick_up:              parseFloat(data[index][6], 2),
            total_tick_down:            parseFloat(data[index][7], 2),
            total_up_down_ratio:        parseFloat(data[index][8], 2),
            block_trades_money_flow:    parseFloat(data[index][9], 2),
            block_trades_tick_up:       parseFloat(data[index][10], 2),
            block_trades_tick_down:     parseFloat(data[index][11], 2),
            block_trades_up_down_ratio: parseFloat(data[index][12], 2),
            timestamp:                  data[0][0].substring(data[0][0].indexOf(',') + 3, data[0][0].length),
            flow:                       flow
        };
        parsed.push(obj);
        index++;
    }
    mongo.upsertMoneyflows(parsed);
    return parsed;
};

var getBuyStocks = function() {
    return new Promise((resolve, reject) => {
        getMoneyflows(true).then((data) => {
            if (!data) {
                reject('error');
            } else {
                resolve(parseMoneyflows(data, 'buy'));
            }
        })
    });
};

var getSellStocks = function() {
    return new Promise((resolve, reject) => {
        getMoneyflows(false).then((data) => {
            if (!data) {
                reject('error');
            } else {
                resolve(parseMoneyflows(data, 'sell'));
            }
        })
    });
};

module.exports = {
    getMoneyflows: getMoneyflows,
    getBuyStocks: getBuyStocks,
    getSellStocks: getSellStocks
};
